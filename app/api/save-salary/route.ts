import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "../../../lib/ip-utils";
import clientPromise from "../../../lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { salary } = await request.json();
    
    if (!salary) {
      return NextResponse.json({ error: "Salary is required" }, { status: 400 });
    }

    // 获取用户公网IP
    const ip = getClientIp(request);
    
    // 获取当前时间
    const timestamp = new Date();
    
    // 连接MongoDB
    const client = await clientPromise;
    const db = client.db("worth-calculator");
    
    // 插入数据到MongoDB
    const result = await db.collection("salary_inputs").insertOne({
      ip,
      salary,
      timestamp,
      action: "salary_input",
      createdAt: new Date()
    });
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("Error saving salary data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 