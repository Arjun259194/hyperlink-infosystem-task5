import z from "zod"
import { config } from "dotenv"

config()

const envschema = z.object({
  PORT: z.coerce.number().int(),
  DATABASE_URI: z.string(), 
  KEY: z.string().min(32),
  IV: z.string().min(12),
  JWT_SECRET: z.string(), 
  SALT: z.coerce.number().int()
})

export const env = envschema.parse(process.env)