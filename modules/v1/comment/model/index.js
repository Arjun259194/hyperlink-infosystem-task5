import Comment from "../../../../database/models/Comment.js"
import Post from "../../../../database/models/Post.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { CommentJson, CommentUpdateJson } from "../validation.js"

/**
 *
 * @param {CommentJson} commentjson
 */
export const NewComment = async ({ data: { post_id, user_id, content } }) => {
  const post = await Post.findById(post_id).exec()
  if (!post) throw new ErrorResponse("No post found", 404)

  const comment = new Comment({ post_id, user_id, content })

  await comment.save().catch(err => {
    console.log(`${err}\nError while saving comment to db`)
    throw new ErrorResponse("Failed to store comment in db", 500)
  })

  return comment.toObject()
}

export const GetCommentById = async id =>
  await Comment.findById(id)
    .exec()
    .catch(err => {
      console.log(`${err}\nError while getting comment from db`)
      throw new ErrorResponse("Failed to getting comment from db", 500)
    })

export const DeleteCommentById = async id =>
  await Comment.findByIdAndDelete(id)
    .exec()
    .catch(err => {
      console.log(`${err}\nError while deleting comment from db`)
      throw new ErrorResponse("Failed to deleting comment from db", 500)
    })
