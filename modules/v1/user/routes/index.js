import { Router } from "express"
import UserController from "../controller/index.js"

const userRouter = Router()

userRouter.get("/", UserController.getUsers)
userRouter.get("/search", UserController.search)
userRouter.get("/profile", UserController.profile)
userRouter.put("/profile", UserController.update)
userRouter.delete("/", UserController.delete)

export default userRouter
