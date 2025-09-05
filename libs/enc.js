import cryptLib from "cryptlib"
import { env } from "../env.js"

export default class Encryption {
  static shaKey

  /**
   * @param {string} data
   * @param {number} BITS
   * @returns  {string}
   */
  static encrypt(data, BITS = 32) {
    if (!Encryption.shaKey) {
      Encryption.shaKey = cryptLib.getHashSha256(env.KEY, BITS)
    }
    return cryptLib.encrypt(data, Encryption.shaKey, env.IV)
  }

  /**
   * @param {string} encryption
   * @param {number} BITS
   * @returns {string}
   */
  static decrypt(encryption, BITS = 32) {
    if (!Encryption.shaKey) {
      Encryption.shaKey = cryptLib.getHashSha256(env.KEY, BITS)
    }

    return cryptLib.decrypt(encryption, Encryption.shaKey, env.IV)
  }
}
