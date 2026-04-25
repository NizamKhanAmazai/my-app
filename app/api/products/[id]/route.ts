import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await props.params;
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        ProductAttribute: true,
        category: true,
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Related products (same category)
    const relatedProducts = await prisma.product.findMany({
      where: {
        OR: [
          { categoryId: product.categoryId }, 
        ],
        id: { not: id },
        status: "ACTIVE",
      },
      take: 3,
      include: {
        images: true,
      },
    });

    return NextResponse.json({ product, relatedProducts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}
