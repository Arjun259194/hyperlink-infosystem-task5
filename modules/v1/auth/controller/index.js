import { LoginJson, UserJson } from "../validation.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { FindUserByEmail, NewUser } from "../model/index.js"
import Encryption from "../../../../libs/enc.js"
import PasswordHashing from "../../../../libs/hash.js"
import { JwtToken } from "../../../../libs/jwt.js"

export default class AuthController {
  /**
   *
   * @param {import('express').Request} req - The Express request object, contains post data in req.body.
   * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
   *
   * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
   */
  static async signup(req, res) {
    if(!req.body) throw new ErrorResponse("Body not found", 400)
    const userjson = new UserJson(req.body)

    const existingUser = await FindUserByEmail(userjson.data.email)
    if (existingUser) throw new ErrorResponse("User already exists in database", 409)

    userjson.data.password = await PasswordHashing.hash(userjson.data.password)

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
  static async login(req, res) {
    if(!req.body) throw new ErrorResponse("Body not found", 400)
    const loginjson = new LoginJson(req.body)

    const user = await FindUserByEmail(loginjson.data.email)
    if (!user) throw new ErrorResponse("User not found", 404)

    const isMatch = await PasswordHashing.compare(loginjson.data.password, user.password)

    if (!isMatch) {
      throw new ErrorResponse("Invalid credentials", 401)
    }

    const token = JwtToken.new({
      id: user._id.toString()
    })

    const encres = Encryption.encrypt(
      JSON.stringify({
        code: 200,
        success: true,
        token,
      })
    )

    const ONEDAY = 24 * 60 * 60 * 1000 // 1 day in milliseconds

    res
      .cookie("auth", token, {
        httpOnly: true,
        secure: true,
        path: "/",
        expires: ONEDAY,
        maxAge: new Date(Date.now() + ONEDAY),
      })
      .status(200)
      .send(encres)
  }
  /**
   *
   * @param {import('express').Request} req - The Express request object, contains post data in req.body.
   * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
   *
   * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
   */
  static async logout(req, res) {}
}
