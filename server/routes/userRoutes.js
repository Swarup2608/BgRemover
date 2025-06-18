import express from 'express'
import { clerkWebHooks } from '../controllers/userController.js'

const userRouter = express.Router();

userRouter.post('/webHook',clerkWebHooks);

export default userRouter;