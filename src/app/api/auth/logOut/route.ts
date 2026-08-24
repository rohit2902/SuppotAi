import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import User from "../../../../../models/user.model";

type UserTokenPayload = jwt.JwtPayload & {
  id: string;
  email: string;
  name: string;
};

export async function GET() {
    const cookieStore = await cookies()
    const refreshToken =  cookieStore.get("refreshToken")?.value;
     const accessToken =  cookieStore.get("accessToken")?.value;
            
       cookieStore.delete("refreshToken");
       cookieStore.delete("accessToken");

    return NextResponse.json(
    
        { message: "Logged out successfully" },
      { status: 200 }
    );

    
}