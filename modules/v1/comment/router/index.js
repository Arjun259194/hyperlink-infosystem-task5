import { Router } from "express";
import CommentController from "../controller/index.js";

const commentRouter = Router() 

commentRouter.post("/", CommentController.create)
commentRouter.put("/", CommentController.update)

export default commentRouter