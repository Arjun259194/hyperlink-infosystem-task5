import { Router } from "express"
import CommentController from "../controller/index.js"

const commentRouter = Router()

commentRouter.post("/", CommentController.create)
commentRouter.put("/", CommentController.update)
commentRouter.get("/by-id", CommentController.getById)
commentRouter.delete("/by-id", CommentController.delete)

export default commentRouter
