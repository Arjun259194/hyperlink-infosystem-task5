import { Router } from "express"
import AuthController from "../controller/index.js"

const authRouter = Router()

authRouter.post("/signin", AuthController.signin)
authRouter.post("/login", AuthController.login)
authRouter.post("/logout", AuthController.logout)

export default authRouter
