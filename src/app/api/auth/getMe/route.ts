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
            
     if (!refreshToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!refreshTokenSecret) {
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    const decoded = jwt.verify(refreshToken, refreshTokenSecret) as UserTokenPayload;
    const user = await User.findById(decoded.userId).select(
  "-password "
);
    return NextResponse.json({
      user
        
    });

    
}