import mongoose from "mongoose";

let isConnected;

export async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI não está configurado");
  }

  await mongoose.connect(uri);
  isConnected = true;
  console.log("MongoDB conectado");
}
