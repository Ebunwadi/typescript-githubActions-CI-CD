import mongoose from "mongoose";
import env from "../util/validateEnv";

const connectDB = async () => {
    try {
       const conn = await mongoose.connect(env.DATABASE_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.log(err)
    }
}

export default connectDB;