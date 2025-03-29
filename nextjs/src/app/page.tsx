"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  // Redirect if logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

  // Function to handle the redirection to Cognito Hosted UI
  const redirectToCognito = () => {
    setLoading(true);

    const cognitoHostedUiUrl = `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/login?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_APP_DOMAIN}/callback&response_type=code&scope=email+openid+phone`;
    window.location.href = cognitoHostedUiUrl; // Redirect to Cognito Hosted UI
  };

  return (
    <div className="h-full flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center">Login / Sign Up</h2>

        {/* Redirect button to Hosted UI */}
        <button
          onClick={redirectToCognito}
          className="bg-sky-600 text-white py-2 rounded hover:bg-sky-700"
          disabled={loading}
        >
          {loading ? "Redirecting..." : "Login / Sign Up"}
        </button>
      </div>
    </div>
  );
}
