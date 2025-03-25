"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import useProjectStore from "@/stores/project/useProjectStore";

const RouteProtector: React.FC = () => {
  const { isLoggedIn, isHydrated } = useAuthStore();
  const { setProjects, isHydrated: isHydratedProjects } = useProjectStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && isHydratedProjects && !isLoggedIn) {
      router.replace("/");
      setProjects([]);
    }
  }, [isHydrated, isHydratedProjects, isLoggedIn, router, setProjects]);

  return null; // This component doesn't render anything
};

export default RouteProtector;
