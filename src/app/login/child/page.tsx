"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChildLoginPage() {
  const [step, setStep] = useState<"code" | "pin">("code");
  const [loginCode, setLoginCode] = useState("");
  const [childName, setChildName] = useState("");
  const [childAvatar, setChildAvatar] = useState("");
  const [childId, setChildId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch(`/api/auth/child-lookup?code=${encodeURIComponent(loginCode)}`);
    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError("We couldn't find that login code. Please check and try again.");
      return;
    }

    setChildId(data.childId);
    setChildName(data.name);
    setChildAvatar(data.avatar || "\ud83c\udf1f");
    setStep("pin");
  }

  async function handlePinDigit(digit: string) {
    const newPin = pin + digit;
    setPin(newPin);
    setError("");

    if (newPin.length === 4) {
      setLoading(true);
      const result = await signIn("child-login", {
        childId,
        pin: newPin,
        redirect: false,
      });

      setLoading(false);

      if (result?.error) {
        setPin("");
        setError("Wrong PIN. Please try again.");
      } else {
        router.push("/child/dashboard");
      }
    }
  }

  function handlePinBackspace() {
    setPin(pin.slice(0, -1));
    setError("");
  }

  if (step === "code") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <Link
              href="/login"
              className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1 mb-4"
            >
              &#8592; Back
            </Link>
            <div className="text-5xl mb-4">&#127891;</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Student Login
            </h1>
            <p className="text-gray-500 mb-6">
              Enter your login code (ask your parent if you don&apos;t know it)
            </p>

            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCodeSubmit}>
              <input
                type="text"
                value={loginCode}
                onChange={(e) => setLoginCode(e.target.value)}
                required
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-center text-xl font-mono tracking-wider"
                placeholder="Enter your code"
              />
              <button
                type="submit"
                disabled={loading || !loginCode}
                className="w-full mt-4 bg-amber-500 text-white py-3 rounded-xl font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 text-lg"
              >
                {loading ? "Looking you up..." : "Next"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <button
            onClick={() => { setStep("code"); setPin(""); setError(""); }}
            className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1 mb-4"
          >
            &#8592; Back
          </button>
          <div className="text-5xl mb-2">{childAvatar}</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Hello, {childName}!
          </h1>
          <p className="text-gray-500 mb-6">Enter your 4-digit PIN</p>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          {/* PIN dots */}
          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  i < pin.length
                    ? "bg-amber-500 border-amber-500"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Number pad */}
          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handlePinDigit(String(num))}
                disabled={pin.length >= 4 || loading}
                className="w-full aspect-square text-2xl font-bold bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
              >
                {num}
              </button>
            ))}
            <div />
            <button
              onClick={() => handlePinDigit("0")}
              disabled={pin.length >= 4 || loading}
              className="w-full aspect-square text-2xl font-bold bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              0
            </button>
            <button
              onClick={handlePinBackspace}
              disabled={pin.length === 0 || loading}
              className="w-full aspect-square text-xl bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              &#9003;
            </button>
          </div>

          {loading && (
            <p className="mt-4 text-gray-500 text-sm">Logging you in...</p>
          )}
        </div>
      </div>
    </div>
  );
}
