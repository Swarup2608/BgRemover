import express from 'express'
import { clerkWebHooks, paymentRazorPay, userCredits, verifyRazorPay } from '../controllers/userController.js'
import authUser from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.post('/webHook',clerkWebHooks);
userRouter.get('/credits',authUser,userCredits)
userRouter.post('/payment',authUser,paymentRazorPay)
userRouter.post('/verifypayment',verifyRazorPay)

export default userRouter;