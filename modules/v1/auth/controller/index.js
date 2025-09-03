import { validation } from "../validation.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { FindUserByEmail, NewUser } from "../model/index.js"

export default class AuthController {
  /**
   *
   * @param {import('express').Request} req - The Express request object, contains post data in req.body.
   * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
   *
   * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
   */
  static async signin(req, res) {
    const parsedBody = await validation.signingbody.safeParseAsync(req.body)
    if (!parsedBody.success) throw new ErrorResponse("Not Valid data", 400)

    const { data } = parsedBody

    const existingUser = await FindUserByEmail(data.email)
    if (existingUser) throw new ErrorResponse("User already exists in database", 409)

    await NewUser(data)

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
