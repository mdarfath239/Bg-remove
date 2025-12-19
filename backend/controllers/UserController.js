import { Webhook } from 'svix'
import User from '../models/UserModel.js'
import fs from 'fs'
import axios from 'axios'
import FormData from 'form-data'

// API Controller Function to Manage Clerk User with database
// http://localhost:4000/api/user/webhooks
const clerkWebhooks = async (req, res) => {

    try {

        // Create a Svix instance with your secret.
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        // Verify the payload with the headers
        await whook.verify(req.rawBody, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })

        const { data, type } = req.body

        switch (type) {
            case 'user.created': {

                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                }

                await User.create(userData)
                res.json({})

                break;
            }
            case 'user.updated': {

                const userData = {
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                }

                await User.findOneAndUpdate({ clerkId: data.id }, userData)
                res.json({})

                break;
            }
            case 'user.deleted': {

                await User.findOneAndDelete({ clerkId: data.id })
                res.json({})

                break;
            }
            default:
                break;
        }

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }

}


// API Controller function to get user available credits data
const credits = async (req, res) => {
    try {
        const { clerkId } = req.body

        let userData = await User.findOne({ clerkId })

        if (!userData) {
            userData = await User.create({
                clerkId,
                email: clerkId + '@example.com',
                firstName: "Guest",
                lastName: "User",
                photo: "",
                creditBalance: 5
            })
        }

        res.json({ success: true, credits: userData.creditBalance })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// API Controller function to remove background from image
const removeImageBg = async (req, res) => {
    try {
        const { clerkId } = req.body
        console.log("RemoveBg Controller - Clerk ID:", clerkId)

        let user = await User.findOne({ clerkId })

        if (!user) {
            user = await User.create({
                clerkId,
                email: clerkId + '@example.com',
                firstName: "Guest",
                lastName: "User",
                photo: "",
                creditBalance: 5
            })
        }

        if (user.creditBalance === 0) {
            return res.json({ success: false, message: 'No Credit Balance', creditBalance: user.creditBalance })
        }

        const imagePath = req.file.path;

        // Reading the image file
        const imageFile = fs.createReadStream(imagePath)

        const formData = new FormData()
        formData.append('image_file', imageFile)

        const { data } = await axios.post('https://clipdrop-api.co/remove-background/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
            },
            responseType: 'arraybuffer'
        })

        const base64Image = Buffer.from(data, 'binary').toString('base64')

        const resultImage = `data:${req.file.mimetype};base64,${base64Image}`

        await User.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 })

        res.json({ success: true, resultImage, creditBalance: user.creditBalance - 1, message: 'Background Removed' })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export { clerkWebhooks, credits, removeImageBg }