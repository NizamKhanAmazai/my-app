import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    // const { searchParams } = new URL(req.url);

    //added the below one to fix the deploy issue
    const searchParams = req.nextUrl.searchParams;
    
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "10");
    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";
    const brand = searchParams.get("brand") ?? "";

    // ✅ FIX: explicitly type where
    const where: Prisma.ProductWhereInput = {
      status: "ACTIVE",
    };

    // ✅ search filter
    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          brand: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // ✅ category filter
    if (category) {
      where.category = {
        name: {
          contains: category,
          mode: "insensitive",
        },
      };
    }

    // ✅ brand filter
    if (brand) {
      where.brand = {
        equals: brand,
        mode: "insensitive",
      };
    }

    // ✅ Queries
    const [totalCount, products] = await Promise.all([
      prisma.product.count({ where }),

      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,

        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          discountPrice: true,
          brand: true,
          sku: true,
          stockQuantity: true,
          status: true,
          createdAt: true,

          category: {
            select: {
              name: true,
            },
          },

          images: {
            orderBy: [{ isPrimary: "desc" }, { id: "asc" }],
            select: {
              url: true,
            },
          },

          reviews: {
            where: { deletedAt: null },
            select: { rating: true },
          },
          ProductAttribute: {
            select: {
              id: true,
              name: true,
              value: true,
            },
          },
        },
      }),
    ]);

    // ✅ Format response
    const formattedProducts = products.map((product) => {
      const ratings = product.reviews.map((r) => r.rating);

      const avgRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;

      return {
        id: product.id,
        title: product.title,
        description: product.description,

        category: product.category?.name ?? null,

        brand: product.brand ?? "Unknown",
        sku: product.sku,

        price: product.price,
        discountPrice: product.discountPrice ?? undefined,

        stockQuantity: product.stockQuantity,
        status: product.status,

        images: product.images.map((img) => img.url),

        rating: Number(avgRating.toFixed(1)),

        isNew:
          Date.now() - new Date(product.createdAt).getTime() <
          1000 * 60 * 60 * 24 * 7,

        productAttributes: product.ProductAttribute,

        createdAt: product.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
