import mongoose from "mongoose";

export function ConnectToMongo(url:string){
    return mongoose.connect(url);
}