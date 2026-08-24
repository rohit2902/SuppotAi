import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import User from "../../../../../models/user.model";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../../../lib/generateToken";
import getRedis from "../../../../../lib/redis";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All field are required",
        },
        {
          status: 400,
        },
      );
    }

    const isAlreadyUserExist = await User.findOne({ email });
    if (isAlreadyUserExist) {
      return NextResponse.json(
        {
          success: false,
          message: "user already exist",
        },
        {
          status: 404,
        },
      );
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const accessToken = await generateAccessToken(user._id.toString());
    const refreshToken = await generateRefreshToken(user._id.toString());

    const response = NextResponse.json(
      {
        success: true,
        message: "User login successfully",
        accessToken,
        refreshToken,
      },
      { status: 200 },
    );
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    const redis = await getRedis();

    await redis.set(`refreshToken:${user._id.toString()}`, refreshToken, {
      EX: 7 * 24 * 60 * 60,
    });
    await redis.set(`accessToken:${user._id.toString()}`, accessToken, {
      EX:  60 * 60,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Registration failed",
      },
      { status: 500 },
    );
  }
}
