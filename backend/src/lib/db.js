import moongoose from "mongoose";

export const connectDB = async()=>{
    try {
        const connectDB = await moongoose.connect(process.env.MONGO_URL)
        console.log("Mongo DB connected to ",connectDB.connection.host);
    } catch (error) {
        console.log("Error while connecting to moongo DB ",error);
        exit(1);        
    }
}