import { z } from "zod"


export const UpdateUserSchema = z.object({
  login_type: z.enum(["N", "F", "G", "A"]).optional(),
  social_id: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.email().optional(),
  country_code: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  dob: z.coerce.date().nullable().optional(), // accepts string/Date
  gender: z.enum(["male", "female", "other"]).optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  profile_image: z.string().nullable().optional(),
  last_login: z.coerce.date().nullable().optional(),
  login_status: z.boolean().optional(),
  status: z.string().optional(),
  ip: z.string().nullable().optional(),
  app_version: z.string().nullable().optional(),
  is_deleted: z.boolean().optional(),
})

/**
 * @typedef {z.infer<typeof UpdateUserSchema>} UpdateData
 */

export class UserUpdate {
  #schema = UpdateUserSchema
  /**
   *
   * @param {any} data
   */
  constructor(data) {
    const parsedData = this.#schema.safeParse(data)
    if (!parsedData.success)
      throw new ErrorResponse(
        `Not valid data for updating user in request: ${parsedData.error.issues[0].message}`,
        400
      )
    /** @type {UpdateData} */
    this.data = parsedData.data
  }
}