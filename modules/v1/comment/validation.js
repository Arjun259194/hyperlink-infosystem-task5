import z from "zod"
import ErrorResponse from "../../../middleware/globalErrorHandler.js"

const CommentJsonSchema  = z.object({
  post_id: z.string(), 
  user_id: z.string(), 
  content: z.string().min(1)
})

/**
 * @typedef {z.infer<typeof CommentJsonSchema>} TCommentJson
 */

export class CommentJson {
  #schema = CommentJsonSchema
  constructor(data) {
    const parsedData = this.#schema.safeParse(data)
    if (!parsedData.success)
      throw new ErrorResponse(
        `Not valid data for creating comment in request: ${parsedData.error.issues[0].message}`,
        400
      )
    /** @type {TCommentJson} */
    this.data = parsedData.data
  }
}


const CommentUpdateSchema = CommentJsonSchema.pick({content: true}).extend({
    commentId: z.string()
})

/**
 * @typedef {z.infer<typeof CommentUpdateSchema>} TCommentJsonUpdate
 */

export class CommentUpdateJson {
  #schema = CommentUpdateSchema
  constructor(data) {
    const parsedData = this.#schema.safeParse(data)
    if (!parsedData.success)
      throw new ErrorResponse(
        `Not valid data for updating comment in request: ${parsedData.error.issues[0].message}`,
        400
      )
    /** @type {TCommentJsonUpdate} */
    this.data = parsedData.data
  }
}