import Encryption from "../../../../libs/enc.js"
import {
  DeletePostById,
  FindPostById,
  FindPostByIdAndUpdate,
  GetPostPagination,
  NewPost,
} from "../model/index.js"
import { PostJson, PostUpdateJson } from "../validation.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { PaginationQuery } from "../../validation.js"

export default class PostController {
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

    if (!req.body) throw new ErrorResponse("No body provided in request header ")

    const postjson = new PostJson({ ...req.body, user_id: userId })

    const post = await NewPost(postjson)

    const { password, ...postres } = post

    const encres = Encryption.encrypt(
      JSON.stringify({
        code: 201,
        success: true,
        message: "Post created",
        data: {
          post: postres,
        },
      })
    )

    res.status(201).send(encres)
  }

  /**
   *
   * @param {import('express').Request} req - The Express request object, contains post data in req.body.
   * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
   *
   * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
   */
  static async update(req, res) {
    if (!req.body) throw new ErrorResponse("No body provided in request header ")

    const userId = req.userId
    if (!userId) throw new ErrorResponse("User ID missing from token", 401)

    const postupdate = new PostUpdateJson({ ...req.body, user_id: userId })

    console.log("request body data: " + postupdate.data)

    const updatedpost = await FindPostByIdAndUpdate(postupdate)

    const encres = Encryption.encrypt(
      JSON.stringify({
        code: 200,
        success: true,
        message: "Post Updated",
        data: {
          post: updatedpost,
        },
      })
    )

    res.status(200).send(encres)

    return
  }

  /**
   *
   * @param {import('express').Request} req - The Express request object, contains post data in req.body.
   * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
   *
   * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
   */
  static async getPost(req, res) {
    const id = req.params.id
    if (!id || id === "" || id.length <= 0)
      new ErrorResponse("bad request, user id not found or valid", 400)

    const post = await FindPostById(id)
    if (!post) throw new ErrorResponse("Post not found")

    const encres = Encryption.encrypt(
      JSON.stringify({
        code: 200,
        success: true,
        message: "Post found",
        data: { post },
      })
    )

    res.status(200).send(encres)
  }

  /**
   *
   * @param {import('express').Request} req - The Express request object, contains post data in req.body.
   * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
   *
   * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
   */
  static async getAllPost(req, res) {
    const pagination = new PaginationQuery(req.query)
    const posts = await GetPostPagination(pagination)
    if (posts.length <= 0) throw new ErrorResponse("No Post Found", 404)

    const encres = Encryption.encrypt(
      JSON.stringify({
        code: 200,
        message: "Posts found",
        success: true,
        ...pagination.data,
        data: {
          posts,
        },
      })
    )

    res.status(200).send(encres)
  }

  /**
   *
   * @param {import('express').Request} req - The Express request object, contains post data in req.body.
   * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
   *
   * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
   */
  static async delete(req, res) {
    const userId = req.userId
    if (!userId) throw new ErrorResponse("User ID missing from token", 401)

    const id = req.params.id
    if (!id || id === "" || id.length <= 0)
      new ErrorResponse("bad request, user id not found or valid", 400)
    const post = await DeletePostById(id, userId)
    if(!post) throw new ErrorResponse("Post not found", 404)

    res.sendStatus(204)
  }
}
