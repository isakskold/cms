"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth/useAuthStore";

const RouteProtector: React.FC = () => {
  const { email } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!email) {
      router.replace("/"); // Redirect to login page if not authenticated
    }
  }, [email, router, pathname]);

  return null; // This component doesn't render anything
};

export default RouteProtector;
