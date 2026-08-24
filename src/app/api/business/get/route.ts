import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import {connectDB} from "../../../../../lib/db";
import Business from "../../../../../models/business.model";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // 1. Get token
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

    // 3. Get owner ID
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

    // 4. Find business
    const business = await Business.findOne({
      ownerId,
    });
    

    // 5. Business not found
    if (!business) {
      return NextResponse.json(
        {
          success: false,
          message: "Business not found.",
        },
        { status: 404 }
      );
    }

    // 6. Return business
    return NextResponse.json(
      {
        success: true,
        message: "Business fetched successfully.",
        business,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Business Error:", error);

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