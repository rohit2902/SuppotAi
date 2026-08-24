import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import {connectDB} from "../../../../../lib/db";
import Business from "../../../../../models/business.model";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // 1. Get refresh token from cookie
    const token = request.cookies.get("refreshToken")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please login first.",
        },
        { status: 401 }
      );
    }

    // 2. Verify token
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!
    ) as {
      userId: string;
    };

    // 3. Get ownerId from verified token
    const ownerId = decoded.userId;
      
    if (!ownerId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token.",
        },
        { status: 401 }
      );
    }

    // 4. Get business data
    const body = await request.json();

    const {
      businessName,
      supportEmail,
      knowledge,
    } = body;
   
    // 5. Validate fields
    if (!businessName || !supportEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Business name and contact are required.",
        },
        { status: 400 }
      );
    }


    // 7. Create business
      const business = await Business.findOneAndUpdate(
      { ownerId },
      {
        businessName,
        supportEmail,
        knowledge,
        
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    // 8. Response
    return NextResponse.json(
      {
        success: true,
        message: "Business Save successfully.",
        business,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Business Error:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}