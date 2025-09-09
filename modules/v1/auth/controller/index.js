import { LoginJson, UserJson } from "../validation.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { FindUserByEmail, NewUser } from "../model/index.js"
import { EncRes } from "../../../../libs/enc.js"
import PasswordHashing from "../../../../libs/hash.js"
import { JwtToken } from "../../../../libs/jwt.js"


/** @typedef {(req: import("express").Request, res: import("express").Response) => Promise<void>} ExpressFn */

export default class AuthController {
  /** @type {ExpressFn} */
  static async signup(req, res) {
    if (!req.body) throw new ErrorResponse("Body not found", 400)
    const userjson = new UserJson(req.body)

    const existingUser = await FindUserByEmail(userjson.data.email)
    if (existingUser) throw new ErrorResponse("User already exists in database", 409)

    userjson.data.password = await PasswordHashing.hash(userjson.data.password)

    const user = await NewUser(userjson)

    const STATUS = 201

    const encres = EncRes("User created", 201, { user: user.toObject() })

    res.status(STATUS).send(encres)
  }
  /** @type {ExpressFn} */
  static async login(req, res) {
    if (!req.body) throw new ErrorResponse("Body not found", 400)
    const loginjson = new LoginJson(req.body)

    const user = await FindUserByEmail(loginjson.data.email)
    if (!user) throw new ErrorResponse("User not found", 404)

    const isMatch = await PasswordHashing.compare(loginjson.data.password, user.password)

    if (!isMatch) {
      throw new ErrorResponse("Invalid credentials", 401)
    }

    const token = await JwtToken.new({
      id: user._id.toString()
    })

    console.log("token:", token)

    const encres = EncRes("Logged in", 200, { token })

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
  
  /** @type {ExpressFn} */
  static async logout(_, res) {
    res.clearCookie("auth").sendStatus(200)
  }
}
