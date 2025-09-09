import  { EncRes } from "../../../../libs/enc.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import {
  FindAndDeleteUserById,
  FindUserById,
  FindUserByIdAndUpdate,
  GetUsersPagination,
  SearchUser,
} from "../model/index.js"
import { UserUpdate } from "../validation.js"
import { PaginationQuery } from "../../validation.js"
import z from "zod"


/** @typedef {(req: import("express").Request, res: import("express").Response) => Promise<void>} ExpressFn */

export default class UserController {
  /** @type {ExpressFn} */
  static async profile(req, res) {
    const userId = req.userId
    if (!userId) throw new ErrorResponse("User ID missing from token", 401)

    const user = await FindUserById(userId)
    if (!user) throw new ErrorResponse("User not found", 404)

    const encres = EncRes("User found", 200, { user: user.toObject() })

    res.status(200).send(encres)
  }

  /** @type {ExpressFn} */
  static async update(req, res) {
    if (!req.body) throw new ErrorResponse("No body provided in request header ")
    const userupdate = new UserUpdate(req.body)

    const userId = req.userId
    if (!userId) throw new ErrorResponse("User ID missing from token", 401)

    console.log("request body data: " + userupdate.data)

    const updateduser = await FindUserByIdAndUpdate(userId, userupdate)

    const encres = EncRes("User Updated", 200, { user: updateduser })

    res.status(200).send(encres)

    return
  }

  /** @type {ExpressFn} */
  static async getUsers(req, res) {
    const pagination = new PaginationQuery(req.query)
    const users = await GetUsersPagination(pagination)
    if (users.length <= 0) throw new ErrorResponse("No User Found", 404)

    const encres = EncRes("Users found", 200, {
      ...pagination.data,
      users
    })

    res.status(200).send(encres)
  }

  /** @type {ExpressFn} */
  static async search(req, res) {
    const queryparsed = z.string().min(1).safeParse(req.query?.q)
    if (!queryparsed.success) {
      throw new ErrorResponse(queryparsed.error.issues[0].message, 400)
    }

    const search = queryparsed.data

    const users = await SearchUser(search)
    if (users.length <= 0) throw new ErrorResponse("No User Found", 404)

    const encres = EncRes("Users found", 200, { users })

    res.status(200).send(encres)
  }

  /** @type {ExpressFn} */
  static async delete(req, res) {
    const userId = req.userId
    if (!userId) throw new ErrorResponse("User ID missing from token", 401)

    const user = await FindAndDeleteUserById(userId)
    if (!user) throw new ErrorResponse("User not found", 404)

    res.sendStatus(204)
  }
}
