"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/features/userSlice";

/**
 * SessionUpdater component listens to NextAuth session changes and dispatches user data to Redux.
 * This ensures the Redux store is always in sync with the authenticated user session.
 */
export default function SessionUpdater() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Ensure all required fields for the Redux User interface are present before dispatching
      if (
        session.user.id &&
        session.user.name &&
        session.user.email &&
        session.user.createdAt &&
        session.user.updatedAt &&
        session.user.status
      ) {
        dispatch(
          setUser({
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            status: session.user.status,
            createdAt: session.user.createdAt,
            updatedAt: session.user.updatedAt,
          }),
        );
      }
    } else if (status === "unauthenticated") {
      // Optionally clear user from Redux if session ends
      // dispatch(clearUser());
    }
  }, [session, status, dispatch]);

  return null; // This component doesn't render any UI
}
