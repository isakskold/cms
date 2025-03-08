"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth/useAuthStore";

const RouteProtector: React.FC = () => {
  const { tokenData } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!tokenData) {
      router.replace("/"); // Redirect to login page if not authenticated
    }
  }, [tokenData, router, pathname]);

  return null; // This component doesn't render anything
};

export default RouteProtector;
