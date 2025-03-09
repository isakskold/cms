"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth/useAuthStore";

const RouteProtector: React.FC = () => {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const [isHydrated, setIsHydrated] = useState(false);

  // Ensure Zustand has rehydrated before running the effect
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      console.log("isLoggedIn state after hydration:", isLoggedIn);
      if (!isLoggedIn) {
        router.replace("/");
      }
    }
  }, [isHydrated, isLoggedIn, router, pathname]);

  return null; // This component doesn't render anything
};

export default RouteProtector;
