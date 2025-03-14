"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import useSidebarStore from "@/stores/useSidebarStore";

const Logout: React.FC = () => {
  const { setTokenData, isLoggedIn } = useAuthStore();
  const { setSidebar } = useSidebarStore();

  useEffect(() => {
    console.log("Updated isLoggedIn:", isLoggedIn);
  }, [isLoggedIn]); // Runs every time isLoggedIn changes

  const handleLogout = () => {
    console.log("Logging out user...");
    setTokenData(null);
    const cognitoLogoutUrl = `${
      process.env.NEXT_PUBLIC_COGNITO_DOMAIN
    }/logout?client_id=${
      process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID
    }&logout_uri=${encodeURIComponent("http://localhost:3000")}`;
    window.location.href = cognitoLogoutUrl;
    setSidebar(false);
  };

  return (
    <button
      onClick={handleLogout}
      className=" transition-shadow duration-300 ease-in-out p-2 text-slate-100 tracking-widest text-lg font-bold bg-purple-950 rounded-lg shadow-lg hover:shadow-red-600"
    >
      Log-out
    </button>
  );
};

export default Logout;
