interface ScoreCardProps {
  score: number;
  totalQuestions: number;
  onRetry: () => void;
  onBack: () => void;
}

export default function ScoreCard({
  score,
  totalQuestions,
  onRetry,
  onBack,
}: ScoreCardProps) {
  const percentage = Math.round((score / totalQuestions) * 100);

  let message = "Keep practising!";
  let color = "text-red-600";
  let bg = "bg-red-50";

  if (percentage >= 80) {
    message = "Excellent work!";
    color = "text-green-600";
    bg = "bg-green-50";
  } else if (percentage >= 60) {
    message = "Good effort!";
    color = "text-blue-600";
    bg = "bg-blue-50";
  } else if (percentage >= 40) {
    message = "Getting there!";
    color = "text-amber-600";
    bg = "bg-amber-50";
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <div className={`${bg} rounded-2xl p-8 mb-6`}>
        <div className={`text-6xl font-bold ${color} mb-2`}>{percentage}%</div>
        <p className={`text-lg font-semibold ${color}`}>{message}</p>
        <p className="text-gray-500 mt-2">
          You scored {score} out of {totalQuestions}
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={onRetry}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={onBack}
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          Back to Topics
        </button>
      </div>
    </div>
  );
}
