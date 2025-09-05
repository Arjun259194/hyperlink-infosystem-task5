import z from "zod"
import ErrorResponse from "../../../middleware/globalErrorHandler.js"

const PostSchema = z.object({
  user_id: z.string(),
  title: z.string(),
  content: z.string(),
  status: z.enum(["Pending", "Uploaded", "Removed", "Unknown"]).default("Unknown").catch("Unknown"),
})

/**
 * @typedef {z.infer<typeof PostSchema>} Postjson
 */

export class PostJson {
  #schema = PostSchema
  constructor(data) {
    const parsedData = this.#schema.safeParse(data)
    if (!parsedData.success)
      throw new ErrorResponse(
        `Not valid data for creating post in request: ${parsedData.error.issues[0].message}`,
        400
      )
    /** @type {Postjson} */
    this.data = parsedData.data
  }
}

const PostUpdateSchema = PostSchema.partial().extend({
    post_id: z.string()
})

/**
 * @typedef {z.infer<typeof PostUpdateSchema>} Postupdate
 */

export class PostUpdateJson {
  #schema = PostUpdateSchema
  constructor(data) {
    const parsedData = this.#schema.safeParse(data)
    if (!parsedData.success)
      throw new ErrorResponse(
        `Not valid data for creating post in request: ${parsedData.error.issues[0].message}`,
        400
      )
    /** @type {Postupdate} */
    this.data = parsedData.data
  }
}
