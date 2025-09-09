import z from "zod"
import ErrorResponse from "../../../middleware/globalErrorHandler.js"

/**
 * User schema definition separate from class for JSDoc inference.
 */
export const UserSchema = z.object({
  login_type: z.enum(["N", "F", "G", "A"]),
  social_id: z.string(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  country_code: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  dob: z.preprocess(
    arg => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
    z.date().nullable().optional()
  ),
  gender: z.enum(["male", "female", "other"]).optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  profile_image: z.string().url().nullable().optional(),
  last_login: z.preprocess(
    arg => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
    z.date().nullable().optional()
  ),
  login_status: z.boolean().optional(),
  status: z.string().optional(),
  ip: z.string().nullable().optional(),
  app_version: z.string().nullable().optional(),
  is_deleted: z.boolean().optional(),
})

/**
 * @typedef {z.infer<typeof UserSchema>} UserData
 */

export class UserJson {
  #schema = UserSchema
  /**
   * @param {any} data
   */
  constructor(data) {
    const parsedData = this.#schema.safeParse(data)
    if (!parsedData.success)
      throw new ErrorResponse(`Not valid User data in request`, 400, {
        error: parsedData.error.issues[0],
      })
    /** @type {UserData} */
    this.data = parsedData.data
  }
}

export class LoginJson {
  #schema = UserSchema.pick({
    password: true,
    email: true,
  })

  constructor(data) {
    const parsedData = this.#schema.safeParse(data)
    if (!parsedData.success)
      throw new ErrorResponse(`Not valid login data in request`, 400, {
        error: parsedData.error.issues[0],
      })

    /** @type {{email: string, password: string}} */
    this.data = parsedData.data
  }
}

export const DeviceSchema = z.object({
  user_id: z.string().min(1, "User ID is required"),
  token: z.string().nullable().optional(),
  device_type: z.string().nullable().optional(),
  device_token: z.string().nullable().optional(),
  uuid: z.string().nullable().optional(),
  os_version: z.string().nullable().optional(),
  device_name: z.string().nullable().optional(),
  model_name: z.string().nullable().optional(),
  ip: z.string().nullable().optional(),
  app_version: z.string().nullable().optional(),
  platform: z.string().nullable().optional(),
  locale: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
})

/**
 * @typedef {z.infer<typeof DeviceSchema>} DeviceData
 */

export class DeviceJson {
  #schema = DeviceSchema

  /**
   * @param {any} data Frontend device data (from req.body)
   * @param {object} req Express request object (used to get IP, etc)
   */
  constructor(data) {
    const parsedData = this.#schema.safeParse(data)
    if (!parsedData.success)
      throw new ErrorResponse(`Not valid Device data in request`, 400, {
        error: parsedData.error.issues[0],
      })

    /** @type {DeviceData} */
    this.data = parsedData.data
  }
}
