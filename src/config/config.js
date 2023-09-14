import mongoose from 'mongoose';
import 'dotenv/config'

export function startDatabase() {
    mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Database Connected"))
    .catch((error) => console.log("Error en conexion a MongoDB Atlas: ", error));
}
