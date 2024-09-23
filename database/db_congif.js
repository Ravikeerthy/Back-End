import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbConnect = async(req, res) =>{
try {
    const connection = await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
    console.log("DB Connected");
    return connection
    
} catch (error) {
    res.status(500).json({message:"DataBase is not connected"});
}
}

export default dbConnect;
