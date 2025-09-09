import { success } from "zod"

/**
 * Global error handling middleware for Express.
 * Catches errors thrown or passed via next(err) from any route.
 *
 * @param {Error} err - The error object
 * @param {import("express").Request} req - Express request
 * @param {import("express").Response} res - Express response
 * @param {import("express").NextFunction} next - Express next middleware function
 */
export function globalErrorHandler(err, _res, res, _next) {
  console.error("Global error handler caught:", err)

  const code = err.code || 500
  const msg = err.message || "Internal Server Error"
  const obj = err.obj

  res.status(code).json({
    code,
    message: msg,
    success: false,
    ...(!!obj ? obj : {}),
  })
}

export default class ErrorResponse extends Error {
  /**
   *
   * @param {string} message
   * @param {number} code
   */
  constructor(message, code, obj = null) {
    super(message)
    this.name = "Express API Error"
    this.code = code
    this.obj = obj
  }
}
