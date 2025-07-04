import { NextRequest } from "next/server";

export function getClientIp(request: NextRequest): string {
  // 获取所有可能的IP相关头信息
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  const realIp = request.headers.get("x-real-ip");
  const xForwardedFor = request.headers.get("x-forwarded-for");
  const xForwarded = request.headers.get("x-forwarded");
  const forwarded = request.headers.get("forwarded");
  
  let ip = "unknown";
  
  // 优先级：Cloudflare > X-Real-IP > X-Forwarded-For > X-Forwarded > Forwarded
  if (cfConnectingIp) {
    ip = cfConnectingIp;
  } else if (realIp) {
    ip = realIp;
  } else if (xForwardedFor) {
    // X-Forwarded-For 可能包含多个IP，取第一个（客户端IP）
    ip = xForwardedFor.split(",")[0].trim();
  } else if (xForwarded) {
    // 解析 X-Forwarded 头
    const match = xForwarded.match(/for=([^;]+)/);
    if (match) {
      ip = match[1].trim();
    }
  } else if (forwarded) {
    // 解析 Forwarded 头
    const match = forwarded.match(/for=([^;]+)/);
    if (match) {
      ip = match[1].trim();
    }
  }
  
  // 过滤掉内网IP和IPv6本地地址
  if (isPrivateIp(ip)) {
    return "unknown";
  }
  
  return ip;
}

function isPrivateIp(ip: string): boolean {
  // IPv6 本地地址
  if (ip === "::1" || ip === "localhost") {
    return true;
  }
  
  // IPv4 映射到 IPv6 的私有地址
  if (ip.startsWith("::ffff:")) {
    const ipv4 = ip.substring(7);
    return isPrivateIpv4(ipv4);
  }
  
  // 直接检查 IPv4
  return isPrivateIpv4(ip);
}

function isPrivateIpv4(ip: string): boolean {
  // 私有IP地址范围
  const privateRanges = [
    /^10\./,                    // 10.0.0.0/8
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
    /^192\.168\./,              // 192.168.0.0/16
    /^127\./,                   // 127.0.0.0/8 (localhost)
    /^169\.254\./,              // 169.254.0.0/16 (link-local)
    /^0\./,                     // 0.0.0.0/8
    /^224\./,                   // 224.0.0.0/4 (multicast)
    /^240\./,                   // 240.0.0.0/4 (reserved)
  ];
  
  return privateRanges.some(range => range.test(ip));
} 