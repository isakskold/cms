"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import exchangeCode from "@/requests/user/exchangeCode";

export default function CallbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setTokenData } = useAuthStore();

  useEffect(() => {
    // Logout function
    const handleLogout = () => {
      console.log("Logging out user...");
      setTokenData(null);
      const cognitoLogoutUrl = `${
        process.env.NEXT_PUBLIC_COGNITO_DOMAIN
      }/logout?client_id=${
        process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID
      }&logout_uri=${encodeURIComponent("http://localhost:3000")}`;
      window.location.href = cognitoLogoutUrl;
    };

    // Ensure the code runs only in the client-side environment
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      console.log("Authorization code:", code);

      if (!code) {
        setError("Authorization code not found in the URL.");
        setLoading(false);
        return;
      }

      const fetchTokens = async () => {
        try {
          const data = await exchangeCode(code);
          setTokenData({ access_token: data.access_token });
          console.log("Refresh token cookie set, and access token returned");

          setLoading(false);
          router.push("/dashboard"); // Redirect to dashboard or desired page
        } catch (error: unknown) {
          console.error(error);
          setError("Failed to retrieve tokens.");
          setLoading(false);

          handleLogout();
        }
      };

      fetchTokens();
    }
  }, [router, setTokenData]);

  return (
    <div className="h-full flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center">Processing Login</h2>

        {loading && <p className="text-blue-500">Please wait...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
