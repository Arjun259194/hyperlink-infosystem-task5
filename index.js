import express from "express"
import { env } from "./env.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from "./modules/v1/auth/routes/index.js"
import logger from "./middleware/log.js"
import connectDB from "./database/index.js"
import Encryption from "./libs/enc.js"
import { globalErrorHandler } from "./middleware/globalErrorHandler.js"

const app = express()

connectDB(env.DATABASE_URI)

app.use(globalErrorHandler)

if (process.env.NODE_ENV !== "production") app.use(logger)
app.use(cookieParser())
app.use(cors())
app.use(express.json())
app.use(express.text())
app.use(
  express.urlencoded({
    extended: true,
  })
)

const v1 = express.Router()

v1.use("/auth", authRouter)

app.use("/api/v1", v1)

app.get("/test", (req, res) => {
  const text = JSON.stringify({
    message: "Hello world",
    age: 20,
    x: 0,
    y: [1, 2, 3],
    something: {
      isMatch: true,
    },
  })
  const enc = Encryption.encrypt(text)
  console.log(`encrypted message: ${enc}`)
  const dec = Encryption.decrypt(enc)
  console.log(`decrypted message: ${dec}`)
  res.status(200).json(JSON.parse(dec))
})

app.listen(env.PORT, () => console.log(`\n\t\t- Server running on http://localhost:${env.PORT}`))
