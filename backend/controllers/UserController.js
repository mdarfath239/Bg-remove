import { Webhook } from 'svix'
import User from '../models/UserModel.js'
import fs from 'fs'
import axios from 'axios'
import FormData from 'form-data'
import razorpay from 'razorpay'
import transactionModel from '../models/transactionModel.js'

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

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

// API to make payment for credits
const paymentRazorpay = async (req, res) => {
    try {

        const { clerkId, planId } = req.body
        const userData = await User.findOne({ clerkId })

        if (!userData || !planId) {
            return res.json({ success: false, message: 'Invalid Credentials' })
        }

        let credits, plan, amount, date

        switch (planId) {
            case 'Basic':
                plan = 'Basic'
                credits = 100
                amount = 10
                break;
            case 'Advanced':
                plan = 'Advanced'
                credits = 500
                amount = 50
                break;
            case 'Business':
                plan = 'Business'
                credits = 5000
                amount = 250
                break;
            default:
                break;
        }

        date = Date.now()

        // Creating Transaction Data
        const transactionData = await transactionModel.create({
            clerkId,
            plan,
            amount,
            credits,
            date
        })

        // Creating Options for Razorpay Order
        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY,
            receipt: transactionData._id.toString()
        }

        // Creating Razorpay Order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// API Controller function to verify razorpay payment
const verifyRazorpay = async (req, res) => {
    try {

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            const transactionData = await transactionModel.findById(orderInfo.receipt)

            if (!transactionData) {
                return res.json({ success: false, message: 'Transaction not found' })
            }

            if (transactionData.payment) {
                return res.json({ success: false, message: 'Payment Failed' })
            }

            // Adding Credits in user data
            const userData = await User.findOne({ clerkId: transactionData.clerkId })
            const creditBalance = userData.creditBalance + transactionData.credits
            await User.findByIdAndUpdate(userData._id, { creditBalance })

            // Making payment true in transaction data
            await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true })

            res.json({ success: true, message: "Credits Added" })
        } else {
            res.json({ success: false, message: 'Payment Failed' })
        }

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export { clerkWebhooks, credits, removeImageBg, paymentRazorpay, verifyRazorpay }