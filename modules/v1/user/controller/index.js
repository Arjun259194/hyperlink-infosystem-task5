import Encryption from "../../../../libs/enc.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import {
  FindAndDeleteUserById,
  FindUserById,
  FindUserByIdAndUpdate,
  GetUsersPagination,
  SearchUser,
} from "../model/index.js"
import { PaginationQuery, UserUpdate } from "../validation.js"
import z from "zod"

export default class UserController {
  /**
   *
   * @param {import('express').Request} req - The Express request object, contains post data in req.body.
   * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
   *
   * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
   */
  static async profile(req, res) {
    const userId = req.userId
    if (!userId) throw new ErrorResponse("User ID missing from token", 401)

    const user = await FindUserById(userId)
    if (!user) throw new ErrorResponse("User not found", 404)

    const encres = Encryption.encrypt(
      JSON.stringify({
        code: 200,
        success: true,
        message: "User found",
        data: {
          user: user.toObject(),
        },
      })
    )

    res.status(200).send(encres)
  }

  /**
   *
   * @param {import('express').Request} req - The Express request object, contains post data in req.body.
   * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
   *
   * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
   */
  static async update(req, res) {
    if (!req.body) throw new ErrorResponse("No body provided in request header ")
    const userupdate = new UserUpdate(req.body)

    const userId = req.userId
    if (!userId) throw new ErrorResponse("User ID missing from token", 401)

    console.log("request body data: " + userupdate.data)

    const updateduser = await FindUserByIdAndUpdate(userId, userupdate)

    const encres = Encryption.encrypt(
      JSON.stringify({
        code: 200,
        success: true,
        message: "User Updated",
        data: {
          user: updateduser,
        },
      })
    )

    res.status(200).send(encres)

    return
  }

  /**
   *
   * @param {import('express').Request} req - The Express request object, contains post data in req.body.
   * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
   *
   * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
   */
  static async getUsers(req, res) {
    const pagination = new PaginationQuery(req.query)
    const users = await GetUsersPagination(pagination)
    if (users.length <= 0) throw new ErrorResponse("No User Found", 404)

    const encres = Encryption.encrypt(
      JSON.stringify({
        code: 200,
        message: "Users found",
        success: true,
        ...pagination.data,
        data: {
          users,
        },
      })
    )

    res.status(200).send(encres)
  }

  /**
   *
   * @param {import('express').Request} req - The Express request object, contains post data in req.body.
   * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
   *
   * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
   */
  static async search(req, res) {
    const queryparsed = z.string().min(1).safeParse(req.query?.q)
    if (!queryparsed.success) {
      throw new ErrorResponse(queryparsed.error.issues[0].message, 400)
    }

    const search = queryparsed.data

    const users = await SearchUser(search)
    if (users.length <= 0) throw new ErrorResponse("No User Found", 404)

    const encres = Encryption.encrypt(
      JSON.stringify({
        code: 200,
        message: "Users found",
        success: true,
        data: {
          users,
        },
      })
    )

    res.status(200).send(encres)
  }

  /**
   *
   * @param {import('express').Request} req - The Express request object, contains post data in req.body.
   * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
   *
   * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
   */
  static async delete(req, res) {
    const userId = req.userId
    if (!userId) throw new ErrorResponse("User ID missing from token", 401)

    const user = await FindAndDeleteUserById(userId)
    if (!user) throw new ErrorResponse("User not found", 404)

    res.sendStatus(204)
  }
}
