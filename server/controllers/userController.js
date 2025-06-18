import { Webhook } from "svix"
import userModel from "../models/userModel.js"
import razorpay from 'razorpay'
import transactionModel from "../models/transactionModels.js"

// API Controller Function to manage Clerk User with DB:
// http://localhost:4000/api/user/webHook

const clerkWebHooks = async (req,res) =>{
    try {
        //create svix instance with clerk web hook
        const webHook = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY)
        await webHook.verify(JSON.stringify(req.body),{
            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"]
        })
        const {data,type} = req.body
        switch(type){
            case "user.created":{
                const userData = {
                    clerkId :  data.id,
                    email : data.email_addresses[0].email_address,
                    firstName : data.first_name,
                    lastName : data.last_name,
                    photo : data.image_url
                }

                await userModel.create(userData);
                res.json({})
                break;
            }

            case "user.updated":{
                const userData = {
                    email : data.email_addresses[0].email_address,
                    firstName : data.first_name,
                    lastName : data.last_name,
                    photo : data.image_url
                }

                await userModel.findOneAndUpdate({clerkId: data.id},userData);
                res.json({})

                break;
            }

            case "user.deleted":{
                await userModel.findOneAndDelete({clerkId:data.id});
                res.json({})
                break;
            }

            default:
                break;

        }


    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}



// API Controller Action to get user available credit data
const userCredits = async (req,res)=>{
    try {
        const {clerkId} = req.body
        const userData = await userModel.findOne({clerkId});
        res.json({success:true,credits:userData.creditBalance})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

// Gateway initalize
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});

// API TO make payemnt for credits
const paymentRazorPay = async (req,res) => {
    try {
        const {clerkId, planId} = req.body
        const userData = await userModel.findOne({clerkId})

        if(!userData){
            return res.json({success:false,message:"Invalid Credentials!"})
        }
        if(!planId){
            return res.json({success:false,message:"Invalid Plan!"})
        }
        let credits, plan, amount, date 
        switch(planId){
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
                return res.json({success:false,message:"Invalid Plan!"})
        }

        date = Date.now()

        // Creating transaction
        const transactionData = {
            clerkId,
            plan,
            amount,
            credits,
            date
        }

        const newTransaction = new transactionModel(transactionData)
        await newTransaction.save()

        const options = {
            amount:  amount * 100,
            currency: process.env.CURRENCY,
            receipt: newTransaction._id
        }

        await razorpayInstance.orders.create(options,(error,order)=>{
            if(error){
                console.log(error)
                return res.json({success:false,message:error})
            }
            res.json({success:true,order})
        })


    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Payment Failed"})
    }
}
 
// API CONTROLLER TO VERIFY RAZORPAY PAYMENT
const verifyRazorPay = async (req,res) =>{
    try {
        const {razorpay_order_id} = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        console.log(orderInfo)
        if(orderInfo.status === 'attempted'){
            const transactionData = await transactionModel.findById(orderInfo.receipt);
            if(transactionData.payment){
                return res.json({success:false,message:"Payment Failed!"})
            }
            // Adding credits to user
            const userData = await userModel.findOne({clerkId: transactionData.clerkId})
            const creditBalance = userData.creditBalance+transactionData.credits
            await userModel.findByIdAndUpdate(userData._id,{creditBalance})

            // MAKING PAYMENT TRUE
            await transactionModel.findByIdAndUpdate(transactionData._id,{payment:true})
            res.json({success:true,message:"Credits Updated!"})
        }
        else{
            res.json({success:false,message:"Payment Failed : "+orderInfo.status+"!"})
        }
    } catch (error) {
        
        console.log(error)
        res.json({success:false,message:"Payment Failed"})
    }
}

export {clerkWebHooks,userCredits, paymentRazorPay, verifyRazorPay}