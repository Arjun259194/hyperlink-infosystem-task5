import Encryption from "../../../../libs/enc.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { FindUserById } from "../model/index.js"

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
}
