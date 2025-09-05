import { Schema, Types, model } from "mongoose"

const PostSchema = new Schema(
  {
    user_id: { type: Types.ObjectId, ref: "User", required: true }, // FK to User
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Pending", "Uploaded", "Removed", "Unknown"], default: "Unknown" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

const Post = model("Post", PostSchema)

export default Post
