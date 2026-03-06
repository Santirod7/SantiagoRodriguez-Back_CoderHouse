import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGO_URL = process.env.MONGODB;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Base de datos MongoDB conectada');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1); 
    }
};

export default connectDB;