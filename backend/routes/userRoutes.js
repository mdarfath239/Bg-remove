import express from 'express'
import { clerkWebhooks, credits, removeImageBg } from '../controllers/UserController.js'
import upload from '../middleware/multer.js'
import authUser from '../middleware/auth.js'

const userRouter = express.Router()

userRouter.post('/webhooks', clerkWebhooks)
userRouter.get('/credits', authUser, credits)
userRouter.post('/remove-bg', upload.single('image'), authUser, removeImageBg)

export default userRouter
