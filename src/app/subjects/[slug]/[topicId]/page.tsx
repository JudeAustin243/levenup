"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import QuizQuestion from "@/components/QuizQuestion";
import ScoreCard from "@/components/ScoreCard";
import Timer from "@/components/Timer";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface TopicData {
  topicName: string;
  subjectName: string;
  subjectSlug: string;
  questions: Question[];
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();
  const [data, setData] = useState<TopicData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    async function loadQuiz() {
      const res = await fetch(
        `/api/quiz?slug=${params.slug}&topicId=${params.topicId}`
      );
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setAnswers(new Array(json.questions.length).fill(null));
      }
      setLoading(false);
    }

    if (status === "authenticated") {
      loadQuiz();
    }
  }, [params.slug, params.topicId, status, router]);

  const finishQuiz = useCallback(async () => {
    if (!data) return;

    let finalScore = 0;
    data.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) finalScore++;
    });

    setScore(finalScore);
    setQuizFinished(true);

    await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topicId: params.topicId,
        score: finalScore,
        totalQuestions: data.questions.length,
      }),
    });
  }, [data, answers, params.topicId]);

  function handleSelectAnswer(index: number) {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = index;
    setAnswers(newAnswers);
    setShowResult(true);
  }

  function handleNext() {
    if (!data) return;

    if (currentIndex < data.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowResult(false);
    } else {
      finishQuiz();
    }
  }

  function handleRetry() {
    if (!data) return;
    setCurrentIndex(0);
    setAnswers(new Array(data.questions.length).fill(null));
    setShowResult(false);
    setQuizFinished(false);
    setScore(0);
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!data || data.questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No questions available
        </h2>
        <p className="text-gray-500 mb-4">
          This topic doesn&apos;t have any questions yet.
        </p>
        <button
          onClick={() => router.push(`/subjects/${params.slug}`)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700"
        >
          Back to Topics
        </button>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          {data.topicName}
        </h1>
        <p className="text-center text-gray-500 mb-8">{data.subjectName}</p>
        <ScoreCard
          score={score}
          totalQuestions={data.questions.length}
          onRetry={handleRetry}
          onBack={() => router.push(`/subjects/${data.subjectSlug}`)}
        />
      </div>
    );
  }

  const question = data.questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {data.topicName}
          </h1>
          <p className="text-sm text-gray-500">{data.subjectName}</p>
        </div>
        <Timer isRunning={!quizFinished} />
      </div>

      <QuizQuestion
        questionNumber={currentIndex + 1}
        totalQuestions={data.questions.length}
        questionText={question.questionText}
        options={question.options}
        selectedAnswer={answers[currentIndex]}
        correctAnswer={question.correctAnswer}
        showResult={showResult}
        explanation={question.explanation}
        onSelectAnswer={handleSelectAnswer}
      />

      {showResult && (
        <div className="flex justify-end mt-6">
          <button
            onClick={handleNext}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            {currentIndex < data.questions.length - 1
              ? "Next Question"
              : "See Results"}
          </button>
        </div>
      )}
    </div>
  );
}
