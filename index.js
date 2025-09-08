import express from "express"
import { env } from "./env.js"
import fs from "fs/promises"
import cookieParser from "cookie-parser"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import YAML from "yaml"
import authRouter from "./modules/v1/auth/routes/index.js"
import logger from "./middleware/log.js"
import connectDB from "./database/index.js"
import { globalErrorHandler } from "./middleware/globalErrorHandler.js"
import decryptRequest from "./middleware/dec.js"
import verifyToken from "./middleware/jwt.js"
import userRouter from "./modules/v1/user/routes/index.js"
import countryRouter from "./modules/v1/country/routes/index.js"
import postRouter from "./modules/v1/post/routes/index.js"
import Encryption from "./libs/enc.js"
import commentRouter from "./modules/v1/comment/router/index.js"

const app = express()

await connectDB(env.DATABASE_URI)

const IS_DEV_ENV = process.env.NODE_ENV !== "production"

app.use(cookieParser())
app.use(cors())
app.use(express.text({ type: "text/*" }))

if (IS_DEV_ENV) app.use(logger)

const v1 = express.Router()

v1.use("/auth", decryptRequest, authRouter)
v1.use("/user", decryptRequest, verifyToken, userRouter)
v1.use("/post", decryptRequest, verifyToken, postRouter)
v1.use("/comment", decryptRequest, verifyToken, commentRouter)
v1.use("/countries", countryRouter)

app.use("/api/v1", v1)

if (IS_DEV_ENV) {
  app.get("/test", decryptRequest, verifyToken, (req, res) => {
    res.status(200).json({
      body: req.body,
      userid: req.userId,
    })
  })
}

const swaggerDocumentYaml = await fs.readFile("./document/v1/swagger_doc.yaml", "utf-8")
const swaggerDocument = YAML.parse(swaggerDocumentYaml)
app.use("/api-doc/v1", swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument))

app.use(globalErrorHandler)


if(IS_DEV_ENV) {
  app.get("/dec", (req, res) => {
    const text = req.body
    const json = Encryption.decrypt(text)
    res.status(200).json(JSON.parse(json))
  })

  app.get("/enc", (req, res) => {
    const text = req.body 
    const enctext = Encryption.encrypt(text)
    res.status(200).send(enctext)
  })
}


app.listen(env.PORT, () => console.log(`\t\t- Server running on http://localhost:${env.PORT}`))
