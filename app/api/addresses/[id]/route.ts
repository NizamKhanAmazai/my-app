import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // added this to fix the build issue
    const { id } = await props.params;
    
    // ✅ FIX: await the whole params object
    // const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 },
      );
    }

    // Check if address belongs to user
    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address || address.userId !== session.user.id) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // 1. Check if the address is currently used by an order that is not finished
    // We check orders for this user where the status is not 'DELIVERED' or 'CANCELLED'
    // and where the shippingAddress string contains enough info to match this specific address
    // Since shippingAddress is a snapshot string, we'll look for orders where the snapshot contains the fullAddress
    const unfinishedOrders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        status: {
          notIn: ["DELIVERED", "CANCELLED"],
        },
        shippingAddress: {
          contains: address.fullAddress,
        },
      },
    });

    if (unfinishedOrders.length > 0) {
      return NextResponse.json(
        {
          error: "RESTRICED_DELETE",
          message:
            "You cannot delete this address because you have an active order associated with it.",
        },
        { status: 400 },
      );
    }

    // 2. Soft delete: set deletedAt instead of deleting the record
    await prisma.address.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isDefault: false, // Ensure it's no longer the default
      },
    });

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
