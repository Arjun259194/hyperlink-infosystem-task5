import jwt from "jsonwebtoken"
import { env } from "../env"

export class JwtToken {
  static async new(payload) {
    return jwt.sign(payload, env.JWT_SECRET)
  }

  static async payloadFromToken(token) {
    const isValid = jwt.verify(token, env.JWT_SECRET)
    if (!isValid) return null
    const payload = jwt.decode(token)
    return payload
  }
}
