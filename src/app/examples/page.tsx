"use client";

import Link from "next/link";

const sampleQuestions = [
  {
    subject: "Maths",
    question: "What is 3/4 of 48?",
    options: ["24", "30", "36", "42"],
    answer: "36",
  },
  {
    subject: "English",
    question: "Choose the correctly punctuated sentence.",
    options: [
      "The boys bag was heavy.",
      "The boy's bag was heavy.",
      "The boys' bag was heavy.",
      "The boys bag was heavy.",
    ],
    answer: "The boy's bag was heavy.",
  },
  {
    subject: "Verbal Reasoning",
    question: "Find the odd one out: BRICK, STONE, WOOD, GLASS",
    options: ["BRICK", "STONE", "WOOD", "GLASS"],
    answer: "WOOD",
  },
];

export default function ExamplesPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          Example 11+ Questions
        </h1>
        <p className="text-gray-600 text-lg mb-10">
          Here are a few sample questions to show how practice looks in LevenUp.
        </p>

        <div className="space-y-6">
          {sampleQuestions.map((item, index) => (
            <section
              key={item.question}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
            >
              <p className="text-sm font-semibold text-indigo-600 mb-2">
                {item.subject}
              </p>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {index + 1}. {item.question}
              </h2>
              <ul className="grid gap-3">
                {item.options.map((option) => (
                  <li
                    key={option}
                    className={`rounded-xl border px-4 py-3 text-gray-800 ${
                      option === item.answer
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700 transition-colors"
          >
            Start Free Trial
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
