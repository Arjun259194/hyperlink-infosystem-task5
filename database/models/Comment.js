import { model, Schema, Types } from "mongoose"

const CommentSchema = new Schema(
  {
    post_id: { type: Types.ObjectId, ref: "Post", required: true },
    user_id: { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, default: "" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

const Comment = model("Comment", CommentSchema)

export default Comment
