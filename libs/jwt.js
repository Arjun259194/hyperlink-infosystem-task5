import jwt from "jsonwebtoken"
import { env } from "../env.js"

export class JwtToken {
  /**
   *
   * @param {{id: string}} payload
   * @returns {string}
   */
  static async new(payload) {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: "1d",
    })
  }

  /**
   *
   * @param {string} token
   * @returns {Promise<{id: string} | null>}
   */
  static async payloadFromToken(token) {
    const isValid = jwt.verify(token, env.JWT_SECRET)
    if (!isValid) return null
    const payload = jwt.decode(token)
    return payload
  }
}
