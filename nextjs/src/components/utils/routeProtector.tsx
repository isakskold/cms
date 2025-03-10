"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import useProjectStore from "@/stores/project/useProjectStore";

const RouteProtector: React.FC = () => {
  const { isLoggedIn, isHydrated } = useAuthStore();
  const { setProjects } = useProjectStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isHydrated) {
      if (!isLoggedIn) {
        router.replace("/");
        setProjects([]);
      }
    }
  }, [isHydrated, isLoggedIn, router, pathname]);

  return null; // This component doesn't render anything
};

export default RouteProtector;
