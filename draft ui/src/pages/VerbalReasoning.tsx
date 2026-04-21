import { useNavigate } from "react-router-dom";
import { GraduationCap, Brain, ClipboardList, BookOpen, ChevronRight } from "lucide-react";
import { examBoards, generalPractice, getBoardTotalQuestions } from "@/data/verbalReasoning";
import type { ExamBoard } from "@/data/verbalReasoning";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  GraduationCap,
  Brain,
  ClipboardList,
  BookOpen,
};

function BoardCard({ board, path }: { board: ExamBoard; path: string }) {
  const navigate = useNavigate();
  const Icon = iconMap[board.icon] ?? BookOpen;
  const total = getBoardTotalQuestions(board);
  const topicCount = board.topicGroups.reduce((s, g) => s + g.subTopics.length, 0);

  return (
    <button
      onClick={() => navigate(path)}
      className="group flex flex-col items-start rounded-xl border border-border bg-card p-6 text-left transition-all hover:shadow-lg hover:border-primary/30 active:scale-[0.98]"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-bold text-card-foreground">{board.name}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{board.subtitle}</p>
      <div className="mt-3 flex items-center gap-3 text-xs font-semibold text-muted-foreground">
        <span>{total} questions</span>
        <span>·</span>
        <span>{topicCount} topics</span>
      </div>
      <span className="mt-4 flex items-center gap-1 text-sm font-bold text-primary group-hover:gap-2 transition-all">
        View topics <ChevronRight className="h-4 w-4" />
      </span>
    </button>
  );
}

export default function VerbalReasoning() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground">Verbal Reasoning</h1>
          <p className="mt-1 text-muted-foreground">
            Choose your exam board and topic to start practising ✏️
          </p>
        </div>

        <p className="mb-4 text-sm font-semibold text-muted-foreground">Exam Boards</p>

        <div className="grid gap-4 sm:grid-cols-3">
          {examBoards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              path={`/verbal-reasoning/${board.id}`}
            />
          ))}
        </div>

        <div className="mt-8">
          <p className="mb-4 text-sm font-semibold text-muted-foreground">Mixed Practice</p>
          <BoardCard
            board={generalPractice}
            path="/verbal-reasoning/general-practice"
          />
        </div>
      </div>
    </div>
  );
}
