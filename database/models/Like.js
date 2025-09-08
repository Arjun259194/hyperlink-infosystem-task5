import { model, Schema, Types } from "mongoose"

const LikeSchema = new Schema({
  post_id: { type: Types.ObjectId, ref: "Post", required: true },
  user_id: { type: Types.ObjectId, ref: "User", required: true },
  state: { type: String, enum: ["Liked", "Disliked", "None"], default: "None" },
})


const Like = model("Like", LikeSchema)

export default Like
