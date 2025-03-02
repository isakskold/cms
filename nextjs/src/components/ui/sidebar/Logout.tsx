"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import useSidebarStore from "@/stores/useSidebarStore";

const Logout: React.FC = () => {
  const { setEmail, isLoggedIn } = useAuthStore();
  const router = useRouter();
  const { setSidebar } = useSidebarStore();

  useEffect(() => {
    console.log("Updated isLoggedIn:", isLoggedIn);
  }, [isLoggedIn]); // Runs every time isLoggedIn changes

  const handleLogout = () => {
    console.log("Logging out user...");
    setEmail(null);
    router.push("/");
    setSidebar(false);
  };

  return (
    <button
      onClick={handleLogout}
      className="p-2 text-slate-100 tracking-widest text-lg font-bold bg-purple-950 rounded-lg shadow-lg shadow-red-600"
    >
      Log-out
    </button>
  );
};

export default Logout;
