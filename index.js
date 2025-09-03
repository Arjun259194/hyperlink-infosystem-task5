import express from "express"
import { env } from "./env"

const app = express()

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({
  extended: true
}))

const v1 = express.Router()

app.use("/api/v1", v1)

app.listen(env.PORT, () => console.log(`Server running on http://localhost:${PORT}`))
