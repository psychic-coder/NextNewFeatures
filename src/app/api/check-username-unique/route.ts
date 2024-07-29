import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
  username: usernameValidation, //the username validation will check the username we received
});

export async function GET(request: Request) {

  await dbConnect();

  try {
        //in the below line we get the url and from the url we'll receive the query parameter 
        // the url will be of the form "localhost:3000/api/check-currect-user?username=rohit"
        const {searchParams}= new URL(request.url);
        const queryParam={
            username:searchParams.get('username')
        }
        //validate with zod
      const result=  UsernameQuerySchema.safeParse(queryParam);
      console.log(result);//TODO:REMOVE
      if(!result.success){
        //in the below line we're getting hold of the errors related to username only
        const usernameErrors=result.error.format().username?._errors||[];
        return NextResponse.json({
            success:false,
            message:usernameErrors?.length>0?usernameErrors.join(','):"Invalid query parameters",
        },{status:400})
      }

      //in this we receive alot of the data
      const {username}=result.data;

    const existingVerifiedUser = await UserModel.findOne({username,isVerified:true})
      
    if(existingVerifiedUser){
        return NextResponse.json({
            success:false,
            message:"Username is already taken ",
        },{status:400})
    }

    return NextResponse.json({
        success:true,
        message:"Username is available",
    },{status:200})

  } catch (error) {
    console.log("Error checking username", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
