"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import NvrQuestion from "@/components/NvrQuestion";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  difficulty: number;
  correctAnswers?: number[]; // For multi-select questions (e.g., odd_one_out)
  questionType?: string; // Question type (e.g., odd_one_out, opposite_meaning)
  ageRange?: string; // Age range (e.g., "6-7", "8-9")
  bodyJson?: any; // For visual questions (NVR)
}

export default function PracticePage({ params }: { params: Promise<{ sessionId: string }> }) {
  const [sessionId, setSessionId] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]); // For multi-select questions
  const [orderedWords, setOrderedWords] = useState<string[]>([]); // For alphabetical_order questions
  const [typedAnswer, setTypedAnswer] = useState(""); // For typed questions (e.g., anagram)
  const [wordLadderAnswer1, setWordLadderAnswer1] = useState(""); // For word ladder first blank
  const [wordLadderAnswer2, setWordLadderAnswer2] = useState(""); // For word ladder second blank
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState<{
    isCorrect: boolean;
    correctAnswer: number;
    correctAnswers?: number[]; // For multi-select questions
    explanation: string;
  } | null>(null);
  const [flagged, setFlagged] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [phase, setPhase] = useState<"loading" | "quiz" | "results">("loading");
  const [timedMode, setTimedMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [topicName, setTopicName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    params.then((p) => {
      setSessionId(p.sessionId);
      // Fetch session data from localStorage (set by the start page)
      const stored = localStorage.getItem(`session_${p.sessionId}`);
      if (stored) {
        const data = JSON.parse(stored);
        setQuestions(data.questions);
        setTopicName(data.topicName);
        setSubjectName(data.subjectName);
        setTimedMode(data.timedMode || false);
        if (data.timeLimitSeconds) setTimeLeft(data.timeLimitSeconds);
        // Initialize orderedWords for alphabetical_order questions
        if (data.questions[0]?.questionType === "alphabetical_order") {
          setOrderedWords([...data.questions[0].options]);
        }
        setPhase("quiz");
      }
    });
  }, [params]);

  // Timer countdown per question
  useEffect(() => {
    if (!timedMode || phase !== "quiz" || answered || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // Time's up - auto-submit as blank
          handleTimeUp();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timedMode, phase, answered, timeLeft]);

  const handleTimeUp = useCallback(async () => {
    if (answered) return;
    setAnswered(true);
    const q = questions[currentIdx];
    const res = await fetch("/api/practice/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        questionId: q.id,
        selectedAnswer: -1,
        timeTakenMs: 0,
        flagged,
      }),
    });
    const data = await res.json();
    setResult(data);
    setScore((s) => ({ correct: s.correct, total: s.total + 1 }));
  }, [answered, currentIdx, questions, sessionId, flagged]);

  async function submitAnswer() {
    const q = questions[currentIdx];
    const isAlphabeticalOrder = q.questionType === "alphabetical_order";
    const isWordLadder = q.questionType === "word_ladder";
    const isWordSwap = q.questionType === "word_swap";
    const isTyped = q.options.length === 0 && !isWordLadder; // Typed but not word ladder
    const isMultiSelect = q.correctAnswers && q.correctAnswers.length > 1 && q.questionType !== "alphabet_series" && !isWordSwap;

    // Determine number of blanks for word ladder (based on age range)
    const numberOfBlanks = isWordLadder && (q.ageRange === "6-7" || q.ageRange === "7-8") ? 1 : 2;

    // Validation: check if answer is provided
    if (isAlphabeticalOrder) {
      if (orderedWords.length === 0 || answered) return;
    } else if (isWordLadder) {
      if (numberOfBlanks === 1) {
        if (wordLadderAnswer1.trim() === "" || answered) return;
      } else {
        if (wordLadderAnswer1.trim() === "" || wordLadderAnswer2.trim() === "" || answered) return;
      }
    } else if (isWordSwap) {
      if (selectedAnswers.length !== 2 || answered) return;
    } else if (isTyped) {
      if (typedAnswer.trim() === "" || answered) return;
    } else if (isMultiSelect) {
      if (selectedAnswers.length === 0 || answered) return;
    } else {
      if (selectedAnswer === null || answered) return;
    }

    setAnswered(true);

    const timeTakenMs = Date.now() - questionStart;

    // For alphabetical ordering, convert ordered words to indices
    let submittedAnswers = undefined;
    if (isAlphabeticalOrder) {
      submittedAnswers = orderedWords.map(word => q.options.indexOf(word));
    }

    // For word ladder, combine answers with comma
    let submittedTypedAnswer = undefined;
    if (isTyped) {
      submittedTypedAnswer = typedAnswer.trim().toLowerCase();
    } else if (isWordLadder) {
      submittedTypedAnswer = numberOfBlanks === 1
        ? wordLadderAnswer1.trim().toLowerCase()
        : `${wordLadderAnswer1.trim().toLowerCase()},${wordLadderAnswer2.trim().toLowerCase()}`;
    }

    const res = await fetch("/api/practice/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        questionId: q.id,
        selectedAnswer: isMultiSelect || isAlphabeticalOrder || isTyped || isWordLadder ? undefined : selectedAnswer,
        selectedAnswers: isAlphabeticalOrder ? submittedAnswers : (isMultiSelect ? selectedAnswers : undefined),
        typedAnswer: submittedTypedAnswer,
        timeTakenMs,
        flagged,
      }),
    });

    const data = await res.json();
    setResult(data);
    setScore((s) => ({
      correct: s.correct + (data.isCorrect ? 1 : 0),
      total: s.total + 1,
    }));
  }

  function nextQuestion() {
    if (currentIdx + 1 < questions.length) {
      const nextQuestion = questions[currentIdx + 1];
      setCurrentIdx(currentIdx + 1);
      setSelectedAnswer(null);
      setSelectedAnswers([]); // Reset multi-select answers
      setOrderedWords(nextQuestion.questionType === "alphabetical_order" ? [...nextQuestion.options] : []); // Initialize for ordering questions
      setTypedAnswer(""); // Reset typed answer
      setWordLadderAnswer1(""); // Reset word ladder answers
      setWordLadderAnswer2("");
      setAnswered(false);
      setResult(null);
      setFlagged(false);
      setQuestionStart(Date.now());
      if (timedMode) setTimeLeft(60); // Reset timer
    } else {
      completeSession();
    }
  }

  async function completeSession() {
    setIsCompleting(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const res = await fetch("/api/practice/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      setPhase("results");
    } catch (error) {
      console.error("Error completing session:", error);
      alert("Failed to complete session. Please try again.");
      setIsCompleting(false);
    }
  }

  if (phase === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Loading session...</p>
      </div>
    );
  }

  if (phase === "results") {
    const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="text-5xl mb-3">
            {pct >= 80 ? "\ud83c\udf1f" : pct >= 60 ? "\ud83d\udc4d" : "\ud83d\udcaa"}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Session Complete!</h1>
          <p className="text-gray-500 mb-4">{subjectName} &mdash; {topicName}</p>
          <div className={`text-5xl font-bold mb-2 ${pct >= 70 ? "text-green-600" : "text-amber-600"}`}>
            {pct}%
          </div>
          <p className="text-gray-500 mb-6">{score.correct} out of {score.total} correct</p>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/child/dashboard")}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.back()}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];
  if (!q) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs text-gray-500">
            {subjectName} &bull; {topicName}
          </span>
          <div className="text-sm text-gray-700 font-medium">
            Question {currentIdx + 1} of {questions.length}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFlagged(!flagged)}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
              flagged
                ? "bg-amber-50 border-amber-300 text-amber-700"
                : "border-gray-200 text-gray-400 hover:text-gray-600"
            }`}
          >
            {flagged ? "\u2691 Flagged" : "\u2690 Flag"}
          </button>
          {timedMode && !answered && (
            <span className={`font-mono text-sm font-bold ${timeLeft <= 10 ? "text-red-500" : "text-gray-600"}`}>
              {timeLeft}s
            </span>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
        <div
          className="bg-indigo-600 h-1.5 rounded-full transition-all"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
        <p className="text-lg font-medium text-gray-900 mb-5 whitespace-pre-line">
          {q.questionType === "word_ladder"
            ? q.questionText.split('\n\n')[0] // Only show instructions for word ladder
            : q.questionText}
        </p>
        {q.correctAnswers && q.correctAnswers.length > 1 && !answered && q.questionType !== "alphabetical_order" && q.questionType !== "word_swap" && (
          <p className="text-sm text-indigo-600 font-medium mb-4">
            {q.questionType === "opposite_meaning" || q.questionType === "similar_meaning" || q.questionType === "compound_words" || q.questionType === "sentence_completion_analogies" ? "Select one word from each column" : `Select ${q.correctAnswers.length} answers`}
          </p>
        )}
        {q.questionType === "alphabetical_order" && !answered && (
          <p className="text-sm text-indigo-600 font-medium mb-4">
            Drag the words to arrange them in alphabetical order
          </p>
        )}
        {q.options.length === 0 && !answered && q.questionType !== "word_ladder" && (
          <p className="text-sm text-indigo-600 font-medium mb-4">
            Type your answer below
          </p>
        )}
        {q.options.length === 0 ? (
          q.questionType === "word_ladder" ? (
            // Word ladder with inline input boxes
            (() => {
              const questionParts = q.questionText.split('\n\n');
              const wordLadderLine = questionParts[questionParts.length - 1] || '';
              const match = wordLadderLine.match(/^([A-Z]+)\s+\(\s*[_\s]+\)(?:\s+\(\s*[_\s]+\))?\s+([A-Z]+)$/);
              const numberOfBlanks = (q.ageRange === "6-7" || q.ageRange === "7-8") ? 1 : 2;

              if (match) {
                const startWord = match[1];
                const endWord = match[2];

                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <span className="text-2xl font-bold text-gray-800">{startWord}</span>
                      <input
                        type="text"
                        value={wordLadderAnswer1}
                        onChange={(e) => setWordLadderAnswer1(e.target.value)}
                        disabled={answered}
                        maxLength={10}
                        placeholder="____"
                        className="w-32 px-4 py-2 text-center rounded-lg border-2 border-indigo-300 transition-all focus:outline-none focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-lg font-medium"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && numberOfBlanks === 1 && wordLadderAnswer1.trim() !== "") {
                            submitAnswer();
                          }
                        }}
                      />
                      {numberOfBlanks === 2 && (
                        <input
                          type="text"
                          value={wordLadderAnswer2}
                          onChange={(e) => setWordLadderAnswer2(e.target.value)}
                          disabled={answered}
                          maxLength={10}
                          placeholder="____"
                          className="w-32 px-4 py-2 text-center rounded-lg border-2 border-indigo-300 transition-all focus:outline-none focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-lg font-medium"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && wordLadderAnswer1.trim() !== "" && wordLadderAnswer2.trim() !== "") {
                              submitAnswer();
                            }
                          }}
                        />
                      )}
                      <span className="text-2xl font-bold text-gray-800">{endWord}</span>
                    </div>
                    {answered && result && (
                      <div className="mt-3">
                        <p className={`text-sm font-medium ${result.isCorrect ? "text-green-700" : "text-red-700"}`}>
                          {result.isCorrect
                            ? `Correct! The answer is "${numberOfBlanks === 1 ? wordLadderAnswer1.trim().toLowerCase() : `${wordLadderAnswer1.trim().toLowerCase()}, ${wordLadderAnswer2.trim().toLowerCase()}`}"`
                            : `Your answer: "${numberOfBlanks === 1 ? wordLadderAnswer1.trim().toLowerCase() : `${wordLadderAnswer1.trim().toLowerCase()}, ${wordLadderAnswer2.trim().toLowerCase()}`}"`}
                        </p>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })()
          ) : (
            // Text input for other typed answers (anagram, etc.)
            <div>
              <input
                type="text"
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                disabled={answered}
                maxLength={15}
                placeholder="Type your answer here..."
                className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 transition-all focus:outline-none focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-lg"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && typedAnswer.trim() !== "") {
                    submitAnswer();
                  }
                }}
              />
              {answered && result && (
                <div className="mt-3">
                  <p className={`text-sm font-medium ${result.isCorrect ? "text-green-700" : "text-red-700"}`}>
                    {result.isCorrect ? `Correct! The answer is "${typedAnswer.trim().toLowerCase()}"` : `Your answer: "${typedAnswer.trim().toLowerCase()}"`}
                  </p>
                </div>
              )}
            </div>
          )
        ) : q.questionType === "alphabetical_order" ? (
          // Drag-and-drop ordering interface
          <div className="space-y-3">
            {orderedWords.map((word, idx) => {
              const originalIdx = q.options.indexOf(word);
              let style = "border-gray-200 bg-white cursor-move hover:border-gray-300";

              if (answered && result) {
                // Check if this word is in the correct position
                const correctOrder = result.correctAnswers as number[];
                const isCorrectPosition = correctOrder && correctOrder[idx] === originalIdx;

                if (isCorrectPosition) {
                  style = "border-green-500 bg-green-50";
                } else {
                  style = "border-red-500 bg-red-50";
                }
              }

              return (
                <div
                  key={`${word}-${idx}`}
                  draggable={!answered}
                  onDragStart={(e) => {
                    if (!answered) {
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", idx.toString());
                    }
                  }}
                  onDragOver={(e) => {
                    if (!answered) {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                    }
                  }}
                  onDrop={(e) => {
                    if (!answered) {
                      e.preventDefault();
                      const draggedIdx = parseInt(e.dataTransfer.getData("text/plain"));
                      if (draggedIdx !== idx) {
                        const newOrder = [...orderedWords];
                        const draggedItem = newOrder[draggedIdx];
                        newOrder.splice(draggedIdx, 1);
                        newOrder.splice(idx, 0, draggedItem);
                        setOrderedWords(newOrder);
                      }
                    }
                  }}
                  className={`w-full px-5 py-3.5 rounded-xl border-2 transition-all ${style} ${!answered ? "active:opacity-50" : "cursor-default"}`}
                >
                  <div className="flex items-center">
                    {!answered && (
                      <span className="mr-3 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        </svg>
                      </span>
                    )}
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-sm font-bold text-gray-600 mr-3">
                      {idx + 1}
                    </span>
                    <span className="font-medium">{word}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : q.questionType === "word_swap" ? (
          // Word swap: click on two words to swap
          <div>
            {!answered && (
              <p className="text-sm text-indigo-600 font-medium mb-4">
                Click on the two words that should be swapped
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {(q.options as string[]).map((word: string, idx: number) => {
                const isSelected = selectedAnswers.includes(idx);
                let style = "border-gray-200 hover:border-gray-300 bg-white";

                if (answered && result) {
                  if (result.correctAnswers && result.correctAnswers.includes(idx)) {
                    style = "border-green-500 bg-green-50";
                  } else if (isSelected && !result.isCorrect) {
                    style = "border-red-500 bg-red-50";
                  } else {
                    style = "border-gray-200 bg-white opacity-50";
                  }
                } else if (isSelected) {
                  style = "border-indigo-500 bg-indigo-50";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (answered) return;
                      setSelectedAnswers(prev => {
                        if (prev.includes(idx)) {
                          // Deselect
                          return prev.filter(i => i !== idx);
                        } else if (prev.length < 2) {
                          // Select (max 2)
                          return [...prev, idx];
                        } else {
                          // Already 2 selected, replace the first one
                          return [prev[1], idx];
                        }
                      });
                    }}
                    disabled={answered}
                    className={`px-4 py-2 rounded-lg border-2 transition-all font-medium ${style} ${!answered ? "cursor-pointer" : "cursor-default"}`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (q.questionType === "opposite_meaning" || q.questionType === "similar_meaning" || q.questionType === "compound_words" || q.questionType === "sentence_completion_analogies") && q.options.length === 6 ? (
          // 2-column layout for opposite_meaning questions
          <div className="grid grid-cols-2 gap-6">
            {/* Left column: first 3 options */}
            <div className="space-y-3">
              {(q.options as string[]).slice(0, 3).map((option: string, idx: number) => {
                const isMultiSelect = q.correctAnswers && q.correctAnswers.length > 1 && q.questionType !== "alphabet_series";
                const isSelected = isMultiSelect ? selectedAnswers.includes(idx) : selectedAnswer === idx;
                let style = "border-gray-200 hover:border-gray-300";

                if (answered && result) {
                  if (isMultiSelect && result.correctAnswers && result.correctAnswers.includes(idx)) {
                    style = "border-green-500 bg-green-50";
                  } else if (!isMultiSelect && idx === result.correctAnswer) {
                    style = "border-green-500 bg-green-50";
                  } else if (isSelected && !result.isCorrect) {
                    style = "border-red-500 bg-red-50";
                  } else {
                    style = "border-gray-200 opacity-50";
                  }
                } else if (isSelected) {
                  style = "border-indigo-500 bg-indigo-50";
                }

                const handleOptionClick = () => {
                  if (answered) return;
                  if (isMultiSelect) {
                    // For opposite_meaning, compound_words, and sentence_completion_analogies questions, enforce one selection per column
                    // This is the LEFT column (indices 0-2)
                    if (q.questionType === "opposite_meaning" || q.questionType === "similar_meaning" || q.questionType === "compound_words" || q.questionType === "sentence_completion_analogies") {
                      setSelectedAnswers(prev => {
                        // Remove all left column selections (0-2)
                        const withoutLeftColumn = prev.filter(i => i > 2);
                        // Toggle this index
                        if (prev.includes(idx)) {
                          return withoutLeftColumn; // Just remove it
                        } else {
                          return [...withoutLeftColumn, idx]; // Add it
                        }
                      });
                    } else {
                      // Default multi-select behavior
                      setSelectedAnswers(prev =>
                        prev.includes(idx)
                          ? prev.filter(i => i !== idx)
                          : [...prev, idx]
                      );
                    }
                  } else {
                    setSelectedAnswer(idx);
                  }
                };

                return (
                  <button
                    key={idx}
                    onClick={handleOptionClick}
                    disabled={answered}
                    className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all ${style}`}
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-sm font-bold text-gray-600 mr-3">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
            {/* Right column: last 3 options */}
            <div className="space-y-3">
              {(q.options as string[]).slice(3, 6).map((option: string, localIdx: number) => {
                const idx = localIdx + 3; // Actual index in the full options array
                const isMultiSelect = q.correctAnswers && q.correctAnswers.length > 1 && q.questionType !== "alphabet_series";
                const isSelected = isMultiSelect ? selectedAnswers.includes(idx) : selectedAnswer === idx;
                let style = "border-gray-200 hover:border-gray-300";

                if (answered && result) {
                  if (isMultiSelect && result.correctAnswers && result.correctAnswers.includes(idx)) {
                    style = "border-green-500 bg-green-50";
                  } else if (!isMultiSelect && idx === result.correctAnswer) {
                    style = "border-green-500 bg-green-50";
                  } else if (isSelected && !result.isCorrect) {
                    style = "border-red-500 bg-red-50";
                  } else {
                    style = "border-gray-200 opacity-50";
                  }
                } else if (isSelected) {
                  style = "border-indigo-500 bg-indigo-50";
                }

                const handleOptionClick = () => {
                  if (answered) return;
                  if (isMultiSelect) {
                    // For opposite_meaning, compound_words, and sentence_completion_analogies questions, enforce one selection per column
                    // This is the RIGHT column (indices 3-5)
                    if (q.questionType === "opposite_meaning" || q.questionType === "similar_meaning" || q.questionType === "compound_words" || q.questionType === "sentence_completion_analogies") {
                      setSelectedAnswers(prev => {
                        // Remove all right column selections (3-5)
                        const withoutRightColumn = prev.filter(i => i < 3);
                        // Toggle this index
                        if (prev.includes(idx)) {
                          return withoutRightColumn; // Just remove it
                        } else {
                          return [...withoutRightColumn, idx]; // Add it
                        }
                      });
                    } else {
                      // Default multi-select behavior
                      setSelectedAnswers(prev =>
                        prev.includes(idx)
                          ? prev.filter(i => i !== idx)
                          : [...prev, idx]
                      );
                    }
                  } else {
                    setSelectedAnswer(idx);
                  }
                };

                return (
                  <button
                    key={idx}
                    onClick={handleOptionClick}
                    disabled={answered}
                    className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all ${style}`}
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-sm font-bold text-gray-600 mr-3">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ) : q.questionType?.startsWith("nvr_") && q.bodyJson ? (
          // Visual NVR question rendering
          <NvrQuestion
            bodyJson={q.bodyJson}
            selectedAnswer={selectedAnswer}
            onSelect={(idx) => { if (!answered) setSelectedAnswer(idx); }}
            answered={answered}
            correctAnswer={result?.correctAnswer}
            isCorrect={result?.isCorrect}
          />
        ) : (
          // Default single-column layout for all other questions
          <div className="space-y-3">
            {(q.options as string[]).map((option: string, idx: number) => {
              const isMultiSelect = q.correctAnswers && q.correctAnswers.length > 1 && q.questionType !== "alphabet_series";
              const isSelected = isMultiSelect ? selectedAnswers.includes(idx) : selectedAnswer === idx;
              let style = "border-gray-200 hover:border-gray-300";

              if (answered && result) {
                // For multi-select, highlight all correct answers
                if (isMultiSelect && result.correctAnswers && result.correctAnswers.includes(idx)) {
                  style = "border-green-500 bg-green-50";
                } else if (!isMultiSelect && idx === result.correctAnswer) {
                  style = "border-green-500 bg-green-50";
                } else if (isSelected && !result.isCorrect) {
                  style = "border-red-500 bg-red-50";
                } else {
                  style = "border-gray-200 opacity-50";
                }
              } else if (isSelected) {
                style = "border-indigo-500 bg-indigo-50";
              }

              const handleOptionClick = () => {
                if (answered) return;

                // Force single-select for alphabet_series questions
                if (q.questionType === "alphabet_series") {
                  setSelectedAnswer(idx);
                  setSelectedAnswers([]); // Clear any multi-select state
                } else if (isMultiSelect) {
                  // Toggle selection for multi-select
                  setSelectedAnswers(prev =>
                    prev.includes(idx)
                      ? prev.filter(i => i !== idx)
                      : [...prev, idx]
                  );
                } else {
                  // Single selection
                  setSelectedAnswer(idx);
                }
              };

              return (
                <button
                  key={idx}
                  onClick={handleOptionClick}
                  disabled={answered}
                  className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all ${style}`}
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-sm font-bold text-gray-600 mr-3">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Explanation */}
      {answered && result && (
        <div className={`rounded-xl p-4 mb-4 ${result.isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <p className={`font-semibold text-sm mb-1 ${result.isCorrect ? "text-green-700" : "text-red-700"}`}>
            {result.isCorrect ? "Correct!" : "Not quite right"}
          </p>
          {!result.isCorrect && q.options.length === 0 && result.correctAnswers && (
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Correct answer: <span className="text-green-700">{result.correctAnswers}</span>
            </p>
          )}
          <p className="text-sm text-gray-700">{result.explanation}</p>
        </div>
      )}

      {/* Action button */}
      {!answered ? (
        <button
          onClick={submitAnswer}
          disabled={
            q.questionType === "alphabetical_order"
              ? orderedWords.length === 0
              : q.questionType === "word_ladder"
              ? (q.ageRange === "6-7" || q.ageRange === "7-8")
                ? wordLadderAnswer1.trim() === ""
                : wordLadderAnswer1.trim() === "" || wordLadderAnswer2.trim() === ""
              : q.questionType === "word_swap"
              ? selectedAnswers.length !== 2
              : q.options.length === 0
              ? typedAnswer.trim() === ""
              : q.correctAnswers && q.correctAnswers.length > 1 && q.questionType !== "alphabet_series"
              ? selectedAnswers.length !== q.correctAnswers.length
              : selectedAnswer === null
          }
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Submit Answer
        </button>
      ) : (
        <button
          onClick={nextQuestion}
          disabled={isCompleting}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCompleting ? "Completing..." : (currentIdx + 1 < questions.length ? "Next Question" : "Finish Session")}
        </button>
      )}
    </div>
  );
}
