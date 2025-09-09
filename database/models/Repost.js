import { Schema, model, Types } from "mongoose"

const RepostSchema = new Schema({
  user_id: { type: Types.ObjectId, ref: "User", required: true },
  post_id: { type: Types.ObjectId, ref: "Post", required: true },
  thought: { type: String, default: null },
})

const Repost = model("Repost", RepostSchema)

export default Repost
