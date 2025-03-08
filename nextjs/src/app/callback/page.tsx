"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export default function CallbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setTokenData } = useAuthStore();

  useEffect(() => {
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
        const redirectUri = "http://localhost:3000/callback"; // Your redirect URI
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              code: code,
              redirect_uri: redirectUri,
              client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string,
            }),
          }
        );

        // If the response is not OK, log the body for more information
        if (!response.ok) {
          const errorBody = await response.json();
          console.error("Error response from Cognito:", errorBody);
          throw new Error(`Failed to exchange authorization code`);
        }

        const data = await response.json();
        // You should now have access token, id token, and refresh token (if applicable)
        console.log("Tokens:", data);

        // Handle storing the tokens in your app (e.g., in a context or local storage)
        // Example: save to localStorage, context, or a global store
        setTokenData(data);

        setLoading(false);
        router.push("/dashboard"); // Redirect to dashboard or desired page
      } catch (error: any) {
        console.error(error);
        setError("Failed to retrieve tokens.");
        setLoading(false);
      }
    };

    fetchTokens();
  }, [router]);

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
