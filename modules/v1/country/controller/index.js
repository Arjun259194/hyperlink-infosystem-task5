import { EncRes } from "../../../../libs/enc.js"
import { GetAllCountries } from "../model/index.js"

/** @typedef {(req: import("express").Request, res: import("express").Response) => Promise<void>} ExpressFn */

export default class CountryController {
  /** @type {ExpressFn} */
  static async getAll(_, res) {
    const countries = await GetAllCountries()
    const encres = EncRes("countries found", 200, { countries })
    res.status(200).send(encres)
  }
}
