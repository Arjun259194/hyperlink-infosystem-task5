// seed.js
import { connect, Types } from "mongoose"
import Country from "../models/Country.js"
import User from "../models/User.js"
import Post from "../models/Post.js"
import Comment from "../models/Comment.js"
import Like from "../models/Like.js"
import Repost from "../models/Repost.js"
import Device from "../models/Device.js"
import { env } from "../../env.js"
import { countriesData } from "./country_mock.js" // Your full 247 countries data here
import { userdata } from "./user_mock.js" // If available, or will generate

const MONGO_URI = env.DATABASE_URI

// Helper to generate ObjectId strings for references
const generateObjectId = () => new Types.ObjectId()

// Generate more users if userdata not provided or to expand
const generateUsers = (count = 20) => {
  return Array.from({ length: count }).map((_, i) => ({
    login_type: "N",
    social_id: `user${i + 1}`,
    first_name: `User${i + 1}`,
    last_name: `Test${i + 1}`,
    email: `user${i + 1}@example.com`,
    password: "hashedpassword",
    country_code: countriesData[i % countriesData.length].sortname || null,
    phone: `+1000000000${i + 1}`,
    dob: new Date(1990, i % 12, (i % 28) + 1),
    gender: ["male", "female", "other"][i % 3],
    latitude: 10 + i,
    longitude: 20 + i,
    profile_image: null,
    last_login: null,
    login_status: false,
    status: "active",
    ip: null,
    app_version: "1.0.0",
    is_deleted: false,
  }))
}

async function seedAll() {
  try {
    await connect(MONGO_URI)
    console.log("Connected to MongoDB")

    // Clear all collections
    await Promise.all([
      Country.deleteMany({}),
      User.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({}),
      Like.deleteMany({}),
      Repost.deleteMany({}),
      Device.deleteMany({}),
    ])
    console.log("- Old data cleared")

    // Insert countries
    await Country.insertMany(countriesData)
    console.log(`- ${countriesData.length} countries seeded`)

    // Insert users (either from imported userdata or generated)
    let usersToInsert = userdata && userdata.length >= 20 ? userdata : generateUsers(20)
    const createdUsers = await User.insertMany(usersToInsert)
    console.log(`- ${createdUsers.length} users seeded`)

    // Generate posts per user for pagination - e.g., 5 posts per user
    let posts = []
    createdUsers.forEach(user => {
      for (let i = 0; i < 5; i++) {
        posts.push({
          user_id: user._id,
          title: `Post ${i + 1} by ${user.first_name}`,
          content: `Content of post ${i + 1} by user ${user.first_name}`,
          status: "Uploaded",
        })
      }
    })
    const createdPosts = await Post.insertMany(posts)
    console.log(`- ${createdPosts.length} posts seeded`)

    // Generate comments - 3 comments per post
    let comments = []
    createdPosts.forEach(post => {
      for (let j = 0; j < 3; j++) {
        const commenter =
          createdUsers[(post._id.toString().charCodeAt(0) + j) % createdUsers.length]
        comments.push({
          post_id: post._id,
          user_id: commenter._id,
          content: `Comment ${j + 1} on post ${post.title}`,
          created_at: new Date(),
          updated_at: new Date(),
        })
      }
    })
    const createdComments = await Comment.insertMany(comments)
    console.log(`- ${createdComments.length} comments seeded`)

    // Generate likes - 2 likes per post, mixed states
    let likes = []
    createdPosts.forEach((post, idx) => {
      for (let k = 0; k < 2; k++) {
        const liker = createdUsers[(idx + k) % createdUsers.length]
        likes.push({
          post_id: post._id,
          user_id: liker._id,
          state: k % 2 === 0 ? "Liked" : "Disliked",
        })
      }
    })
    const createdLikes = await Like.insertMany(likes)
    console.log(`- ${createdLikes.length} likes seeded`)

    // Generate reposts - 1 repost per post
    let reposts = []
    createdPosts.forEach((post, idx) => {
      const reposter = createdUsers[idx % createdUsers.length]
      reposts.push({
        post_id: post._id,
        user_id: reposter._id,
        thought: `Thoughts on reposting post ${post.title}`,
      })
    })
    const createdReposts = await Repost.insertMany(reposts)
    console.log(`- ${createdReposts.length} reposts seeded`)

    // Generate devices - 1 device per user
    let devices = []
    createdUsers.forEach((user, idx) => {
      devices.push({
        user_id: user._id,
        token: `device_token_${idx + 1}`,
        device_type: "smartphone",
        os_version: "14.0",
        device_name: `Device${idx + 1}`,
        model_name: `Model${idx + 1}`,
        ip: `192.168.1.${idx + 1}`,
        last_active: new Date(),
        app_version: "1.0.0",
        platform: "iOS",
        locale: "en_US",
      })
    })
    const createdDevices = await Device.insertMany(devices)
    console.log(`- ${createdDevices.length} devices seeded`)

    process.exit(0)
  } catch (err) {
    console.error("Error seeding data:", err)
    process.exit(1)
  }
}

seedAll()
