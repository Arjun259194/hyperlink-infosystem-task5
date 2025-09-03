import cryptLib from "cryptlib"
import { env } from "../env.js"

export default class Encryption {
  static shaKey

  static encrypt(data, BITS = 32) {
    if (!Encryption.shaKey) {
      Encryption.shaKey = cryptLib.getHashSha256(env.KEY, BITS)
    }
    return cryptLib.encrypt(data, Encryption.shaKey, env.IV)
  }

  static decrypt(encryption, BITS = 32) {
    if (!Encryption.shaKey) {
      Encryption.shaKey = cryptLib.getHashSha256(env.KEY, BITS)
    }

    return cryptLib.decrypt(encryption, Encryption.shaKey, env.IV)
  }
}
