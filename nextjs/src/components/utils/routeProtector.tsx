"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import useProjectStore from "@/stores/project/useProjectStore";

const RouteProtector: React.FC = () => {
  const { isLoggedIn, isHydrated } = useAuthStore();
  const { setProjects } = useProjectStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated) {
      if (!isLoggedIn) {
        router.replace("/");
        setProjects([]);
      }
    }
  }, [isHydrated, isLoggedIn, router]);

  return null; // This component doesn't render anything
};

export default RouteProtector;
