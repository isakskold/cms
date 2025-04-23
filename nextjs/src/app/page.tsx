"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    <div className="min-h-[clamp(400px,70vh,800px)] h-full w-full flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-xl relative">
      {/* Left Panel - Feature List */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-[clamp(16px,4vw,32px)] flex flex-col relative z-10 md:after:content-[''] md:after:absolute md:after:right-0 md:after:top-1/4 md:after:bottom-1/5 md:after:w-16 md:after:bg-gradient-to-l md:after:from-purple-500/90 md:after:to-transparent md:after:blur-2xl">
        <div>
          <h1 className="text-[clamp(20px,5vw,30px)] font-bold text-white mb-[clamp(12px,3vh,24px)]">
            Lightweight Headless CMS
          </h1>

          <ul className="space-y-[clamp(8px,2vh,16px)]">
            <li className="flex items-start text-white gap-2">
              <svg
                className="w-[clamp(16px,1.5vw,28px)] h-[clamp(16px,1.5vw,28px)] mt-0.5 flex-shrink-0"
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
              <span className="text-[clamp(14px,1.4vw,22px)]">
                Intuitive content management interface
              </span>
            </li>
            <li className="flex items-start text-white gap-2">
              <svg
                className="w-[clamp(16px,1.5vw,28px)] h-[clamp(16px,1.5vw,28px)] mt-0.5 flex-shrink-0"
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
              <span className="text-[clamp(14px,1.4vw,22px)]">
                Flexible content modeling and schemas
              </span>
            </li>
            <li className="flex items-start text-white gap-2">
              <svg
                className="w-[clamp(16px,1.5vw,28px)] h-[clamp(16px,1.5vw,28px)] mt-0.5 flex-shrink-0"
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
              <span className="text-[clamp(14px,1.4vw,22px)]">
                Built on AWS for reliable performance
              </span>
            </li>
            <li className="flex items-start text-white gap-2">
              <svg
                className="w-[clamp(16px,1.5vw,28px)] h-[clamp(16px,1.5vw,28px)] mt-0.5 flex-shrink-0"
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
              <span className="text-[clamp(14px,1.4vw,22px)]">
                Secure authentication with AWS Cognito
              </span>
            </li>
            <li className="flex items-start text-white gap-2">
              <svg
                className="w-[clamp(16px,1.5vw,28px)] h-[clamp(16px,1.5vw,28px)] mt-0.5 flex-shrink-0"
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
              <span className="text-[clamp(14px,1.4vw,22px)]">
                RESTful API with seamless custom integration
              </span>
            </li>
            <li className="flex items-start text-white gap-2">
              <svg
                className="w-[clamp(16px,1.5vw,28px)] h-[clamp(16px,1.5vw,28px)] mt-0.5 flex-shrink-0"
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
              <span className="text-[clamp(14px,1.4vw,22px)]">
                Boilerplate setup repo for quick deployment
              </span>
            </li>
          </ul>
        </div>

        {/* Service Icons Section */}
        <div className="mt-auto mb-6 md:text-left text-right">
          <p className="text-white text-sm mb-3">Powered by:</p>
          <div className="flex gap-4 items-center md:justify-start justify-end">
            <div className="relative group">
              <Image
                src="/svg/aws.svg"
                alt="AWS"
                width={64}
                height={64}
                className="h-[clamp(32px,4vw,64px)] w-auto hover:scale-110 transition-transform cursor-pointer"
              />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                AWS
              </span>
            </div>
            <div className="relative group">
              <Image
                src="/svg/amazoncognito.svg"
                alt="Cognito"
                width={64}
                height={64}
                className="h-[clamp(32px,4vw,64px)] w-auto hover:scale-110 transition-transform cursor-pointer"
              />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Cognito
              </span>
            </div>
            <div className="relative group">
              <Image
                src="/svg/amazondynamodb.svg"
                alt="DynamoDB"
                width={64}
                height={64}
                className="h-[clamp(32px,4vw,64px)] w-auto hover:scale-110 transition-transform cursor-pointer"
              />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                DynamoDB
              </span>
            </div>
            <div className="relative group">
              <Image
                src="/svg/nextjs.svg"
                alt="Next.js"
                width={64}
                height={64}
                className="h-[clamp(32px,4vw,64px)] w-auto hover:scale-110 transition-transform cursor-pointer"
              />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Next.js
              </span>
            </div>
            <div className="relative group">
              <Image
                src="/svg/vercel.svg"
                alt="Vercel"
                width={64}
                height={64}
                className="h-[clamp(32px,4vw,64px)] w-auto hover:scale-110 transition-transform cursor-pointer"
              />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Vercel
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={redirectToCognito}
          className="w-full bg-white text-blue-600 hover:bg-blue-50 py-[clamp(12px,2vh,16px)] px-6 rounded-xl font-semibold text-[clamp(14px,1.2vw,18px)] transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Redirecting...
            </>
          ) : (
            <>
              Get Started
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Right Panel - Detailed Info */}
      <div className="w-full md:w-1/2 p-[clamp(16px,4vw,32px)] bg-gradient-to-bl from-gray-100 via-gray-100 to-purple-600/80 relative z-0 md:before:content-[''] md:before:absolute md:before:left-0 md:before:top-2/3 md:before:bottom-0 md:before:w-8 md:before:bg-gradient-to-r md:before:from-purple-500/90 md:before:to-transparent md:before:blur-xl">
        <div className="h-full flex flex-col">
          <h2 className="text-[clamp(18px,4vw,28px)] font-bold text-gray-900 mb-[clamp(8px,2vh,16px)]">
            Your Portfolio Content, Managed Simply
          </h2>

          <p className="text-[clamp(12px,0.9vw,16px)] text-gray-600 mb-[clamp(12px,3vh,20px)]">
            A lightweight CMS for managing your portfolio data. Get started
            quickly with our optional boilerplate setup that includes pre-built
            components designed specifically for our API. This lets you showcase
            your portfolio immediately, and if you want to make changes, the
            simple structure makes it easy to modify. No complex setup or
            configuration needed.
          </p>

          <div className="space-y-[clamp(12px,2vh,20px)] flex-grow overflow-y-auto">
            <div className="bg-gray-50 p-[clamp(12px,2vw,20px)] rounded-xl">
              <h3 className="text-[clamp(14px,1.1vw,18px)] font-semibold text-gray-900 mb-[clamp(4px,1vh,8px)]">
                Easy Content Updates
              </h3>
              <p className="text-[clamp(11px,0.8vw,14px)] text-gray-600">
                Update your portfolio content without touching code. Add
                projects, skills, and experiences through a simple interface.
              </p>
            </div>

            <div className="bg-gray-50 p-[clamp(12px,2vw,20px)] rounded-xl">
              <h3 className="text-[clamp(14px,1.1vw,18px)] font-semibold text-gray-900 mb-[clamp(4px,1vh,8px)]">
                Quick Integration
              </h3>
              <p className="text-[clamp(11px,0.8vw,14px)] text-gray-600">
                Get started in minutes with our boilerplate. No complex setup or
                configuration needed - just clone and deploy.
              </p>
            </div>

            <div className="bg-gray-50 p-[clamp(12px,2vw,20px)] rounded-xl">
              <h3 className="text-[clamp(14px,1.1vw,18px)] font-semibold text-gray-900 mb-[clamp(4px,1vh,8px)]">
                Flexible Implementation
              </h3>
              <p className="text-[clamp(11px,0.8vw,14px)] text-gray-600">
                Choose how you want to use your data. Use our full boilerplate
                setup, integrate our pre-built components, or handle the data
                fetching yourself. The choice is yours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
