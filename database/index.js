import mongoose from "mongoose";

export default async function connectDB(uri) {
  try {
    await mongoose.connect(uri)
    console.log(`\n\t\t- Database connected successfully!`)
  } catch (error) {
    console.log(`Error while connecting to database: ${error}`)
    process.exit(1)
  }
}
