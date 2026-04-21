"use client";

interface NvrFindFigureBody {
  type: "nvr_find_figure";
  referenceItems: string[];
  optionSvgs: string[];
}

interface NvrFindFigureThreeBody {
  type: "nvr_find_figure_three";
  referenceItems: string[];
  optionSvgs: string[];
}

interface NvrCompleteSeriesBody {
  type: "nvr_complete_series";
  seriesItems: (string | null)[];
  missingIndex: number;
  optionSvgs: string[];
}

interface NvrOddOneOutBody {
  type: "nvr_odd_one_out";
  optionSvgs: string[];
}

interface NvrCompletePairBody {
  type: "nvr_complete_pair";
  pairA: string;
  pairB: string;
  pairC: string;
  optionSvgs: string[];
}

interface NvrCompleteGridBody {
  type: "nvr_complete_grid";
  gridItems: (string | null)[];
  gridSize: 2 | 3;
  missingIndex: number;
  optionSvgs: string[];
}

interface NvrVerticalCodeBody {
  type: "nvr_vertical_code";
  codeItems: Array<{ svg: string; code: string }>;
  questionSvg: string;
  optionCodes: string[];
}

type NvrBody =
  | NvrFindFigureBody
  | NvrFindFigureThreeBody
  | NvrCompleteSeriesBody
  | NvrOddOneOutBody
  | NvrCompletePairBody
  | NvrCompleteGridBody
  | NvrVerticalCodeBody;

interface NvrQuestionProps {
  bodyJson: NvrBody;
  selectedAnswer: number | null;
  onSelect: (index: number) => void;
  answered: boolean;
  correctAnswer?: number;
  isCorrect?: boolean;
}

function SvgFigure({ svg, className = "" }: { svg: string; className?: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function getOptionStyle(
  index: number,
  selected: boolean,
  answered: boolean,
  isCorrect?: boolean,
  correctAnswer?: number,
) {
  let borderColor = "border-gray-200 hover:border-indigo-400";
  let bg = "bg-white";

  if (selected && !answered) {
    borderColor = "border-indigo-500";
    bg = "bg-indigo-50";
  } else if (answered) {
    if (index === correctAnswer) {
      borderColor = "border-green-500";
      bg = "bg-green-50";
    } else if (selected && !isCorrect) {
      borderColor = "border-red-500";
      bg = "bg-red-50";
    }
  }

  return { borderColor, bg };
}

function OptionCard({
  svg,
  label,
  index,
  selected,
  answered,
  isCorrect,
  correctAnswer,
  onSelect,
}: {
  svg: string;
  label: string;
  index: number;
  selected: boolean;
  answered: boolean;
  isCorrect?: boolean;
  correctAnswer?: number;
  onSelect: (index: number) => void;
}) {
  const { borderColor, bg } = getOptionStyle(index, selected, answered, isCorrect, correctAnswer);

  return (
    <button
      onClick={() => !answered && onSelect(index)}
      disabled={answered}
      className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${borderColor} ${bg} ${!answered ? "cursor-pointer" : "cursor-default"}`}
    >
      <SvgFigure svg={svg} className="w-16 h-16 sm:w-20 sm:h-20" />
      <span className="mt-1 text-sm font-bold text-gray-600">{label}</span>
    </button>
  );
}

function OptionsRow({
  optionSvgs,
  labels,
  selectedAnswer,
  answered,
  isCorrect,
  correctAnswer,
  onSelect,
}: {
  optionSvgs: string[];
  labels: string[];
  selectedAnswer: number | null;
  answered: boolean;
  isCorrect?: boolean;
  correctAnswer?: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
      {optionSvgs.map((svg, i) => (
        <OptionCard
          key={i}
          svg={svg}
          label={labels[i]}
          index={i}
          selected={selectedAnswer === i}
          answered={answered}
          isCorrect={isCorrect}
          correctAnswer={correctAnswer}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default function NvrQuestion({
  bodyJson,
  selectedAnswer,
  onSelect,
  answered,
  correctAnswer,
  isCorrect,
}: NvrQuestionProps) {
  const labels = ["a", "b", "c", "d", "e"];

  const optionsProps = {
    labels,
    selectedAnswer,
    answered,
    isCorrect,
    correctAnswer,
    onSelect,
  };

  // ── Find the Figure (2 or 3 references) ──
  if (bodyJson.type === "nvr_find_figure" || bodyJson.type === "nvr_find_figure_three") {
    const body = bodyJson as NvrFindFigureBody | NvrFindFigureThreeBody;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 justify-center">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            {body.referenceItems.map((svg, i) => (
              <SvgFigure key={i} svg={svg} className="w-20 h-20 sm:w-24 sm:h-24" />
            ))}
          </div>
          <div className="text-2xl font-bold text-gray-400">|</div>
        </div>
        <OptionsRow optionSvgs={body.optionSvgs} {...optionsProps} />
      </div>
    );
  }

  // ── Complete the Series ──
  if (bodyJson.type === "nvr_complete_series") {
    const body = bodyJson as NvrCompleteSeriesBody;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-1 sm:gap-2 justify-center flex-wrap">
          {body.seriesItems.map((svg, i) => (
            <div
              key={i}
              className={`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 ${
                svg === null
                  ? "border-dashed border-indigo-400 bg-indigo-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              {svg === null ? (
                <span className="text-2xl font-bold text-indigo-400">?</span>
              ) : (
                <SvgFigure svg={svg} className="w-14 h-14 sm:w-18 sm:h-18" />
              )}
            </div>
          ))}
        </div>
        <OptionsRow optionSvgs={body.optionSvgs} {...optionsProps} />
      </div>
    );
  }

  // ── Odd One Out ──
  if (bodyJson.type === "nvr_odd_one_out") {
    const body = bodyJson as NvrOddOneOutBody;
    return (
      <div className="space-y-4">
        <OptionsRow optionSvgs={body.optionSvgs} {...optionsProps} />
      </div>
    );
  }

  // ── Complete the Pair (Analogy) ──
  if (bodyJson.type === "nvr_complete_pair") {
    const body = bodyJson as NvrCompletePairBody;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 sm:gap-3 justify-center flex-wrap">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <SvgFigure svg={body.pairA} className="w-16 h-16 sm:w-20 sm:h-20" />
            <span className="text-2xl font-bold text-gray-400">&rarr;</span>
            <SvgFigure svg={body.pairB} className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>
          <span className="text-2xl font-bold text-gray-400">:</span>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <SvgFigure svg={body.pairC} className="w-16 h-16 sm:w-20 sm:h-20" />
            <span className="text-2xl font-bold text-gray-400">&rarr;</span>
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed border-indigo-400 bg-indigo-50 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-400">?</span>
            </div>
          </div>
        </div>
        <OptionsRow optionSvgs={body.optionSvgs} {...optionsProps} />
      </div>
    );
  }

  // ── Complete the Grid ──
  if (bodyJson.type === "nvr_complete_grid") {
    const body = bodyJson as NvrCompleteGridBody;
    const cols = body.gridSize === 2 ? "grid-cols-2" : "grid-cols-3";
    const maxW = body.gridSize === 2 ? "max-w-[12rem] sm:max-w-[16rem]" : "max-w-[14rem] sm:max-w-[20rem]";
    return (
      <div className="space-y-4">
        <div className={`grid ${cols} gap-1 sm:gap-2 mx-auto ${maxW}`}>
          {body.gridItems.map((svg, i) => (
            <div
              key={i}
              className={`aspect-square flex items-center justify-center rounded-lg border-2 ${
                svg === null
                  ? "border-dashed border-indigo-400 bg-indigo-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              {svg === null ? (
                <span className="text-2xl font-bold text-indigo-400">?</span>
              ) : (
                <SvgFigure svg={svg} className="w-full h-full p-1" />
              )}
            </div>
          ))}
        </div>
        <OptionsRow optionSvgs={body.optionSvgs} {...optionsProps} />
      </div>
    );
  }

  // ── Vertical Code ──
  if (bodyJson.type === "nvr_vertical_code") {
    const body = bodyJson as NvrVerticalCodeBody;
    return (
      <div className="space-y-4">
        {/* Reference code table */}
        <div className="flex items-end gap-3 sm:gap-4 justify-center flex-wrap">
          {body.codeItems.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl border border-gray-200">
              <SvgFigure svg={item.svg} className="w-14 h-14 sm:w-18 sm:h-18" />
              <span className="text-sm font-bold text-gray-700 font-mono tracking-wider">{item.code}</span>
            </div>
          ))}
        </div>

        {/* Question figure */}
        <div className="flex items-center justify-center">
          <div className="p-3 bg-indigo-50 rounded-xl border-2 border-indigo-300">
            <SvgFigure svg={body.questionSvg} className="w-18 h-18 sm:w-22 sm:h-22" />
          </div>
        </div>

        {/* Code options (text-based) */}
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
          {body.optionCodes.map((code, i) => {
            const { borderColor, bg } = getOptionStyle(
              i, selectedAnswer === i, answered, isCorrect, correctAnswer
            );
            return (
              <button
                key={i}
                onClick={() => !answered && onSelect(i)}
                disabled={answered}
                className={`flex flex-col items-center px-4 py-2 rounded-xl border-2 transition-all ${borderColor} ${bg} ${!answered ? "cursor-pointer" : "cursor-default"}`}
              >
                <span className="font-mono text-lg font-bold tracking-wider">{code}</span>
                <span className="mt-1 text-sm font-bold text-gray-600">{labels[i]}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
