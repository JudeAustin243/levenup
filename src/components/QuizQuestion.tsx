"use client";

interface QuizQuestionProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  options: string[];
  selectedAnswer: number | null;
  correctAnswer: number;
  showResult: boolean;
  explanation: string;
  onSelectAnswer: (index: number) => void;
}

export default function QuizQuestion({
  questionNumber,
  totalQuestions,
  questionText,
  options,
  selectedAnswer,
  correctAnswer,
  showResult,
  explanation,
  onSelectAnswer,
}: QuizQuestionProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-indigo-600">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="w-32 bg-gray-100 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{
                width: `${(questionNumber / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {questionText}
      </h2>

      <div className="space-y-3">
        {options.map((option, index) => {
          let styles = "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50";

          if (showResult) {
            if (index === correctAnswer) {
              styles = "border-green-500 bg-green-50 ring-2 ring-green-200";
            } else if (index === selectedAnswer && index !== correctAnswer) {
              styles = "border-red-500 bg-red-50 ring-2 ring-red-200";
            } else {
              styles = "border-gray-200 opacity-50";
            }
          } else if (selectedAnswer === index) {
            styles = "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200";
          }

          return (
            <button
              key={index}
              onClick={() => !showResult && onSelectAnswer(index)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${styles}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    showResult && index === correctAnswer
                      ? "bg-green-500 text-white"
                      : showResult &&
                        index === selectedAnswer &&
                        index !== correctAnswer
                      ? "bg-red-500 text-white"
                      : selectedAnswer === index
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-gray-800">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div
          className={`mt-6 p-4 rounded-xl ${
            selectedAnswer === correctAnswer
              ? "bg-green-50 border border-green-200"
              : "bg-amber-50 border border-amber-200"
          }`}
        >
          <p className="font-semibold mb-1">
            {selectedAnswer === correctAnswer
              ? "Correct!"
              : "Not quite right"}
          </p>
          <p className="text-sm text-gray-700">{explanation}</p>
        </div>
      )}
    </div>
  );
}
