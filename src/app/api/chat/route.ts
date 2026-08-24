import { NextRequest, NextResponse } from "next/server";
import Business from "../../../../models/business.model";
import { GoogleGenAI } from "@google/genai";
import { connectDB } from "../../../../lib/db"; 

// 1. The POST Function
export async function POST(req: NextRequest) {
  try {
    await connectDB(); 

    const { message, ownerId } = await req.json();
   

    if (!message || !ownerId) {
      return NextResponse.json(
        { message: "message and owner id are required" },
        { status: 400 },
      );
    }

    const business = await Business.findOne({ ownerId });
    if (!business) {
      return NextResponse.json(
        { message: "chat bot is not configured yet." },
        { status: 400 },
      );
    }

    const KNOWLEDGE = `
        business name - ${business.businessName || "not provided"}
        support email - ${business.supportEmail || "not provided"}
        knowledge -  ${business.knowledge || "not provided"}
        `;
        
    const CUSTOMER_QUESTION = message; 

    const prompt = `
You are an AI customer support assistant for the business described below.

Your job is to help customers with accurate, helpful, and polite answers based ONLY on the business information provided.

========================
BUSINESS INFORMATION
========================

${KNOWLEDGE}

========================
STRICT RULES
========================
[... your rules ...]

========================
CUSTOMER QUESTION
========================

${CUSTOMER_QUESTION}

========================
ANSWER
========================
     `;
    
    if (!process.env.Google_Gemini_Api_Key) {
       return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.Google_Gemini_Api_Key });
   

    const interaction = await ai.interactions.create({
      model: "gemini-3.1-flash-lite",
      input: prompt,
    });

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    
    
    return NextResponse.json(
      { response: interaction.output_text },
      { status: 200, headers: corsHeaders }
    );

  } catch (err: any) {
    console.error("Chat API Error:", err);
    
    const response = NextResponse.json(
      {
        success: false,
        message: `chat error: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );

    // Apply CORS headers to error response
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  }
}


export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}