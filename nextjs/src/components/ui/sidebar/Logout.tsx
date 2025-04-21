"use client";

import { LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import useSidebarStore from "@/stores/useSidebarStore";

const Logout = () => {
  const { setTokenData } = useAuthStore();
  const { setSidebar } = useSidebarStore();

  const handleLogout = async () => {
    // Clear the token data
    setTokenData(null);

    // Construct the Cognito logout URL
    const cognitoLogoutUrl = `${
      process.env.NEXT_PUBLIC_COGNITO_DOMAIN
    }/logout?client_id=${
      process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID
    }&logout_uri=${encodeURIComponent(
      process.env.NEXT_PUBLIC_APP_DOMAIN as string
    )}`;

    // Close the sidebar
    setSidebar(false);

    // Redirect to Cognito logout
    window.location.href = cognitoLogoutUrl;
  };

  return (
    <button
      onClick={handleLogout}
      className="group flex items-center gap-3 px-6 py-3 rounded-lg text-white/80 hover:text-white transition-all duration-300 relative overflow-hidden w-full"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg" />
      <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors duration-300 rounded-lg" />
      <LogOut className="w-6 h-6 relative z-10" />
      <span className="relative z-10 text-lg font-medium">Logout</span>
    </button>
  );
};

export default Logout;
