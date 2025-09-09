import { Router } from "express"
import AuthController from "../controller/index.js"
import verifyToken from "../../../../middleware/jwt.js"

const authRouter = Router()

authRouter.post("/signup", AuthController.signup)
authRouter.post("/login", AuthController.login)
authRouter.post("/logout", verifyToken, AuthController.logout)

export default authRouter
