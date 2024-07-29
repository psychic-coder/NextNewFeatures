import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found ",
        },
        { status: 404 }
      );
    }

    //is user accepting messages
    if (!user.isAcceptingMessage) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not accepting the messages",
        },
        { status: 403 }
      );
    }

    const newMessage = {
      content: content,
      createdAt: new Date(),
    };
    user.messages.push(newMessage as Message);
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "message sent successfully",
      },
      { status: 401 }
    );
  } catch (error) {
    console.log("Error adding messages", error);

    return NextResponse.json(
      {
        success: false,
        messages: "Internal server error",
      },
      { status: 500 }
    );
  }
}
