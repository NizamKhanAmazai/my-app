import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // your NextAuth config

export async function POST(req: NextRequest) {
  try {
    // 1. Get session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Get request body
    const body = await req.json();
    const productId = body.productId;

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 },
      );
    }

    // 3. Get user from DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 4. Check product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, deletedAt: true },
    });

    if (!product || product.deletedAt !== null) {
      return NextResponse.json(
        { message: "Product not found or has been deleted" },
        { status: 404 },
      );
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    });

    if (existing) {
      // Remove from wishlist
    //   await prisma.wishlistItem.delete({
    //     where: {
    //       userId_productId: {
    //         userId: user.id,
    //         productId: productId,
    //       },
    //     },
    //   });

      return NextResponse.json(
        { message: "Product already exist in wishlist" },
        { status: 200 },
      );
    }

    // Otherwise add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        productId: productId,
      },
    });

    return NextResponse.json(
      {
        message: "Product added to wishlist",
        data: wishlistItem,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}





 

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 1. Wishlist items
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      select: { productId: true },
      orderBy: { createdAt: "desc" },
    });

    const productIds = wishlistItems.map((i) => i.productId);

    if (productIds.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    // 2. Products
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        title: true,
        price: true,
        discountPrice: true,
      },
    });

    // 3. Primary images
    const images = await prisma.productImage.findMany({
      where: {
        productId: { in: productIds },
        isPrimary: true,
      },
      select: {
        productId: true,
        url: true,
      },
    });

    // 4. Reviews (for rating)
    const reviews = await prisma.review.findMany({
      where: {
        productId: { in: productIds },
        deletedAt: null,
      },
      select: {
        productId: true,
        rating: true,
      },
    });

    // 5. Merge data
    const result = products.map((product) => {
      const productImages = images.find(
        (img) => img.productId === product.id
      );

      const productReviews = reviews.filter(
        (r) => r.productId === product.id
      );

      const avgRating =
        productReviews.length > 0
          ? productReviews.reduce((a, b) => a + b.rating, 0) /
            productReviews.length
          : 0;

      return {
        id: product.id,
        name: product.title,
        price: product.price,
        discountPrice: product.discountPrice,
        image: productImages?.url || null,
        rating: Number(avgRating.toFixed(1)),
      };
    });

    // 6. Maintain wishlist order
    const ordered = productIds
      .map((id) => result.find((p) => p.id === id))
      .filter(Boolean);

    return NextResponse.json(
      {
        message: "Wishlist fetched successfully",
        data: ordered,
      },
      { status: 200 }
    );
  } catch (error: any) {
//   console.error("🔥 WISHLIST API ERROR FULL:", error);
//   console.error("🔥 MESSAGE:", error?.message);
//   console.error("🔥 STACK:", error?.stack);

  return NextResponse.json(
    {
      message: "Internal Server Error",
      error: error?.message,
    },
    { status: 500 }
  );
}
} 

 
export async function DELETE(req: NextRequest) {
  try {
    // 1. Get session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // 3. Get productId from request body
    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    // 4. Delete wishlist item
    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    });

    return NextResponse.json(
      { message: "Wishlist item removed" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);

    // handle case where item doesn't exist
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Wishlist item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}