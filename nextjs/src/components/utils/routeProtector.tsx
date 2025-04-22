"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import useProjectStore from "@/stores/project/useProjectStore";

const RouteProtector: React.FC = () => {
  const { isLoggedIn, isHydrated } = useAuthStore();
  const { setProjects, isHydrated: isHydratedProjects } = useProjectStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if we're on the callback page or if stores aren't hydrated
    if (pathname === "/callback" || !isHydrated || !isHydratedProjects) {
      return;
    }

    if (!isLoggedIn) {
      router.replace("/");
      setProjects([]);
    }
  }, [
    isHydrated,
    isHydratedProjects,
    isLoggedIn,
    router,
    setProjects,
    pathname,
  ]);

  return null; // This component doesn't render anything
};

export default RouteProtector;
