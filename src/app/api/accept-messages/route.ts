import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  //we're getting hold of the session
  const session = await getServerSession(authOptions);
  //the User is the user we defined and imported from the next-auth
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 500 }
    );
  }
  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true } //on doing new:True we get the updated value
    );
    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update the user status to accept messages",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message acceptance status updated successfully ",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update the user status to accept messages ");

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update the user status to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  //we're getting hold of the session
  const session = await getServerSession(authOptions);
  //the User is the user we defined and imported from the next-auth
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 500 }
    );
  }
  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update the user status to accept messages ");

    return NextResponse.json(
      {
        success: false,
        message: "Error in getting message acceptance status",
      },
      { status: 500 }
    );
  }
}
