import Device from "../../../../database/models/Device.js"
import User from "../../../../database/models/User.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { DeviceJson } from "../validation.js"

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

  await user.validate().catch(err => {
    console.log("Error while validating user: " + err)
    throw new ErrorResponse("not valid data for database schema: " + err.message, 422)
  })

  await user.save().catch(err => {
    console.log(`Error while saving user in db: ${err.message}`)
    throw new ErrorResponse("Failed to save user in database", 500)
  })
  return user
}

/**
 * @param {DeviceJson} devicejson
 */

export async function NewDeviceInfo({ data }) {
  const device = new Device(data)
  await device.save().catch(err => {
    console.log(`Error while saving device info in db: ${err.message}`)
    throw new ErrorResponse("Failed to save device into in database", 500)
  })
  return device.toObject()
}

export async function DeleteDeviceByUserId(id) {
  return await Device.findOneAndDelete({ _id: id })
    .exec()
    .catch(err => {
      console.log(`Error while deleting device info from db: ${err.message}`)
      throw new ErrorResponse("Failed to deleting device from database", 500)
    })
}
