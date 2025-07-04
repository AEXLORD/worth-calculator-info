import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "../../../lib/ip-utils";

export async function GET(request: NextRequest) {
  // 获取所有可能的IP相关头信息
  const headers = {
    "x-forwarded-for": request.headers.get("x-forwarded-for"),
    "x-real-ip": request.headers.get("x-real-ip"),
    "cf-connecting-ip": request.headers.get("cf-connecting-ip"),
    "x-forwarded": request.headers.get("x-forwarded"),
    "forwarded": request.headers.get("forwarded"),
    "x-client-ip": request.headers.get("x-client-ip"),
    "x-cluster-client-ip": request.headers.get("x-cluster-client-ip"),
    "x-forwarded-host": request.headers.get("x-forwarded-host"),
    "x-forwarded-proto": request.headers.get("x-forwarded-proto"),
  };

  // 尝试获取真实IP
  const detectedIp = getClientIp(request);
  const isPrivateIp = detectedIp === "unknown";

  return NextResponse.json({
    detectedIp,
    isPrivateIp,
    allHeaders: headers,
    userAgent: request.headers.get("user-agent"),
    host: request.headers.get("host"),
  });
} 