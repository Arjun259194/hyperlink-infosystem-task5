import { Router } from "express";
import CountryController from "../controller/index.js";


const countryRouter = Router()

countryRouter.get("/", CountryController.getAll)


export default countryRouter