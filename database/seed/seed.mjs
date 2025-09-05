// seed.js
import { connect } from "mongoose"
import Country from "../models/Country.js"
import { env } from "../../env.js"
import { countriesData } from "./country_mock.js"
import User from "../User.js"
import { userdata } from "./user_mock.js"

// Connection URI example (change for your MongoDB)
const MONGO_URI = env.DATABASE_URI

async function seedCountries() {
  try {
    await connect(MONGO_URI)
    console.log("Connected to MongoDB")

    // Optional: clear current collections
    await Country.deleteMany({})
    console.log("- Old countries data cleared")

    // Bulk insert
    await Country.insertMany(countriesData)
    console.log("- Countries data seeded successfully")

    await User.insertMany(userdata)
    console.log("- Users data seeded siccessfully")


    process.exit(0)
  } catch (err) {
    console.error("Error seeding country data:", err)
    process.exit(1)
  }
}

seedCountries()
