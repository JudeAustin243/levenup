import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Type,
  Puzzle,
  BookOpen,
  KeyRound,
  Lightbulb,
} from "lucide-react";
import type { TopicGroup } from "@/data/verbalReasoning";
import { getTopicGroupTotal } from "@/data/verbalReasoning";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Type,
  Puzzle,
  BookOpen,
  KeyRound,
  Lightbulb,
};

const colorMap: Record<string, string> = {
  "topic-blue": "bg-secondary text-topic-blue",
  "topic-purple": "bg-purple-50 text-topic-purple",
  "topic-teal": "bg-teal-50 text-topic-teal",
  "topic-orange": "bg-orange-50 text-topic-orange",
  "topic-amber": "bg-amber-50 text-topic-amber",
};

export default function TopicGroupSection({ groups }: { groups: TopicGroup[] }) {
  return (
    <Accordion type="multiple" className="space-y-3">
      {groups.map((group) => {
        const Icon = iconMap[group.icon] ?? Puzzle;
        const colors = colorMap[group.color] ?? "bg-secondary text-primary";
        const total = getTopicGroupTotal(group);

        return (
          <AccordionItem
            key={group.id}
            value={group.id}
            className="rounded-lg border border-border bg-card px-5 py-1 data-[state=open]:shadow-sm"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 text-left">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-base font-bold text-card-foreground">{group.name}</span>
                  <span className="ml-3 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                    {total} Qs
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pt-1">
              <div className="space-y-2">
                {group.subTopics.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary/20"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-card-foreground">{sub.name}</p>
                      <p className="text-sm text-muted-foreground">{sub.description}</p>
                    </div>
                    <div className="ml-4 flex shrink-0 items-center gap-2">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        {sub.questionCount} Qs
                      </span>
                      <Button size="sm" className="rounded-lg font-bold">
                        Practice
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
