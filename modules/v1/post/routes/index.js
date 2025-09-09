import { Router } from "express"
import PostController from "../controller/index.js"

const postRouter = Router()

postRouter.post("/", PostController.create)
postRouter.put("/", PostController.update)
postRouter.get("/", PostController.getAllPost)
postRouter.get("/:id", PostController.getPost)
postRouter.delete("/:id", PostController.delete)
postRouter.post("/:id/like", PostController.like)
postRouter.post("/:id/dislike", PostController.dislike)
postRouter.post("/repost", PostController.repost)
postRouter.delete("/repost/:id", PostController.removerepost)

export default postRouter
