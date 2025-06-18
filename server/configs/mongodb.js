import mongoose from "mongoose";

const connectDB = async () =>{
    mongoose.connection.on('connected',()=>{
        console.log("Connected with DB!");
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/bg_remover`);
}

export default connectDB;