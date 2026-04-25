import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: "Unauthorized. Please sign in to place an order." },
//         { status: 401 },
//       );
//     }

//     const body = await req.json();

//     const { items, customer, payment, total } = body;

//     console.log("Creating order for user:", session.user.id);
//     console.log("Order details:", {
//       itemCount: items?.length,
//       total,
//       paymentMethod: payment?.method,
//     });

//     // Validate data
//     if (!items || items.length === 0) {
//       return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
//     }

//     if (!total || total <= 0) {
//       return NextResponse.json(
//         { error: "Invalid total amount" },
//         { status: 400 },
//       );
//     }

//     if (!customer.fullName || !customer.address || !customer.city) {
//       return NextResponse.json(
//         { error: "Missing required shipping details" },
//         { status: 400 },
//       );
//     }

//     const shippingAddressSnapshot = `${customer.fullName}, ${customer.address}, ${customer.city}, ${customer.postalCode || ""}, Landmark: ${customer.landmark || "N/A"}`;

//     // Map payment method to Prisma enum
//     let paymentMethod: "COD" | "CARD" | "EASYPAISA" | "JAZZCASH" = "COD";
//     if (payment.method === "CREDIT_CARD") {
//       paymentMethod = "CARD";
//     }

//     // Use transaction to create order and items
//     const order = await prisma.$transaction(async (tx) => {
//       const newOrder = await tx.order.create({
//         data: {
//           userId: session.user.id,
//           totalAmount: total,
//           status: "PENDING",
//           paymentStatus: "PENDING",
//           paymentMethod: paymentMethod,
//           shippingAddress: shippingAddressSnapshot,
//           items: {
//             create: items.map((item: any) => {
//               if (!item.productId) {
//                 throw new Error(
//                   `Missing productId for item: ${item.title || item.name || "unknown"}`,
//                 );
//               }
//               return {
//                 productId: item.productId,
//                 quantity: item.quantity,
//                 price: item.discountPrice ?? item.price,
//                 variantId: item.selectedVariant || null,
//               };
//             }),
//           },
//         },
//       });

//       // Clear user's database cart if they have one
//       await tx.cartItem.deleteMany({
//         where: {
//           cart: {
//             userId: session.user.id,
//           },
//         },
//       });

//       return newOrder;
//     });

//     return NextResponse.json(
//       { success: true, orderId: order.id },
//       { status: 201 },
//     );
//   } catch (error) {
//     console.error("Order creation error:", error);
//     return NextResponse.json(
//       { error: "Failed to create order" },
//       { status: 500 },
//     );
//   }
// }

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to place an order." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { items, customer, payment, total } = body;

    // console.log("Creating order for user:", session.user.id);

    // ✅ Validate input safely
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!total || total <= 0) {
      return NextResponse.json(
        { error: "Invalid total amount" },
        { status: 400 },
      );
    }

    if (!customer?.fullName || !customer?.address || !customer?.city) {
      return NextResponse.json(
        { error: "Missing required shipping details" },
        { status: 400 },
      );
    }

    // ✅ Address snapshot (for order history)
    const shippingAddressSnapshot = `${customer.fullName}, ${customer.address}, ${customer.city}, ${customer.postalCode || ""}, Landmark: ${customer.landmark || "N/A"}`;

    // ✅ Map payment method properly
    let paymentMethod: "COD" | "CARD" | "EASYPAISA" | "JAZZCASH" = "COD";

    switch (payment?.method) {
      case "CREDIT_CARD":
        paymentMethod = "CARD";
        break;
      case "EASYPAISA":
        paymentMethod = "EASYPAISA";
        break;
      case "JAZZCASH":
        paymentMethod = "JAZZCASH";
        break;
      default:
        paymentMethod = "COD";
    }

    // ✅ Transaction: order + address + payment + cleanup
    const order = await prisma.$transaction(async (tx) => {
      // 1. Save address
      const address = await tx.address.create({
        data: {
          userId: session.user.id,
          fullName: customer.fullName,
          phoneNumber: customer.phoneNumber || "",
          country: customer.country || "Pakistan",
          city: customer.city,
          state: customer.state || null,
          postalCode: customer.postalCode || null,
          fullAddress: customer.address,
          landmark: customer.landmark || null,
        },
      });

      // 2. Create order with items
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          totalAmount: total,
          status: "PENDING",
          paymentStatus: "PENDING",
          paymentMethod,
          shippingAddress: shippingAddressSnapshot,
          items: {
            create: items.map((item: any) => {
              if (!item.productId) {
                throw new Error(
                  `Missing productId for item: ${
                    item.title || item.name || "unknown"
                  }`,
                );
              }

              return {
                productId: item.productId,
                quantity: item.quantity,
                price: item.discountPrice ?? item.price,
                variantId: item.selectedVariant || null,
              };
            }),
          },
        },
      });

      // 3. Create payment record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          amount: total,
          status: "PENDING",
          method: paymentMethod,
        },
      });

      // 4. Clear cart AFTER successful order
      await tx.cartItem.deleteMany({
        where: {
          cart: {
            userId: session.user.id,
          },
        },
      });

      return newOrder;
    });

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Order creation error:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to create order",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedOrders = orders.map((order) => ({
      id: order.id.slice(0, 8).toUpperCase(),
      date: new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      total: order.totalAmount,
      status:
        order.status.charAt(0).toUpperCase() +
        order.status.slice(1).toLowerCase(),
      items: order.items.map((item) => ({
        name: item.product.title,
        image: item.product.images[0]?.url || "/api/placeholder/100/100",
      })),
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
