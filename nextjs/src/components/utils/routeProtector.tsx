"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth/useAuthStore";

const RouteProtector: React.FC = () => {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/"); // Redirect to login page if not authenticated
    }
  }, [isLoggedIn, router, pathname]);

  return null; // This component doesn't render anything
};

export default RouteProtector;
