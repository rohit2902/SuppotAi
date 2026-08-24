import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import User from "../../../../../models/user.model";
import { generateAccessToken, generateRefreshToken } from "../../../../../lib/generateToken";
import getRedis from "../../../../../lib/redis";


export async function POST(request: NextRequest ) {
  try {
    await connectDB();
     
    const {email , password} = await request.json()
     console.log(email , password)
      if(!email || !password){
        return NextResponse.json(
          {
             success:false,
            message: "all field are required"
          }
        )
      }

      const user = await User.findOne({email})
      if(!user){
        return  NextResponse.json(
          {
            success:false,
            message:"user not found"
          },{
            status:404
          }
        )
      }
 
      const isMatchPassword = await user.comparePassword(password)
      if(!isMatchPassword){
        return NextResponse.json(
          {
            success: false,
            message: "Invalid password" 
          },{status:401}
        )
      }

      const accessToken = await generateAccessToken(user._id.toString())
      const refreshToken = await generateRefreshToken(user._id.toString())

         const response = NextResponse.json(
            {
              success: true,
              message: "User login successfully",
              user,
              accessToken,
              refreshToken
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

     return response

   
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Login error ${error}`,
      },
      { status: 500 }
    );
  }
}