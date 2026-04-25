import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const category = searchParams.get("category") || "";

    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        AND: [
          category && category !== "All"
            ? {
                category: {
                  name: {
                    contains: category,
                    mode: "insensitive",
                  },
                },
              }
            : {},
          query
            ? {
                OR: [
                  { title: { contains: query, mode: "insensitive" } },
                  { description: { contains: query, mode: "insensitive" } },
                  { brand: { contains: query, mode: "insensitive" } },
                ],
              }
            : {},
        ],
      },
      include: {
        category: true,
        images: true,
        reviews: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
