import User from "../../../../database/models/User.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"

/**
 *
 * @param {string} email
 */
export async function FindUserByEmail(email) {
  return await User.findOne({ email }).exec()
}

/**
 *
 * @param {import("../validation.js").UserJson} userjson
 * @returns {Promise<User>}
 */
export async function NewUser(userjson) {
  const user = new User(userjson.data)

  await user.validate().catch((err) => {
    console.log("Error while validating user: " + err)
    throw new ErrorResponse("not valid data for database schema: " + err.message, 422)
  })

  await user.save().catch(err => {
    console.log(`Error while saving user in db: ${err.message}`)
    throw new ErrorResponse("Failed to save user in database", 500)
  })
  return user
}
