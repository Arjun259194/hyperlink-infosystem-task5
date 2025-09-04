import { Router } from "express";
import UserController from "../controller/index.js";


const userRouter = Router()

userRouter.get("/profile", UserController.profile)

export default userRouter