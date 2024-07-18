import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

//react email is used to provide the template to send the email
//resend is used to send the email

export async function sendVerficationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',//overhere we wrote the "onboarding" email as our domain is not registered
            to: email,
            subject: 'Mystery message verification code',
            react:VerificationEmail({username,otp:verifyCode}),
          });
          
        
        return{
            success:true,
            message:"Verification email send successfully "
        }
    } catch (emailError) {
        console.error("Error sending verification email ",emailError);
        return{
            success:false,
            message:"Failed to send verification email"
        }
    }
}