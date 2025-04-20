"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export default function Login() {
  const router = useRouter();
  const { tokenData } = useAuthStore();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (tokenData) {
      router.push("/dashboard");
      return;
    }

    // Redirect to Cognito hosted UI
    const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_APP_DOMAIN + "/callback";

    const authUrl = `${cognitoDomain}/login?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email+openid+phone`;

    window.location.href = authUrl;
  }, [tokenData, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Redirecting to login...
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please wait while we redirect you to the login page.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  );
}
