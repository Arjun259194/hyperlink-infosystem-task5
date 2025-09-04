import z from "zod"

/**
 * User schema definition separate from class for JSDoc inference.
 */
export const UserSchema = z.object({
  login_type: z.enum(["N", "F", "G", "A"]),
  social_id: z.string(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  country_code: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  dob: z.preprocess(
    (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
    z.date().nullable().optional()
  ),
  gender: z.enum(["male", "female", "other"]).optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  profile_image: z.string().url().nullable().optional(),
  last_login: z.preprocess(
    (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
    z.date().nullable().optional()
  ),
  login_status: z.boolean().optional(),
  status: z.string().optional(),
  ip: z.string().nullable().optional(),
  app_version: z.string().nullable().optional(),
  is_deleted: z.boolean().optional(),
  createdAt: z.preprocess(
    (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
    z.date().optional()
  ),
  updatedAt: z.preprocess(
    (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
    z.date().optional()
  ),
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
      throw new ErrorResponse(
        `Not valid User data in request: ${parsedData.error.issues[0].message}`,
        400
      )
    /** @type {UserData} */
    this.data = parsedData.data
  }
}
