import z from "zod"

export const PaginationQueryValidator = z.object({
  page: z.coerce.number().int().min(1).default(1).catch(1),
  limit: z.coerce.number().int().min(1).default(5).catch(5),
})

/**
 * @typedef {z.infer<typeof PaginationQueryValidator>} Pagination
 */

export class PaginationQuery {
  #schema = PaginationQueryValidator
  constructor(data = {}) {
    /** @type {Pagination} */
    this.data = this.#schema.parse(data)
  }
}
