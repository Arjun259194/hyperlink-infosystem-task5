import { DeviceJson, LoginJson, UserJson } from "../validation.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { DeleteDeviceByUserId, FindUserByEmail, NewDeviceInfo, NewUser } from "../model/index.js"
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
    const encres = EncRes("User created", 201, { user: user.toObject() })
    res.status(201).send(encres)
  }

  /** @type {ExpressFn} */
  static async login(req, res) {
    if (!req.body) throw new ErrorResponse("Body not found", 400)
    console.log(req.body)
    const loginjson = new LoginJson(req.body.cred)

    console.log(loginjson.data.email)

    const user = await FindUserByEmail(loginjson.data.email)
    if (!user) throw new ErrorResponse("User not found by email", 404)

    const isMatch = await PasswordHashing.compare(loginjson.data.password, user.password)
    if (!isMatch) {
      throw new ErrorResponse("Invalid credentials", 401)
    }

    const token = await JwtToken.new({ id: user._id.toString() })

    const devicejson = new DeviceJson({
      ...req.body.device,
      user_id: user._id.toString(),
      app_version: "1.0.0",
      ip: req.ip,
      token,
    })

    const device = await NewDeviceInfo(devicejson)

    const encres = EncRes("Logged in", 200, { token, device })

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
  static async logout(req, res) {
    const userId = req.userId
    if (!userId) throw new ErrorResponse("User ID missing from token", 401)
    await DeleteDeviceByUserId(userId)
    res.clearCookie("auth").sendStatus(200)
  }
}
