import { UserJson } from "../validation.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { FindUserByEmail, NewUser } from "../model/index.js"
import Encryption from "../../../../libs/enc.js"

export default class AuthController {
  /**
   *
   * @param {import('express').Request} req - The Express request object, contains post data in req.body.
   * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
   *
   * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
   */
  static async signup(req, res) {
    const userjson = new UserJson(req.body)

    const existingUser = await FindUserByEmail(userjson.data.email)
    if (existingUser) throw new ErrorResponse("User already exists in database", 409)

    const user = await NewUser(userjson)

    const STATUS = 201

    const encres = Encryption.encrypt(
      JSON.stringify({
        code: STATUS,
        success: true,
        message: "User created",
        data: {
          user: user.toObject(),
        },
      })
    )

    res.status(STATUS).send(encres)
  }
  /**
   *
   * @param {import('express').Request} req - The Express request object, contains post data in req.body.
   * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
   *
   * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
   */
  static async login(req, res) {}
  /**
   *
   * @param {import('express').Request} req - The Express request object, contains post data in req.body.
   * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
   *
   * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
   */
  static async logout(req, res) {}
}
