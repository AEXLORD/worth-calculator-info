import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    // 连接MongoDB
    const client = await clientPromise;
    const db = client.db("worth-calculator");
    
    // 检查数据库连接
    const adminDb = client.db("admin");
    await adminDb.command({ ping: 1 });
    
    // 获取数据库统计信息
    const stats = await db.stats();
    
    // 获取集合列表
    const collections = await db.listCollections().toArray();
    
    // 获取各集合的文档数量
    const collectionStats = await Promise.all(
      collections.map(async (collection) => {
        const count = await db.collection(collection.name).countDocuments();
        return {
          name: collection.name,
          count
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      database: "worth-calculator",
      stats: {
        collections: stats.collections,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize
      },
      collections: collectionStats,
      mongodbUri: process.env.MONGODB_URI ? "Set" : "Not set"
    });
  } catch (error) {
    console.error("MongoDB test error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
      mongodbUri: process.env.MONGODB_URI ? "Set" : "Not set"
    }, { status: 500 });
  }
} 