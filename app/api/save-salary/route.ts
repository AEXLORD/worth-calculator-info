import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getClientIp } from "../../../lib/ip-utils";

export async function POST(request: NextRequest) {
  try {
    const { salary } = await request.json();
    
    if (!salary) {
      return NextResponse.json({ error: "Salary is required" }, { status: 400 });
    }

    // 获取用户公网IP
    const ip = getClientIp(request);
    
    // 获取当前时间
    const timestamp = new Date().toISOString();
    
    // 生成UUID
    const id = uuidv4();
    
    // 连接数据库
    const sql = neon(process.env.DATABASE_URL!);
    
    // 插入数据
    await sql`
      INSERT INTO "user-info" (id, ip, salary, other)
      VALUES (${id}, ${ip}, ${salary}, ${JSON.stringify({
        timestamp,
        action: "salary_input"
      })})
    `;
    
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error saving salary data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 