import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { glAssessment, cemPractice, isebPractice, generalPractice } from "@/data/verbalReasoning";
import type { ExamBoard } from "@/data/verbalReasoning";
import DiagnosticBanner from "@/components/DiagnosticBanner";
import TopicGroupSection from "@/components/TopicGroupSection";

const boardMap: Record<string, ExamBoard> = {
  "gl-assessment": glAssessment,
  "cem-practice": cemPractice,
  "iseb-practice": isebPractice,
  "general-practice": generalPractice,
};

export default function ExamBoardPage() {
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();
  const board = boardMap[boardId ?? ""];

  if (!board) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Board not found.</p>
      </div>
    );
  }

  const showDiagnostic = board.id === "gl-assessment";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <button
          onClick={() => navigate("/verbal-reasoning")}
          className="mb-6 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Verbal Reasoning
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground">{board.name}</h1>
          <p className="mt-1 text-muted-foreground">{board.subtitle}</p>
        </div>

        {showDiagnostic && (
          <div className="mb-8">
            <DiagnosticBanner />
          </div>
        )}

        <p className="mb-4 text-sm font-semibold text-muted-foreground">
          Pick a topic to practise 👇
        </p>

        <TopicGroupSection groups={board.topicGroups} />
      </div>
    </div>
  );
}
