import User from "../../../../database/models/User.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { UserUpdate } from "../validation.js"
import { PaginationQuery } from "../../validation.js"

/** * @param {string} id */
export const FindUserById = async id => await User.findById(id, {is_deleted: false}).select("-password -is_deleted").exec()

/**
 *
 * @param {string} id
 * @param {UserUpdate} data
 */
export async function FindUserByIdAndUpdate(id, updatedata) {
  const user = await FindUserById(id)
  if (!user) throw new ErrorResponse("User not found", 404)

  user.set(updatedata.data)

  await user.save().catch(err => {
    console.error(`Error while saving user update to database: ${err}`)
    throw new ErrorResponse("internal server error while saving to database", 500)
  })

  return user.toObject()
}

/**
 *
 * @param {PaginationQuery} pagination
 */
export const GetUsersPagination = async ({ data: { limit, page } }) =>
  await User.find({is_deleted: false})
    .select("-password -is_deleted")
    .skip((page - 1) * limit)
    .limit(limit)
    .exec()
    .catch(err => {
      console.log(`Error while fetching users from db: ${err}`)
      throw new ErrorResponse("internal server error while fetching users", 500)
    })

/** @param {string} str */
export const SearchUser = async str =>
  await User.find({ $text: { $search: str }, is_deleted: false })
    .select("-password -is_deleted")
    .limit(50)
    .exec()
    .catch(err => {
      console.log(`Error while fetching users from db: ${err}`)
      throw new ErrorResponse("internal server error while fetching users", 500)
    })

/** @param {string} id */
export const FindAndDeleteUserById = async id =>
  await User.findByIdAndUpdate(id, {
    is_deleted: true,
  })
    .exec()
    .catch(err => {
      console.log(`Error while deleting user from db: ${err}`)
      throw new ErrorResponse("internal server error while fetching users", 500)
    })
