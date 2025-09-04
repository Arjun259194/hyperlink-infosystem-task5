import express from "express"
import { env } from "./env.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from "./modules/v1/auth/routes/index.js"
import logger from "./middleware/log.js"
import connectDB from "./database/index.js"
import { globalErrorHandler } from "./middleware/globalErrorHandler.js"
import decryptRequest from "./middleware/dec.js"

const app = express()

await connectDB(env.DATABASE_URI)

app.use(globalErrorHandler)

app.use(cookieParser())
app.use(cors())
app.use(express.text({ type: "text/*" }))
// app.use(express.urlencoded({ extended: true, }))

if (process.env.NODE_ENV !== "production") app.use(logger)

const v1 = express.Router()

v1.use("/auth", decryptRequest, authRouter)

app.use("/api/v1", v1)

app.get("/test", decryptRequest, (req, res) => {
  res.status(200).send(req.body)
})

app.listen(env.PORT, () => console.log(`\t\t- Server running on http://localhost:${env.PORT}`))
