"use client";
import { updateUser } from "@/store/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Camera, PencilIcon, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type HeaderUser = {
  name?: string;
  email?: string;
  image?: string;
  membership?: string;
};

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=John";
const MAX_IMAGE_SIDE = 1200;
const OUTPUT_QUALITY = 0.8;

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }

  const imageUrl = URL.createObjectURL(file);

  try {
    const imageElement = await new Promise<HTMLImageElement>(
      (resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Image preview failed"));
        img.src = imageUrl;
      },
    );

    const ratio = Math.min(
      1,
      MAX_IMAGE_SIDE / Math.max(imageElement.width, imageElement.height),
    );
    const targetWidth = Math.max(1, Math.round(imageElement.width * ratio));
    const targetHeight = Math.max(1, Math.round(imageElement.height * ratio));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return file;
    }

    ctx.drawImage(imageElement, 0, 0, targetWidth, targetHeight);

    const outputMimeType =
      file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, outputMimeType, OUTPUT_QUALITY);
    });

    if (!blob) {
      return file;
    }

    const extension = outputMimeType === "image/png" ? "png" : "jpg";
    const newName = file.name.replace(/\.[^/.]+$/, "") + `.${extension}`;

    return new File([blob], newName, {
      type: outputMimeType,
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export default function ProfileHeader({ user }: { user?: HeaderUser }) {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.user.user);

  const activeUser: HeaderUser = {
    name: reduxUser?.name ?? user?.name ?? "User",
    email: reduxUser?.email ?? user?.email ?? "",
    image: reduxUser?.image ?? user?.image ?? DEFAULT_AVATAR,
    membership: reduxUser?.membership ?? user?.membership ?? "Premium",
  };

  const [changeImage, setChangeImage] = useState<boolean>(false);
  const [imagefile, setimagefile] = useState<File | null>(null);
  const [userImage, setUserImage] = useState<string>(
    activeUser.image || DEFAULT_AVATAR,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const imgInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!imagefile) {
      setUserImage(activeUser.image || DEFAULT_AVATAR);
      return;
    }

    const previewUrl = URL.createObjectURL(imagefile);
    setUserImage(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imagefile, activeUser.image]);

  const handleUpload = async () => {
    if (!imagefile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const compressedFile = await compressImage(imagefile);

      const formData = new FormData();
      formData.append("image", compressedFile);

      const response = await fetch("/api/profile/image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to update profile image");
      }

      dispatch(updateUser({ image: data.image }));
      setUserImage(data.image);
      setimagefile(null);
      setChangeImage(false);
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "Failed to update profile image",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Avatar Upload Container */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-full p-1 bg-linear-to-tr from-[#FFA500] to-[#FFD700]">
            <div className="w-full h-full rounded-full bg-white p-1 group relative">
              {changeImage ? (
                <>
                  <span className="bg-black w-full h-full rounded-full object-cover hidden group-hover:block absolute top-0 right-0 opacity-55"></span>
                  <Camera
                    size={40}
                    className="animate-pulse hidden group-hover:flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
                    onClick={() => {
                      imgInput.current?.click();
                    }}
                  />
                </>
              ) : null}
              {/* <Image
                src={userImage || DEFAULT_AVATAR}
                alt={activeUser.name || "User"}
                className="w-full h-full rounded-full object-cover"
                width={96}
                height={96}
                /> */}
              {/* add nextjs image component */}
              <Image
                src={userImage || DEFAULT_AVATAR}
                width={100}
                height={100}
                alt={activeUser.name || "User"}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          {changeImage ? null : (
            <button
              type="button"
              className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-[#FFA500] transition-colors"
            >
              <PencilIcon
                size={16}
                onClick={() => {
                  setChangeImage(true);
                }}
              />
            </button>
          )}
          <input
            type="file"
            className="hidden"
            ref={imgInput}
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setimagefile(file);
              }
            }}
          />
        </div>

        {/* User Details */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeUser.name}
          </h1>
          <p className="text-gray-500">{activeUser.email}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FFA500] border border-orange-100">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {activeUser.membership} Member
            </span>
          </div>
        </div>
      </div>

      {changeImage ? (
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={handleUpload}
            disabled={!imagefile || isUploading}
            className="px-6 py-2.5 rounded-xl border border-gray-200 font-medium hover:bg-gray-50 transition-all text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isUploading ? "Updating..." : "Update image"}
          </button>
          {uploadError ? (
            <p className="text-sm text-red-500" role="alert">
              {uploadError}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
