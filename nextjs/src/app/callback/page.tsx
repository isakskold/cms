"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import exchangeCode from "@/requests/user/exchangeCode";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function CallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { setTokenData } = useAuthStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        setError("Authorization code not found in the URL.");
        return;
      }

      const fetchTokens = async () => {
        try {
          const data = await exchangeCode(code);
          setTokenData({ access_token: data.access_token });
          router.push("/dashboard");
        } catch (error: unknown) {
          setError(
            `Failed to retrieve tokens: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      };

      fetchTokens();
    }
  }, [router, setTokenData]);

  if (error) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80 flex flex-col gap-4 items-center">
          <div className="flex flex-col gap-2">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => {
                const cognitoLogoutUrl = `${
                  process.env.NEXT_PUBLIC_COGNITO_DOMAIN
                }/logout?client_id=${
                  process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID
                }&logout_uri=${encodeURIComponent(
                  process.env.NEXT_PUBLIC_APP_DOMAIN as string
                )}`;
                window.location.href = cognitoLogoutUrl;
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <LoadingSpinner fullScreen />;
}
