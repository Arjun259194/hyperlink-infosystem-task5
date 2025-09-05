import Country from "../../../../database/models/Country.js";

export async function GetAllCountries() {
    return await Country.find().exec()
}