import mongoose from "mongoose";
import dns from "node:dns";

// Configure DNS before MongoDB connection
dns.setServers(["8.8.8.8", "1.1.1.1"]);

console.log("Custom DNS servers:", dns.getServers());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;