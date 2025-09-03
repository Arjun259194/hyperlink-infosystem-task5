import User from "../../../../database/User.js"

export async function FindUserByEmail(email) {
  return await User.findOne({ email }).exec()
}

export async function NewUser(data) {
  const user = new User(data)
  await user.save()
}
