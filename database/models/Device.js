import { model, Schema, Types } from "mongoose"

const DeviceSchema = new Schema(
  {
    user_id: { type: Types.ObjectId, required: true, ref: "User" },
    token: { type: String, default: null },
    device_type: { type: String, required: false },
    os_version: { type: String, required: false },
    device_name: { type: String, required: false },
    model_name: { type: String, required: false },
    ip: { type: String, required: false },
    last_active: { type: Date, required: false },
    app_version: { type: String, required: false },
    platform: { type: String, required: false },
    locale: { type: String, required: false },
  },
  { timestamps: true }
)

const Device = model("Device", DeviceSchema)
export default Device
