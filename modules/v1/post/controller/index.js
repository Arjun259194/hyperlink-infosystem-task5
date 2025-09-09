import { EncRes } from "../../../../libs/enc.js"
import {
  DeletePostById,
  DeleteRepostById,
  DislikePost,
  FindPostById,
  FindPostByIdAndUpdate,
  GetPostPagination,
  LikePost,
  NewPost,
  NewRepostByPostId,
} from "../model/index.js"
import { PostJson, PostRepostJson, PostUpdateJson } from "../validation.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { PaginationQuery } from "../../validation.js"

/** @typedef {(req: import("express").Request, res: import("express").Response) => Promise<void>} ExpressFn */

export default class PostController {
  /** @type {ExpressFn} */
  static async create(req, res) {
    const userId = req.userId
    if (!userId) throw new ErrorResponse("User ID missing from token", 401)

    if (!req.body) throw new ErrorResponse("No body provided in request header ")

    const postjson = new PostJson({ ...req.body, user_id: userId })

    const post = await NewPost(postjson)

    const { password, ...postres } = post

    const encres = EncRes("Post created", 201, { post: postres })

    res.status(201).send(encres)
  }

  /** @type {ExpressFn} */
  static async update(req, res) {
    if (!req.body) throw new ErrorResponse("No body provided in request header ")

    const userId = req.userId
    if (!userId) throw new ErrorResponse("User ID missing from token", 401)

    const postupdate = new PostUpdateJson({ ...req.body, user_id: userId })

    console.log("request body data: " + postupdate.data)

    const updatedpost = await FindPostByIdAndUpdate(postupdate)

    const encres = EncRes("Post Updated", 200, { post: updatedpost })

    res.status(200).send(encres)

    return
  }

  /** @type {ExpressFn} */
  static async getPost(req, res) {
    const id = req.params.id
    if (!id || id === "" || id.length <= 0)
      new ErrorResponse("bad request, user id not found or valid", 400)

    const post = await FindPostById(id)
    if (!post) throw new ErrorResponse("Post not found")

    const encres = EncRes("Post found", 200, { post })

    res.status(200).send(encres)
  }

  /** @type {ExpressFn} */
  static async getAllPost(req, res) {
    const pagination = new PaginationQuery(req.query)

    const posts = await GetPostPagination(pagination)
    if (posts.length <= 0) throw new ErrorResponse("No Post Found", 404)

    const encres = EncRes("Posts found", 200, { ...pagination.data, posts })

    res.status(200).send(encres)
  }

  /** @type {ExpressFn} */
  static async delete(req, res) {
    const userId = req.userId
    if (!userId) throw new ErrorResponse("User ID missing from token", 401)

    const id = req.params.id
    if (!id || id === "" || id.length <= 0)
      new ErrorResponse("bad request, user id not found or valid", 400)
    const post = await DeletePostById(id, userId)
    if (!post) throw new ErrorResponse("Post not found", 404)

    res.sendStatus(204)
  }

  /** @type {ExpressFn} */
  static async like(req, res) {
    const userId = req.userId
    if (!userId) throw new ErrorResponse("User ID missing from token", 401)

    const id = req.params.id
    if (!id || id === "" || id.length <= 0)
      new ErrorResponse("bad request, user id not found or valid", 400)

    const likeobj = await LikePost(id, userId)

    const encres = EncRes("post liked", 200, likeobj)

    res.status(200).send(encres)
  }

  /** @type {ExpressFn} */
  static async dislike(req, res) {
    const userId = req.userId
    if (!userId) throw new ErrorResponse("User ID missing from token", 401)

    const id = req.params.id
    if (!id || id === "" || id.length <= 0)
      new ErrorResponse("bad request, user id not found or valid", 400)

    const likeobj = await DislikePost(id, userId)

    const encres = EncRes("post liked", 200, likeobj)

    res.status(200).send(encres)
  }

  /** @type {ExpressFn} */
  static async repost(req, res) {
    const user_id = req.userId
    if (!user_id) throw new ErrorResponse("User ID missing from token", 401)

    const repostjson = new PostRepostJson({ ...req.body, user_id })

    const repost = await NewRepostByPostId(repostjson)

    const encres = EncRes("Repost created", 201, { repost })

    res.status(201).send(encres)
  }

  /** @type {ExpressFn} */
  static async removerepost(req, res) {
    const id = req.params.id
    if (!id || id === "" || id.length <= 0)
      new ErrorResponse("bad request, user id not found or valid", 400)

    const repost = await DeleteRepostById(id)
    if (!repost) throw new ErrorResponse("Repost not found", 404)

    res.sendStatus(204)
  }
}
