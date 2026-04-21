"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      let data: { error?: string } | null = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        setError(data?.error ?? `Unable to create account (HTTP ${res.status})`);
        return;
      }

      const signInResult = await signIn("parent-login", {
        email,
        password,
        redirect: false,
        callbackUrl: "/onboarding",
      });

      if (!signInResult || signInResult.error) {
        setError(
          "Your account was created, but automatic sign in failed. Please log in manually."
        );
        return;
      }

      router.push(signInResult.url ?? "/onboarding");
      router.refresh();
    } catch {
      setError("Something went wrong while creating your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create a parent account
          </h1>
          <p className="text-gray-500 mb-6">
            Set up your account to manage your child&apos;s 11+ preparation
          </p>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Min 8 chars, 1 uppercase, 1 number"
              />
              <p className="text-xs text-gray-400 mt-1">
                At least 8 characters with 1 uppercase letter and 1 number
              </p>
            </div>
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                required
                id="gdpr"
                className="mt-1 rounded border-gray-300"
              />
              <label htmlFor="gdpr" className="text-xs text-gray-500">
                I consent to the processing of my personal data and my child&apos;s
                data in accordance with the Privacy Policy and UK GDPR regulations.
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Parent Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-600 font-medium hover:text-indigo-700"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
