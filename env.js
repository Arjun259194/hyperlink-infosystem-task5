import z from "zod"
import { config } from "dotenv"

config()

const envschema = z.object({
  PORT: z.coerce.number().int(),
  DATABASE_URI: z.string()
})


export const env = envschema.parse(process.env)
