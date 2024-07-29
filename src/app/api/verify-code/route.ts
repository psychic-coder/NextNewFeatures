import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";

//this is the route for verifying the user 
export async function POST(request: Request) {
  await dbConnect();

  try {
    const {username,code}= await request.json();
    
    //when we get data from uri we should pass through the below method 
        const decodeUsername= decodeURIComponent(username);
        const user=  await UserModel.findOne({username:decodeUsername});
    if(!user){
        return NextResponse.json({
            success:false,
            message:"User not found"
        },{status:500})
    }
    
    const isCodeValid=user.verifyCode===code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry)>new Date();

    if(isCodeValid && isCodeNotExpired){
        user.isVerified =true
        await user.save();

        return NextResponse.json({
            success:true,
            message:"Accout verified successfully"
        },{status:200})
    }

    else if(!isCodeNotExpired){
        return NextResponse.json({
            success:false,
            message:"Verification code has expired , please signup again to get a new code"
        },{status:400})
    }else{
        return NextResponse.json({
            success:false,
            message:"Incorrect verification codde"
        },{status:400})
    }

  } catch (error) {
    console.log("Error verifying user", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {status: 500})
  }
}
