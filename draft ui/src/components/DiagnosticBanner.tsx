import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DiagnosticBanner() {
  return (
    <div className="rounded-xl border-2 border-primary/20 bg-success-light p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
          <Zap className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">VR Diagnostic Test</h3>
          <p className="text-sm text-muted-foreground">
            50 questions that adapt to your level · ~30 minutes
          </p>
          <p className="text-xs text-primary font-semibold mt-1">
            Ready for a challenge? Find out where you stand!
          </p>
        </div>
      </div>
      <Button size="lg" className="rounded-full px-7 font-bold text-base shrink-0">
        Start Diagnostic
      </Button>
    </div>
  );
}
