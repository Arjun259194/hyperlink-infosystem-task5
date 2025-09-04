import Country from "../../../../database/Country.js";

export async function GetAllCountries() {
    return await Country.find().exec()
}