import Post from "../../../../database/models/Post.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { PaginationQuery } from "../../validation.js"

export const FindPostById = async id => await Post.findById(id).exec()

/** @param {import("../validation.js").PostUpdateJson} */
export const NewPost = async ({ data }) => {
  const post = new Post(data)

  await post.validate().catch(err => {
    console.log("Error while validating post: " + err)
    throw new ErrorResponse("not valid data for database schema: " + err.message, 422)
  })

  await post.save().catch(err => {
    console.log(`Error while saving post in db: ${err.message}`)
    throw new ErrorResponse("Failed to save post in database", 500)
  })

  return post.toObject()
}

/** @param {import("../validation.js").PostUpdateJson} postupdatejson*/
export const FindPostByIdAndUpdate = async ({ data: { post_id, user_id, ...rest } }) =>
  await Post.findOneAndUpdate({ _id: post_id, user_id }, rest)
    .exec()
    .catch(err => {
      console.log(`Error while saving post in db: ${err.message}`)
      throw new ErrorResponse("Failed to save post in database", 500)
    })

/**
 *
 * @param {PaginationQuery} pagination
 */
export const GetPostPagination = async ({ data: { limit, page } }) =>
  await Post.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .exec()
    .catch(err => {
      console.log(`Error while fetching users from db: ${err}`)
      throw new ErrorResponse("internal server error while fetching users", 500)
    })

export const DeletePostById = async (id, userId) => await Post.findOneAndDelete({_id: id, user_id: userId}).exec()
