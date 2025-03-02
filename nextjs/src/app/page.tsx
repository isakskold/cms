"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSidebarStore from "@/stores/useSidebarStore";
import signUpUser from "@/requests/user/signUpUser";
import signInUser from "@/requests/user/signInUser";

export default function Home() {
  const router = useRouter();
  const { toggleSidebar } = useSidebarStore();

  // State to store the email, password, and form type
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent actual form submission
    setLoading(true); // Start loading
    setError(null); // Reset error state
    setSuccessMessage(null);

    try {
      if (isSignIn) {
        // Sign in logic
        await signInUser(email, password);
        router.push("/dashboard");
        toggleSidebar();
      } else {
        // Sign up logic
        await signUpUser(email, password);
        setSuccessMessage("Account created");
        setEmail("");
        setPassword("");
        setIsSignIn(true);
      }
    } catch (err: any) {
      console.log(err);

      setError(err.message || "An error occurred");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="h-full flex justify-center items-center">
      <form
        className="bg-white p-6 rounded-lg shadow-lg w-80 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center">
          {isSignIn ? "Login" : "Sign Up"}
        </h2>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded w-full"
          value={email} // Controlled input
          onChange={(e) => setEmail(e.target.value)} // Update email state
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded w-full"
          value={password} // Controlled input
          onChange={(e) => setPassword(e.target.value)} // Update password state
        />

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Success Message */}
        {successMessage && (
          <p className="text-green-500 text-sm">{successMessage}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-sky-600 text-white py-2 rounded hover:bg-sky-700"
          disabled={loading} // Disable button while loading
        >
          {loading
            ? isSignIn
              ? "Signing in..."
              : "Signing up..."
            : isSignIn
            ? "Login"
            : "Sign Up"}
        </button>

        {/* Toggle between Sign In and Sign Up */}
        <p
          className="text-sm text-center text-sky-600 cursor-pointer"
          onClick={() => setIsSignIn(!isSignIn)} // Toggle the form
        >
          {isSignIn
            ? "Don't have an account? Sign up"
            : "Already have an account? Log in"}
        </p>
      </form>
    </div>
  );
}
