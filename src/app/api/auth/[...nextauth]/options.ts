import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id: "credentials",
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "text" }, //the access the email we write -->"credentials.identifier.email"
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials:any):Promise<any>{
                await dbConnect();
                try {
                  const user=  await UserModel.findOne({
                        $or:[{email:credentials.identifier},
                            {username:credentials.identifier}]
                    })
                    if(!user){
                        throw new Error("No user found with this email")
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your account first");
                    }
                   const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password);

                   if(isPasswordCorrect){
                    return user;
                   }else{
                    throw new Error("Incorrect password ");
                   }

                } catch (error:any) {
                    throw new Error(error)
                }
          }
        })//for addingGithub provider for signup we'll put a comma after credential provider and will add the github provider , for all the other providers wen just have to copy and paste from the docs and modify a bit according to our need , credential provider is the toughest to modify
    ],
    callbacks:{
        async jwt({ token, user}) { //the "user" we're getting from the providers
            if(user){

                //in the below we're modifying the token
                token._id=user._id?.toString();
                token.isVerified=user.isVerified;
                token.isAcceptingMessages=user.isAcceptingMessages;
                token.username=user.username;
            }         
            return token
        },
        async session({ session,token }) {
            if(token){
                //we're modifying the session and storing many other datas in it , like the below
                session.user._id=token._id
                session.user.isVerified=token.isVerified
                session.user.isAcceptingMessages=token.isAcceptingMessages
                session.user.username=token.username
            }
            return session
        },
    },
    pages:{
        //when will go to the route , for sign-in the page will automatically be generated by nextauth
        signIn:"/sign-in"
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET,

}