import z from "zod"
import Encryption from "../libs/enc.js"
import ErrorResponse from "./globalErrorHandler.js"

/**
 *
 * @param {import('express').Request} req - The Express request object, contains post data in req.body.
 * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
 * @param {import("express").NextFunction} next - The next function for next middleware
 *
 * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
 */
export default async function decryptRequest(req, _, next) {
  const isValidBody = await z.string().min(1).safeParseAsync(req.body)
  if (!isValidBody.success) {
    throw new ErrorResponse("Not valid request body", 400)
  }

  let body

  try {
    const rawBody = isValidBody.data
    const jsonstr = Encryption.decrypt(rawBody.trim())
    body = JSON.parse(jsonstr)
  } catch (err) {
    console.log(`Error while decrypting request body: ${err}`)
    throw new ErrorResponse("Failed to decrypt request body", 400)
  }

  req.body = body

  next()
}
