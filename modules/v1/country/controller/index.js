import { EncRes } from "../../../../libs/enc.js";
import { GetAllCountries } from "../model/index.js";

export default class CountryController {
  /**
   *
   * @param {import('express').Request} req - The Express request object, contains post data in req.body.
   * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
   *
   * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
   */
  static async getAll(_, res) {
    const countries = await GetAllCountries()
    const encres = EncRes("countries found", 200, { countries })
    res.status(200).send(encres)
  }
}
