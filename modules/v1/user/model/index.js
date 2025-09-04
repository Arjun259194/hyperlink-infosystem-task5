import User from "../../../../database/User.js";

export async function FindUserById(id) {
    return await User.findById(id).select("-password").exec()
}