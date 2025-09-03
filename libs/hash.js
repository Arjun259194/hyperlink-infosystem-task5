import bcrypt from "bcrypt"

export default class PasswordHashing {
  static saltRounds = 10

  static async hash(data) {
    const salt = await bcrypt.genSalt(PasswordHashing.saltRounds)
    return await bcrypt.hash(data, salt)
  }

  static async compare(data, hashedData) {
    return await bcrypt.compare(data, hashedData)
  }
}
