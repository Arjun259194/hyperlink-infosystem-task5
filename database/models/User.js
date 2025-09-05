import mongoose, { model } from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    login_type: { type: String, enum: ["N", "F", "G", "A"], required: true, default: "N" },
    social_id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    country_code: { type: String, default: null, required: false },
    phone: { type: String, default: null, required: false },
    dob: { type: Date, default: null, required: false },
    gender: { type: String, enum: ["male", "female", "other"], required: false },
    latitude: { type: Number, default: null, required: false },
    longitude: { type: Number, default: null, required: false },
    profile_image: { type: String, default: null, required: false },
    last_login: { type: Date, default: null, required: false },
    login_status: { type: Boolean, default: false, required: false },
    status: { type: String, default: "active", required: false },
    ip: { type: String, default: null, required: false },
    app_version: { type: String, default: null, required: false },
    is_deleted: { type: Boolean, default: false, required: false },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields automatically
  }
)

UserSchema.index({first_name: "text", last_name: "text", email: "text"})

const User = model("User", UserSchema)

export default User
