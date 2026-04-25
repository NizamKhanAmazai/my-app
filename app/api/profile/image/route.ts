import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const CLOUDINARY_HOST = "res.cloudinary.com";

function extractCloudinaryPublicId(imageUrl: string): string | null {
  try {
    const url = new URL(imageUrl);

    if (!url.hostname.includes(CLOUDINARY_HOST)) {
      return null;
    }

    const uploadSegment = "/upload/";
    const uploadIndex = url.pathname.indexOf(uploadSegment);

    if (uploadIndex === -1) {
      return null;
    }

    let publicIdWithExtension = url.pathname.slice(
      uploadIndex + uploadSegment.length,
    );

    // Strip Cloudinary version prefix when present (e.g. v1712412345/...).
    publicIdWithExtension = publicIdWithExtension.replace(/^v\d+\//, "");

    const dotIndex = publicIdWithExtension.lastIndexOf(".");
    if (dotIndex === -1) {
      return null;
    }

    return publicIdWithExtension.slice(0, dotIndex);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const imageEntry = formData.get("image");

    if (!imageEntry || typeof imageEntry === "string") {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 },
      );
    }

    const imageFile = imageEntry as File;

    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 },
      );
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image size must be less than 5MB" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
    const base64Image = fileBuffer.toString("base64");
    const dataUri = `data:${imageFile.type};base64,${base64Image}`;

    const uploadedImage = await cloudinary.uploader.upload(dataUri, {
      folder: "user_profile_images",
      resource_type: "image",
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: uploadedImage.secure_url },
    });

    const oldPublicId = existingUser.image
      ? extractCloudinaryPublicId(existingUser.image)
      : null;

    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId, {
          resource_type: "image",
        });
      } catch {
        // Do not fail request if old image cleanup fails after successful update.
      }
    }

    return NextResponse.json(
      { image: uploadedImage.secure_url },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to update profile image" },
      { status: 500 },
    );
  }
}
