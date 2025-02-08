"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-full flex justify-center items-center">
      <form
        className="bg-white p-6 rounded-lg shadow-lg w-80 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault(); // Prevent actual form submission
          router.push("/dashboard");
        }}
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded w-full"
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-sky-600 text-white py-2 rounded hover:bg-sky-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
