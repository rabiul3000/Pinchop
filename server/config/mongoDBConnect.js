import { connect } from "mongoose"



const mongodbConnect = async () => {

    try {
        const uri = process.env.MONGODB_URI
        if (!uri) throw new Error("mongodb env variable missing");
        await connect(uri)
        console.log("MongoDB connected successfully");



    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1)
    }

}

export default mongodbConnect;