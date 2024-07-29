import mongoose, { Schema, Document } from "mongoose";

//the schemas written here using mongoose are for the mongodb 

export interface Message extends Document {
  content: string; //in ts we write string in lowercase
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String, //in mongoose we write ts in uppercase
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified:boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, " Username is required "], //we are giving an error if the username is not present
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, " Email is required "],
    unique: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      " Please use a valid email address",
    ],
    //in the above we're checking whether the email address provided is valid or not using regex
  },
  password:{
    type: String,
    required: [true, " Password is required "],
  },
  verifyCode:{
    type: String,
    required: [true, " Verify code is required "],
  },
  verifyCodeExpiry:{
    type: Date,
    required: [true, " Verify code expiry is required "],
  },
  isVerified:{
    type: Boolean,
    default:false,
  },
  isAcceptingMessage:{
    type: Boolean,
    default:true,
  },
  messages:[MessageSchema]
});

//in the below code the first condition is used to tell that the data already exists
//and after "as" we wrote the data type of the mongoose.model to be User
//and in the second case the User model doesn't exists and we're creating it
const UserModel=(mongoose.models.User as mongoose.Model<User>)||mongoose.model<User>("User",UserSchema)

 export default UserModel;