import { EncRes } from "../../../../libs/enc.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { NewComment, UpdateComment } from "../model/index.js"
import { CommentJson, CommentUpdateJson } from "../validation.js"

export default class CommentController {
  /**
   *
   * @param {import('express').Request} req - The Express request object, contains post data in req.body.
   * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
   *
   * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
   */
  static async create(req, res) {
    const userId = req.userId
    if (!userId) throw new ErrorResponse("User ID missing from token", 401)
    const commentjson = new CommentJson({ ...req.body, user_id: userId })
    const comment = await NewComment(commentjson)
    const encres = EncRes("Comment created", 200, { comment })
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
    const userId = req.userId
    if (!userId) throw new ErrorResponse("User ID missing from token", 401)

    const commentjson = new CommentUpdateJson(req.body)

    const comment = await UpdateComment(commentjson)

    if (!comment) throw new ErrorResponse("Comment not found", 404)

    const encres = EncRes("Comment updated", 200, { })

    res.status(200).send(encres)
  }
}
