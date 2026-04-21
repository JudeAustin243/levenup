"use client";

import Link from "next/link";
import { PricingModule } from "@/components/ui/pricing-module";
import { BookOpen, Trophy } from "lucide-react";

const plans = [
  {
    id: "standard",
    name: "Standard",
    description: "Full access to all 4 subjects with AI-powered study plans",
    icon: <BookOpen className="w-10 h-10 text-indigo-600" />,
    priceMonthly: 39.99,
    priceYearly: 383.88,
    users: "1 student account",
    features: [
      { label: "Maths, English, VR & NVR", included: true },
      { label: "AI-powered study plans", included: true },
      { label: "Hexagon skills profile", included: true },
      { label: "Adaptive difficulty", included: true },
      { label: "Parent dashboard & analytics", included: true },
      { label: "Timed practice mode", included: true },
      { label: "Unlimited mock tests", included: false },
      { label: "Detailed mock exam reports", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    description: "Everything in Standard plus unlimited mock exams",
    icon: <Trophy className="w-10 h-10 text-indigo-600" />,
    priceMonthly: 49.99,
    priceYearly: 479.88,
    users: "1 student account",
    features: [
      { label: "Maths, English, VR & NVR", included: true },
      { label: "AI-powered study plans", included: true },
      { label: "Hexagon skills profile", included: true },
      { label: "Adaptive difficulty", included: true },
      { label: "Parent dashboard & analytics", included: true },
      { label: "Timed practice mode", included: true },
      { label: "Unlimited mock tests", included: true },
      { label: "Detailed mock exam reports", included: true },
    ],
    recommended: true,
  },
];

export default function PricingPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">11+</span>
            </div>
            <span className="font-bold text-xl text-gray-900">LevenUp</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-5 py-2.5 rounded-full border border-gray-200"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-colors"
            >
              Sign Up For Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Pricing */}
      <div className="pt-24">
        <PricingModule
          title="Simple, transparent pricing"
          subtitle="Less than the cost of a single tutoring session — covering all four subjects."
          annualBillingLabel="Pay annually and save 20%"
          buttonLabel="Get Started"
          plans={plans}
          defaultAnnual={false}
        />
      </div>
    </div>
  );
}
