import fs from "fs/promises"
import path from "path"
import { env } from "../env.js"

/**
 * Middleware to log request and response info with colors in terminal,
 * and save plain logs to a daily log file.
 *
 * @param {import("express").Request} req - Express request
 * @param {import("express").Response} res - Express response
 * @param {import("express").NextFunction} next - Express next middleware function
 */
export default async function logger(req, res, next) {
  const start = Date.now()
  let message = ""

  // Compose initial message with colors for terminal
  message += `\t\x1b[36m[START]\x1b[0m \x1b[33m${req.method} ${req.originalUrl}\x1b[0m\n`
  message += `\t\x1b[35mRequest Body:\x1b[0m${JSON.stringify(req.body)}\n`
  message += `\t\x1b[35mQuery Params:\x1b[0m${JSON.stringify(req.query)}\n`
  message += `\t\x1b[35mURL Params:\x1b[0m${JSON.stringify(req.params)}\n`

  // Function to remove ANSI escape codes for saving clean logs
  const stripAnsi = str => str.replace(/\x1b\[[0-9;]*m/g, "")

  res.on("finish", async () => {
    const duration = Date.now() - start
    message += `\t\x1b[32m[END]\x1b[0m \x1b[36m${req.method} ${req.originalUrl}\x1b[0m - Total time: \x1b[35m${duration}ms\x1b[0m`

    // Console with colors
    console.log(message)

    try {
      // Prepare log filename as "logs/log-YYYY-MM-DD.txt"
      const now = new Date()
      const dateStr = now.toISOString().slice(0, 10) // YYYY-MM-DD
      const logDir = path.resolve("dev-logs")
      const logFile = path.join(logDir, `log-${dateStr}.txt`)

      // Ensure logs folder exists (create if not)
      await fs.mkdir(logDir, { recursive: true })

      // Write plain message (ANSI stripped) with newline
      const plainMessage = stripAnsi(message) + "\n"
      await fs.appendFile(logFile, plainMessage)
    } catch (err) {
      // Optional: handle file write errors gracefully here
      console.error("Failed to write log file:", err)
    }
  })

  next()
}
