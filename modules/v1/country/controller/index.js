import Encryption from "../../../../libs/enc.js";
import { GetAllCountries } from "../model/index.js";

export default class CountryController {

  /**
   *
   * @param {import('express').Request} req - The Express request object, contains post data in req.body.
   * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
   *
   * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
   */
    static async getAll(req, res) {
        const countries = await GetAllCountries()

        const encres = Encryption.encrypt(JSON.stringify({
            code: 200, 
            success: true, 
            data: {
                countries
            }
        }))

        res.status(200).send(encres)
    }
}