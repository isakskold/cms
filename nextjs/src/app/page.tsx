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
    window.location.href = cognitoHostedUiUrl;
  };

  return (
    <div className="min-h-[clamp(400px,70vh,800px)] h-full w-full flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-xl">
      {/* Left Panel - Feature List */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 p-[clamp(16px,4vw,32px)] flex flex-col ">
        <div>
          <h1 className="text-[clamp(20px,5vw,30px)] font-bold text-white mb-[clamp(12px,3vh,24px)]">
            Lightweight Headless CMS
          </h1>

          <ul className="space-y-[clamp(8px,2vh,16px)]">
            <li className="flex items-start text-white gap-2">
              <svg
                className="w-[clamp(16px,1.2vw,20px)] h-[clamp(16px,1.2vw,20px)] mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-[clamp(12px,1vw,16px)]">
                Lightning-fast setup for portfolio websites
              </span>
            </li>
            <li className="flex items-start text-white gap-2">
              <svg
                className="w-[clamp(16px,1.2vw,20px)] h-[clamp(16px,1.2vw,20px)] mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-[clamp(12px,1vw,16px)]">
                Smart components that adapt to your data
              </span>
            </li>
            <li className="flex items-start text-white gap-2">
              <svg
                className="w-[clamp(16px,1.2vw,20px)] h-[clamp(16px,1.2vw,20px)] mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-[clamp(12px,1vw,16px)]">
                Zero-configuration Next.js integration
              </span>
            </li>
            <li className="flex items-start text-white gap-2">
              <svg
                className="w-[clamp(16px,1.2vw,20px)] h-[clamp(16px,1.2vw,20px)] mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-[clamp(12px,1vw,16px)]">
                Enterprise-grade security with AWS Cognito
              </span>
            </li>
            <li className="flex items-start text-white gap-2">
              <svg
                className="w-[clamp(16px,1.2vw,20px)] h-[clamp(16px,1.2vw,20px)] mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-[clamp(12px,1vw,16px)]">
                API-first architecture
              </span>
            </li>
          </ul>
        </div>

        <button
          onClick={redirectToCognito}
          className="mt-[clamp(16px,4vh,32px)] w-full bg-white text-blue-600 hover:bg-blue-50 py-[clamp(8px,1.5vh,12px)] px-4 rounded-xl font-medium text-[clamp(12px,1vw,16px)] transition-colors duration-200"
          disabled={loading}
        >
          {loading ? "Redirecting..." : "Start Building Your Portfolio"}
        </button>
      </div>

      {/* Right Panel - Detailed Info */}
      <div className="w-full md:w-1/2 p-[clamp(16px,4vw,32px)] bg-white">
        <div className="h-full flex flex-col">
          <h2 className="text-[clamp(18px,4vw,28px)] font-bold text-gray-900 mb-[clamp(8px,2vh,16px)]">
            Your Data, Your Structure, Our Components
          </h2>

          <p className="text-[clamp(12px,0.9vw,16px)] text-gray-600 mb-[clamp(12px,3vh,20px)]">
            Get your portfolio website up and running in minutes with our
            lightweight headless CMS. Our smart components automatically adapt
            to your data structure, making it easy to showcase your work exactly
            how you want it.
          </p>

          <div className="space-y-[clamp(12px,2vh,20px)] flex-grow overflow-y-auto">
            <div className="bg-gray-50 p-[clamp(12px,2vw,20px)] rounded-xl">
              <h3 className="text-[clamp(14px,1.1vw,18px)] font-semibold text-gray-900 mb-[clamp(4px,1vh,8px)]">
                Smart Components
              </h3>
              <p className="text-[clamp(11px,0.8vw,14px)] text-gray-600">
                Our Next.js components intelligently adapt to your data
                structure. No need to reconfigure components when your data
                changes - they just work.
              </p>
            </div>

            <div className="bg-gray-50 p-[clamp(12px,2vw,20px)] rounded-xl">
              <h3 className="text-[clamp(14px,1.1vw,18px)] font-semibold text-gray-900 mb-[clamp(4px,1vh,8px)]">
                Quick Setup
              </h3>
              <p className="text-[clamp(11px,0.8vw,14px)] text-gray-600">
                Get started in minutes with our simple setup process. Add your
                content, choose your components, and deploy your portfolio
                website.
              </p>
            </div>

            <div className="bg-gray-50 p-[clamp(12px,2vw,20px)] rounded-xl">
              <h3 className="text-[clamp(14px,1.1vw,18px)] font-semibold text-gray-900 mb-[clamp(4px,1vh,8px)]">
                Flexible Data Structure
              </h3>
              <p className="text-[clamp(11px,0.8vw,14px)] text-gray-600">
                Define your own data structure for your portfolio. Our
                components will automatically adapt to display your content
                perfectly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
