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
import { countriesData } from "./country_mock.js"
import { userdata } from "./user_mock.js"

const MONGO_URI = env.DATABASE_URI

// Helper to generate ObjectId strings for references
const generateObjectId = () => new Types.ObjectId()

// Helper to get random number between min and max (inclusive)
const getRandomCount = (min = 2, max = 10) => Math.floor(Math.random() * (max - min + 1)) + min

// Helper to get random unique users from array
const getRandomUsers = (users, count) => {
  const shuffled = [...users].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

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

    // Generate comments - random 2-10 comments per post from random users
    let comments = []
    createdPosts.forEach(post => {
      const commentCount = getRandomCount(2, 10)
      const randomCommenters = getRandomUsers(createdUsers, commentCount)
      
      randomCommenters.forEach((commenter, j) => {
        comments.push({
          post_id: post._id,
          user_id: commenter._id,
          content: `Random comment ${j + 1} on post "${post.title}" by ${commenter.first_name}`,
          created_at: new Date(),
          updated_at: new Date(),
        })
      })
    })
    const createdComments = await Comment.insertMany(comments)
    console.log(`- ${createdComments.length} comments seeded`)

    // Generate likes - random 2-10 likes per post from random users (mix of liked/disliked)
    let likes = []
    createdPosts.forEach(post => {
      const likeCount = getRandomCount(2, 10)
      const randomLikers = getRandomUsers(createdUsers, likeCount)
      
      randomLikers.forEach((liker, k) => {
        likes.push({
          post_id: post._id,
          user_id: liker._id,
          status: Math.random() > 0.2 ? "Liked" : "Disliked", // 80% liked, 20% disliked
        })
      })
    })
    const createdLikes = await Like.insertMany(likes)
    console.log(`- ${createdLikes.length} likes seeded`)

    // Generate reposts - random 2-10 reposts per post from random users
    let reposts = []
    createdPosts.forEach(post => {
      const repostCount = getRandomCount(2, 10)
      const randomReposters = getRandomUsers(createdUsers, repostCount)
      
      randomReposters.forEach((reposter, r) => {
        reposts.push({
          post_id: post._id,
          user_id: reposter._id,
          thought: `Repost thought ${r + 1} on "${post.title}" by ${reposter.first_name}`,
        })
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

    console.log("\n🎉 All data seeded successfully!")
    console.log(`📊 Summary:
    - ${countriesData.length} countries
    - ${createdUsers.length} users  
    - ${createdPosts.length} posts
    - ${createdComments.length} comments (avg: ${Math.round(createdComments.length / createdPosts.length)} per post)
    - ${createdLikes.length} likes/dislikes (avg: ${Math.round(createdLikes.length / createdPosts.length)} per post)
    - ${createdReposts.length} reposts (avg: ${Math.round(createdReposts.length / createdPosts.length)} per post)
    - ${createdDevices.length} devices`)

    process.exit(0)
  } catch (err) {
    console.error("Error seeding data:", err)
    process.exit(1)
  }
}

seedAll()
