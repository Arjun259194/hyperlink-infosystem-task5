import Like from "../../../../database/models/Like.js"
import Post from "../../../../database/models/Post.js"
import Repost from "../../../../database/models/Repost.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { PaginationQuery } from "../../validation.js"
import { PostRepostJson } from "../validation.js"

export const FindPostById = async id =>
  await Post.findById(id)
    .populate("likes")
    .populate("comments")
    .populate("reposts")
    .exec()
    .catch(err => {
      console.log(`Failed to fetch post from database: ${err}`)
      throw new ErrorResponse(
        "Failed to fetch user from database",
        500
      )
    })

/** @param {import("../validation.js").PostUpdateJson} */
export const NewPost = async ({ data }) => {
  const post = new Post(data)

  await post.validate().catch(err => {
    console.log("Error while validating post: " + err)
    throw new ErrorResponse(
      "not valid data for database schema: " + err.message,
      422
    )
  })

  await post.save().catch(err => {
    console.log(`Error while saving post in db: ${err.message}`)
    throw new ErrorResponse("Failed to save post in database", 500)
  })

  return post.toObject()
}

/** @param {import("../validation.js").PostUpdateJson} postupdatejson*/
export const FindPostByIdAndUpdate = async ({
  data: { post_id, user_id, ...rest },
}) =>
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
    .populate("likes")
    .populate("comments")
    .populate("reposts")
    .skip((page - 1) * limit)
    .limit(limit)
    .exec()
    .catch(err => {
      console.log(`Error while fetching users from db: ${err}`)
      throw new ErrorResponse(
        "internal server error while fetching users",
        500
      )
    })

export const DeletePostById = async (id, userId) =>
  await Post.findOneAndDelete({
    _id: id,
    user_id: userId,
  }).exec()

/**
 * @param {string} post_id
 * @param {string} user_id
 */

export const LikePost = async (post_id, user_id) => {
  const post = await FindPostById(post_id)
  if (!post) throw new ErrorResponse("No post found", 404)

  const like = await Like.findOne({
    post_id,
    user_id,
  }).exec()
  if (like) {
    like.state = like.state === "Liked" ? "None" : "Liked"
    await like.save()
    return like.toObject()
  }

  const newLike = new Like({
    post_id,
    user_id,
    state: "Liked",
  })

  await newLike.save()
  return newLike.toObject()
}

/**
 * @param {string} post_id
 * @param {string} user_id
 */

export const DislikePost = async (post_id, user_id) => {
  const post = await FindPostById(post_id)
  if (!post) throw new ErrorResponse("No post found", 404)

  const like = await Like.findOne({
    post_id,
    user_id,
  }).exec()
  if (like) {
    like.state = like.state === "Disliked" ? "None" : "Disliked"
    await like.save()
    return like.toObject()
  }

  const newLike = new Like({
    post_id,
    user_id,
    state: "Disliked",
  })

  await newLike.save()
  return newLike.toObject()
}

/**
 * @param {PostRepostJson} arg1
 */
export const NewRepostByPostId = async ({
  data: { post_id, user_id, thought },
}) => {
  const post = await FindPostById(post_id)
  if (!post) throw new ErrorResponse("No post found", 404)

  const newRepost = new Repost({
    post_id,
    user_id,
    thought,
  })

  await newRepost.save().catch(err => {
    console.log(`Error while saving repost in db: ${err}`)
    throw new ErrorResponse(
      "internal server error while saving repost",
      500
    )
  })

  return newRepost.toObject()
}

/** * @param {string} id */
export const DeleteRepostById = async id => {
  return await Repost.findOneAndDelete({
    _id: id,
  })
    .exec()
    .catch(err => {
      console.log(`Error while deleting repost in db: ${err}`)
      throw new ErrorResponse(
        "internal server error while deleting repost",
        500
      )
    })
}

/** * @param {string} id */
export const GetRepostById = async id => {
  return await Repost.findById(id)
    .exec()
    .catch(err => {
      console.log(`Error while fetching repost from db: ${err}`)
      throw new ErrorResponse(
        "internal server error while fetching repost",
        500
      )
    })
}

/**
 *
 * @param {PaginationQuery} pagination
 */

export const GetTrendingPostsWithPagination = async ({
  data: { page, limit },
}) =>
  await Post.aggregate([
    { $match: { status: "Uploaded" } },
    {
      $lookup: {
        as: "dislikes",
        from: "likes",
        let: { this_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$post_id", "$$this_id"],
              },
            },
          },
          { $match: { status: "Disliked" } },
        ],
      },
    },
    {
      $lookup: {
        as: "likes",
        from: "likes",
        let: { this_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$post_id", "$$this_id"],
              },
            },
          },
          { $match: { status: "Liked" } },
        ],
      },
    },
    {
      $lookup: {
        localField: "_id",
        foreignField: "post_id",
        as: "reposts",
        from: "reposts",
      },
    },
    {
      $lookup: {
        localField: "_id",
        foreignField: "post_id",
        as: "comments",
        from: "comments",
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$likes" },
        commentCount: { $size: "$comments" },
        repostCount: { $size: "$reposts" },
        dislikeCount: { $size: "$dislikes" },
      },
    },
    {
      $addFields: {
        score: {
          $subtract: [
            {
              $add: [
                {
                  $multiply: ["$likeCount", 2],
                },
                {
                  $multiply: ["$commentCount", 5],
                },
                {
                  $multiply: ["$repostCount", 10],
                },
              ],
            },
            {
              $multiply: ["$dislikeCount", 2.5],
            },
          ],
        },
      },
    },
    { $sort: { score: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        score: 1,
        title: 1,
        user_id: 1,
      },
    },
  ]).exec()
