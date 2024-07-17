import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number
}

const connection:ConnectionObject={
}

//void here means that it doesn't matter which type of data its returning
async function dbConnect():Promise<void>{
    //its important to check whether connection already exists or not
    if(connection.isConnected){
        console.log(`Already connected to database`);
        return
    }
    //if database is not connected
    try {
        const db=  await mongoose.connect(process.env.MONGODB_URI||"",{})
        connection.isConnected = db.connections[0].readyState
        console.log("DB connected successfully"); 
    } catch (error) {
        console.log("Database connection failed",error);
        process.exit(1) //overhere we're exiting the process
    }
}

export default dbConnect;