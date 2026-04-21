"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const AVATARS = ["\ud83c\udf1f", "\ud83d\ude80", "\ud83e\udd84", "\ud83c\udf08", "\ud83c\udf3b", "\ud83d\udc1d", "\ud83e\udd81", "\ud83d\udc27", "\ud83e\udd89", "\ud83c\udf40", "\u26bd", "\ud83c\udfa8"];

const EXAM_BOARDS = [
  { value: "GL", label: "GL Assessment", desc: "Used by most grammar schools in England" },
  { value: "CEM", label: "CEM (Durham)", desc: "Used by many grammar schools, less predictable format" },
  { value: "ISEB", label: "ISEB", desc: "Used by independent schools" },
  { value: "", label: "Not sure yet", desc: "We\u2019ll prepare for a general 11+ format" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("10");
  const [avatar, setAvatar] = useState("\ud83c\udf1f");
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [examBoard, setExamBoard] = useState("");
  const [examDate, setExamDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginCode, setLoginCode] = useState("");
  const router = useRouter();

  function nextStep() {
    setError("");
    if (step === 1 && !childName.trim()) {
      setError("Please enter your child\u2019s name");
      return;
    }
    if (step === 2) {
      if (!/^\d{4}$/.test(pin)) {
        setError("PIN must be exactly 4 digits");
        return;
      }
      if (pin !== pinConfirm) {
        setError("PINs do not match");
        return;
      }
    }
    setStep(step + 1);
  }

  async function handleFinish() {
    setError("");
    setLoading(true);

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childName, childAge, pin, examBoard, examDate, avatar }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setLoginCode(data.loginCode);
    setStep(6);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Progress bar */}
          <div className="flex gap-1 mb-8">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-indigo-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Child info */}
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Let&apos;s set up your child&apos;s profile
              </h2>
              <p className="text-gray-500 mb-6 text-sm">Step 1 of 5</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Child&apos;s first name
                  </label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="e.g. Aisha"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <select
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  >
                    <option value="9">9 years old</option>
                    <option value="10">10 years old</option>
                    <option value="11">11 years old</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose an avatar
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {AVATARS.map((a) => (
                      <button
                        key={a}
                        onClick={() => setAvatar(a)}
                        className={`text-2xl p-2 rounded-xl border-2 transition-all ${
                          avatar === a
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 2: PIN */}
          {step === 2 && (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Set a login PIN for {childName}
              </h2>
              <p className="text-gray-500 mb-6 text-sm">
                Step 2 of 5 &mdash; Your child will use this 4-digit PIN to log in
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    4-digit PIN
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-center text-2xl tracking-[1em] font-mono"
                    placeholder="\u2022\u2022\u2022\u2022"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm PIN
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pinConfirm}
                    onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-center text-2xl tracking-[1em] font-mono"
                    placeholder="\u2022\u2022\u2022\u2022"
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 3: Exam board */}
          {step === 3 && (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Which exam board?
              </h2>
              <p className="text-gray-500 mb-6 text-sm">
                Step 3 of 5 &mdash; This helps us tailor the question style
              </p>
              <div className="space-y-3">
                {EXAM_BOARDS.map((board) => (
                  <button
                    key={board.value}
                    onClick={() => setExamBoard(board.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      examBoard === board.value
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900">{board.label}</div>
                    <div className="text-sm text-gray-500">{board.desc}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 4: Exam date */}
          {step === 4 && (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                When is the exam?
              </h2>
              <p className="text-gray-500 mb-6 text-sm">
                Step 4 of 5 &mdash; We&apos;ll create a countdown and adjust the study plan intensity
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam date
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                <p className="text-xs text-gray-400 mt-2">
                  You can skip this and set it later in Settings
                </p>
              </div>
            </>
          )}

          {/* Step 5: Confirm */}
          {step === 5 && (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                All set!
              </h2>
              <p className="text-gray-500 mb-6 text-sm">
                Step 5 of 5 &mdash; Please review the details below
              </p>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{avatar}</span>
                  <div>
                    <div className="font-bold text-gray-900">{childName}</div>
                    <div className="text-sm text-gray-500">Age {childAge}</div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-3 space-y-1">
                  <div className="text-sm">
                    <span className="text-gray-500">Exam board:</span>{" "}
                    <span className="font-medium">{examBoard || "Not set"}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Exam date:</span>{" "}
                    <span className="font-medium">
                      {examDate
                        ? new Date(examDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Not set"}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Login PIN:</span>{" "}
                    <span className="font-medium">****</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 6: Success */}
          {step === 6 && (
            <div className="text-center">
              <div className="text-5xl mb-4">{avatar}</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {childName}&apos;s profile is ready!
              </h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4 mb-6">
                <p className="text-sm text-amber-800 font-medium mb-1">
                  {childName}&apos;s login code:
                </p>
                <p className="font-mono text-lg font-bold text-amber-900 break-all">
                  {loginCode}
                </p>
                <p className="text-xs text-amber-700 mt-2">
                  Give this code to {childName} so they can log in with their PIN.
                </p>
              </div>
              <button
                onClick={() => router.push("/parent/dashboard")}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {/* Navigation buttons */}
          {step >= 1 && step <= 5 && (
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <button
                  onClick={() => { setStep(step - 1); setError(""); }}
                  className="flex-1 py-3 rounded-xl border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
              {step < 5 ? (
                <button
                  onClick={nextStep}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Creating profile..." : "Create Profile"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
