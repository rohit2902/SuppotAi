import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URI!;

if(!MONGODB_URL){
    throw new Error ("MONGODB_URL is missing")
}

type MongooseCache  = {
    conn: typeof mongoose | null,
    promise: Promise<typeof mongoose> | null;
}

declare global {
 var MongooseCache :MongooseCache | undefined
}
 
let cached = global.MongooseCache;

if (!cached) {
  cached = global.MongooseCache = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URL);
     console.log("MongoDB connected");
  }

  cached!.conn = await cached!.promise;

  return cached!.conn;
}