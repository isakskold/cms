"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import useSidebarStore from "@/stores/useSidebarStore";
import logout from "@/requests/user/logout";

const Logout: React.FC = () => {
  const { setTokenData, isLoggedIn } = useAuthStore();
  const { setSidebar } = useSidebarStore();

  useEffect(() => {
    console.log("Updated isLoggedIn:", isLoggedIn);
  }, [isLoggedIn]); // Runs every time isLoggedIn changes

  const handleLogout = async () => {
    console.log("Logging out user...");

    try {
      // Call the logout API request to invalidate the session
      await logout();

      // After the API call succeeds, clear the token data and redirect to Cognito logout
      setTokenData(null);

      const cognitoLogoutUrl = `${
        process.env.NEXT_PUBLIC_COGNITO_DOMAIN
      }/logout?client_id=${
        process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID
      }&logout_uri=${encodeURIComponent(
        process.env.NEXT_PUBLIC_APP_DOMAIN as string
      )}`;

      window.location.href = cognitoLogoutUrl;

      setSidebar(false); // Optionally close the sidebar
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle any errors during logout (e.g., show a message to the user)
    }
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
