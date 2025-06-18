import { Webhook } from "svix"

// API Controller Function to manage Clerk User with DB:
// http://localhost:4000/api/user/webHook

const clerkWebHooks = async (req,res) =>{
    try {
        //create svix instance with clerk web hook
        const webHook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
    } catch (error) {
        
    }
}
