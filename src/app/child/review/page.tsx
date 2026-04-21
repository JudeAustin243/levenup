"use client";

import { useState, useEffect } from "react";

interface ReviewItem {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  flagged: boolean;
  lastAnswer: number | null;
  isCorrect: boolean;
  answeredAt: string;
  topicName: string;
  subjectName: string;
}

export default function ReviewPage() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFlagged() {
      setLoading(true);
      const res = await fetch("/api/review?type=flagged");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
      setLoading(false);
    }
    fetchFlagged();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Review</h1>
      <p className="text-gray-500 text-sm mb-6">
        Go back over flagged questions
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-3">{"\u2690"}</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            No Flagged Questions
          </h2>
          <p className="text-gray-500 text-sm">
            Flag questions during practice to review them later.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="w-full text-left px-5 py-4 flex items-start justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400">{item.subjectName}</span>
                      <span className="text-xs text-gray-300">&bull;</span>
                      <span className="text-xs text-gray-400">{item.topicName}</span>
                      {item.flagged && (
                        <span className="text-xs text-amber-600">{"\u2691"}</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {item.questionText}
                    </p>
                  </div>
                  <div
                    className={`ml-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      item.isCorrect
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.isCorrect ? "\u2713" : "\u2717"}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-4 border-t border-gray-100 pt-3">
                    <div className="space-y-2 mb-3">
                      {item.options.map((option, idx) => {
                        let style = "border-gray-200 text-gray-600";
                        if (idx === item.correctAnswer)
                          style = "border-green-500 bg-green-50 text-green-800";
                        else if (idx === item.lastAnswer && !item.isCorrect)
                          style = "border-red-300 bg-red-50 text-red-700";
                        return (
                          <div
                            key={idx}
                            className={`px-4 py-2 rounded-lg border text-sm ${style}`}
                          >
                            <span className="font-semibold mr-2">
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            {option}
                          </div>
                        );
                      })}
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-blue-700 mb-1">Explanation</p>
                      <p className="text-sm text-gray-700">{item.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
