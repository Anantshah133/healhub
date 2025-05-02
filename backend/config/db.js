import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log("Database connected successfully.....");
    })
    
    await mongoose.connect(`${process.env.MONGO_URI}/moshpital`);
}

export default connectDB;
// anant133