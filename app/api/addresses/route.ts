import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId: session.user.id,
        deletedAt: null,
      },
      orderBy: { isDefault: "desc" },
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("Fetch addresses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      fullName,
      phoneNumber,
      fullAddress,
      city,
      country,
      state,
      postalCode,
      landmark,
      isDefault,
    } = body;

    // Validate required fields
    if (!fullName || !phoneNumber || !fullAddress || !city) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // If this is the default address, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    // ✅ FIXED: use relation connect instead of raw userId
    const address = await prisma.address.create({
      data: {
        fullName,
        phoneNumber,
        fullAddress,
        city,
        country: country || null,
        state,
        postalCode,
        landmark,
        isDefault,

        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error("Create address error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function GET(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const addresses = await prisma.address.findMany({
//       where: {
//         userId: session.user.id,
//         deletedAt: null,
//       },
//       orderBy: { isDefault: "desc" },
//     });

//     return NextResponse.json(addresses);
//   } catch (error) {
//     console.error("Fetch addresses error:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch addresses" },
//       { status: 500 },
//     );
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const {
//       fullName,
//       phoneNumber,
//       fullAddress,
//       city,
//       country,
//       state,
//       postalCode,
//       landmark,
//       isDefault,
//     } = body;

//     // Validate if mandatory fields are present
//     if (!fullName || !phoneNumber || !fullAddress || !city) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 },
//       );
//     }

//     // If this is the default address, unset other default addresses for this user
//     if (isDefault) {
//       await prisma.address.updateMany({
//         where: { userId: session.user.id },
//         data: { isDefault: false },
//       });
//     }

//     const address = await prisma.address.create({
//       data: {
//         userId: session.user.id,
//         fullName,
//         phoneNumber,
//         fullAddress,
//         city,
//         country: country || null,
//         state,
//         postalCode,
//         landmark,
//         isDefault,
//       },
//     });

//     return NextResponse.json(address);
//   } catch (error) {
//     console.error("Create address error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }
