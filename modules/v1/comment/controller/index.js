import { EncRes } from "../../../../libs/enc.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { DeleteCommentById, GetCommentById, NewComment } from "../model/index.js"
import { CommentJson, CommentUpdateJson } from "../validation.js"

/** @typedef {(req: import("express").Request, res: import("express").Response) => Promise<void>} ExpressFn */

export default class CommentController {
  /** @type {ExpressFn} */
  static async create(req, res) {
    const userId = req.userId
    if (!userId) throw new ErrorResponse("User ID missing from token", 401)
    const commentjson = new CommentJson({ ...req.body, user_id: userId })
    const comment = await NewComment(commentjson)
    const encres = EncRes("Comment created", 200, { comment })
    res.status(200).send(encres)
  }

  /** @type {ExpressFn} */
  static async update(req, res) {
    const userId = req.userId
    if (!userId) throw new ErrorResponse("User ID missing from token", 401)

    const {
      data: { commentId, content },
    } = new CommentUpdateJson(req.body)

    // const comment = await UpdateComment(commentjson)
    const comment = await GetCommentById(commentId)

    if (!comment) throw new ErrorResponse("Comment not found", 404)

    if (comment.user_id.toString() !== userId) {
      throw new ErrorResponse("Not authorized to update", 401)
    }

    comment.content = content

    await comment.save().catch(err => {
      console.log("Error while saving comment " + err)
      throw new ErrorResponse("Failed to save to database", 500)
    })

    const encres = EncRes("Comment updated", 200, {})

    res.status(200).send(encres)
  }

  /** @type {ExpressFn} */
  static async getById(req, res) {
    const id = req.body.id
    if (!id || id === "" || typeof id !== "string")
      throw new ErrorResponse("Comment ID missing from body", 401)

    const comment = await GetCommentById(id)
    if (!comment) throw new ErrorResponse("Comment not found", 404)
    const encres = EncRes("Comment found", 200, { comment: comment.toObject() })
    res.status(200).send(encres)
  }

  /** @type {ExpressFn} */
  static async delete(req, res) {
    const userId = req.userId
    if (!userId) throw new ErrorResponse("User ID missing from token", 401)

    const id = req.body.id
    if (!id || id === "" || typeof id !== "string")
      throw new ErrorResponse("Comment ID missing from body", 401)

    const comment = await GetCommentById(id)
    if (!comment) throw new ErrorResponse("Comment not found", 404)

    if (comment.user_id.toString() !== userId) {
      throw new ErrorResponse("Not Authorized", 401)
    }

    await DeleteCommentById(comment._id)

    res.sendStatus(204)
  }
}
