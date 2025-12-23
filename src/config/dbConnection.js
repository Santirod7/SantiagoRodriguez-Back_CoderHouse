const mongoose = require('mongoose');
const dotenv = require('dotenv');
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

module.exports = connectDB;