import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.js");
const prisma = new PrismaClient({ adapter });

console.log("🌱 Seeding GL Non-Verbal Reasoning questions...\n");

// Delete existing NVR GL questions
for (const qt of ["nvr_find_figure", "nvr_find_figure_three", "nvr_complete_series", "nvr_odd_one_out", "nvr_complete_pair", "nvr_complete_grid", "nvr_vertical_code"]) {
  const existing = await prisma.question.findMany({
    where: { questionType: qt },
    select: { id: true },
  });
  const ids = existing.map((q: { id: string }) => q.id);
  if (ids.length > 0) {
    await prisma.answer.deleteMany({ where: { questionId: { in: ids } } });
    await prisma.question.deleteMany({ where: { id: { in: ids } } });
    console.log(`✅ Deleted ${ids.length} old ${qt} questions`);
  }
}

// ─── SVG Helpers ───

const VIEWBOX = 100;
const HALF = VIEWBOX / 2;

type Fill = "solid" | "outline" | "hatched" | "grey";
type ShapeType = "triangle" | "circle" | "square" | "diamond" | "pentagon" | "hexagon";

function hatchPattern(id: string): string {
  return `<defs><pattern id="${id}" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="black" stroke-width="1.5"/></pattern></defs>`;
}

function fillAttr(fill: Fill, hatchId: string): string {
  switch (fill) {
    case "solid": return 'fill="black"';
    case "outline": return 'fill="white" stroke="black" stroke-width="2"';
    case "hatched": return `fill="url(#${hatchId})" stroke="black" stroke-width="2"`;
    case "grey": return 'fill="#999" stroke="black" stroke-width="2"';
  }
}

function shapePoints(type: ShapeType, cx: number, cy: number, r: number): string {
  const pts: [number, number][] = [];
  let sides = 0;
  let startAngle = -Math.PI / 2;

  switch (type) {
    case "triangle": sides = 3; startAngle = -Math.PI / 2; break;
    case "square": sides = 4; startAngle = -Math.PI / 4; break;
    case "diamond": sides = 4; startAngle = -Math.PI / 2; break;
    case "pentagon": sides = 5; startAngle = -Math.PI / 2; break;
    case "hexagon": sides = 6; startAngle = 0; break;
    default: sides = 4; break;
  }

  for (let i = 0; i < sides; i++) {
    const angle = startAngle + (2 * Math.PI * i) / sides;
    pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

function drawShape(type: ShapeType, fill: Fill, cx: number, cy: number, r: number, rotation = 0, hatchId = "h"): string {
  const needsHatch = fill === "hatched";
  let svg = needsHatch ? hatchPattern(hatchId) : "";
  const f = fillAttr(fill, hatchId);
  const transform = rotation !== 0 ? ` transform="rotate(${rotation},${cx},${cy})"` : "";

  if (type === "circle") {
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" ${f}${transform}/>`;
  } else {
    const points = shapePoints(type, cx, cy, r);
    svg += `<polygon points="${points}" ${f}${transform}/>`;
  }
  return svg;
}

function drawDot(cx: number, cy: number, r = 4, fill = "black"): string {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
}

function drawLine(x1: number, y1: number, x2: number, y2: number): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="black" stroke-width="2"/>`;
}

function wrapSvg(inner: string, size = VIEWBOX): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${inner}</svg>`;
}

// ─── "Find the Figure Like the First Two" Questions ───

interface FindFigureQuestion {
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: number;
  bodyJson: {
    type: "nvr_find_figure";
    referenceItems: string[];
    optionSvgs: string[];
  };
}

function makeFindFigureQuestion(
  refs: string[],
  opts: string[],
  correctIdx: number,
  explanation: string,
  difficulty: number
): FindFigureQuestion {
  return {
    questionText: "Find the figure that is most like the two figures on the left.",
    options: ["a", "b", "c", "d", "e"],
    correctAnswer: correctIdx,
    explanation,
    difficulty,
    bodyJson: {
      type: "nvr_find_figure",
      referenceItems: refs,
      optionSvgs: opts,
    },
  };
}

// Q1: All figures must be triangles with a flat side at the bottom
const ff1 = makeFindFigureQuestion(
  [
    wrapSvg(drawShape("triangle", "hatched", 50, 55, 35, 0, "h1")),
    wrapSvg(drawShape("triangle", "solid", 50, 55, 30)),
  ],
  [
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 30)),          // a - pentagon
    wrapSvg(drawShape("triangle", "hatched", 50, 55, 25, 0, "h2")), // b - triangle (correct)
    wrapSvg(drawShape("circle", "solid", 50, 50, 30)),              // c - circle
    wrapSvg(drawShape("triangle", "outline", 50, 30, 30, 180)),     // d - inverted triangle
    wrapSvg(drawShape("square", "outline", 50, 50, 28)),            // e - square
  ],
  1,
  "All figures must be triangles with a flat side at the bottom. Only option B is a triangle with the flat side at the bottom.",
  1
);

// Q2: All figures contain exactly two dots
const ff2 = makeFindFigureQuestion(
  [
    wrapSvg(drawShape("square", "outline", 50, 50, 30) + drawDot(40, 50) + drawDot(60, 50)),
    wrapSvg(drawShape("circle", "outline", 50, 50, 30) + drawDot(40, 40) + drawDot(60, 60)),
  ],
  [
    wrapSvg(drawShape("triangle", "outline", 50, 55, 30) + drawDot(50, 55)),                           // a - 1 dot
    wrapSvg(drawShape("diamond", "outline", 50, 50, 30) + drawDot(40, 50) + drawDot(60, 50) + drawDot(50, 35)), // b - 3 dots
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 30) + drawDot(40, 50) + drawDot(60, 50)),          // c - 2 dots (correct)
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 30)),                                              // d - 0 dots
    wrapSvg(drawShape("circle", "outline", 50, 50, 30) + drawDot(50, 50) + drawDot(35, 50) + drawDot(65, 50) + drawDot(50, 35)), // e - 4 dots
  ],
  2,
  "All figures must have exactly two dots inside the shape. Only option C has exactly two dots.",
  1
);

// Q3: All figures must have a small black shape overlapping on the left side
const ff3 = makeFindFigureQuestion(
  [
    wrapSvg(drawShape("triangle", "outline", 55, 50, 32) + drawShape("circle", "solid", 25, 50, 10)),
    wrapSvg(drawShape("square", "outline", 55, 50, 28) + drawShape("square", "solid", 22, 50, 8)),
  ],
  [
    wrapSvg(drawShape("triangle", "hatched", 50, 55, 30, 0, "h3") + drawShape("diamond", "solid", 80, 50, 8)),   // a - black shape on right
    wrapSvg(drawShape("circle", "outline", 55, 50, 28) + drawShape("triangle", "solid", 50, 50, 10)),              // b - black shape in centre
    wrapSvg(drawShape("hexagon", "outline", 55, 50, 28)),                                                           // c - no black shape
    wrapSvg(drawShape("pentagon", "outline", 55, 50, 28) + drawShape("circle", "solid", 25, 50, 10)),              // d - black shape on left (correct)
    wrapSvg(drawShape("diamond", "outline", 55, 50, 28) + drawShape("triangle", "outline", 25, 50, 10)),           // e - outline shape on left
  ],
  3,
  "All figures must have a small black (filled) shape overlapping on the left side of the larger shape. Only option D matches this rule.",
  2
);

// Q4: All figures must be circles with a horizontal line through the middle
const ff4 = makeFindFigureQuestion(
  [
    wrapSvg(drawShape("circle", "outline", 50, 50, 30) + drawLine(20, 50, 80, 50)),
    wrapSvg(drawShape("circle", "grey", 50, 50, 25) + drawLine(25, 50, 75, 50)),
  ],
  [
    wrapSvg(drawShape("circle", "outline", 50, 50, 30) + drawLine(50, 20, 50, 80)),                  // a - vertical line
    wrapSvg(drawShape("square", "outline", 50, 50, 28) + drawLine(22, 50, 78, 50)),                   // b - square with horizontal line
    wrapSvg(drawShape("circle", "hatched", 50, 50, 28, 0, "h4") + drawLine(22, 50, 78, 50)),         // c - circle with horizontal line (correct)
    wrapSvg(drawShape("circle", "outline", 50, 50, 30)),                                               // d - circle without line
    wrapSvg(drawShape("circle", "outline", 50, 50, 30) + drawLine(25, 25, 75, 75)),                   // e - diagonal line
  ],
  2,
  "All figures must be circles with a horizontal line through the middle. Option C is a circle with a horizontal line.",
  2
);

// Q5: All figures have a large shape with a smaller version of itself inside
const ff5 = makeFindFigureQuestion(
  [
    wrapSvg(drawShape("square", "outline", 50, 50, 35) + drawShape("square", "outline", 50, 50, 15)),
    wrapSvg(drawShape("triangle", "outline", 50, 55, 35) + drawShape("triangle", "outline", 50, 58, 14)),
  ],
  [
    wrapSvg(drawShape("circle", "outline", 50, 50, 35) + drawShape("square", "outline", 50, 50, 14)),   // a - different inner shape
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 35) + drawShape("hexagon", "outline", 50, 50, 15)), // b - hexagon inside hexagon (correct)
    wrapSvg(drawShape("diamond", "outline", 50, 50, 35) + drawShape("circle", "solid", 50, 50, 8)),     // c - different inner shape
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 35)),                                                // d - no inner shape
    wrapSvg(drawShape("circle", "outline", 50, 50, 35) + drawShape("circle", "solid", 50, 50, 15)),     // e - inner is filled not outline
  ],
  1,
  "All figures have a large shape with a smaller outline version of the same shape inside it. Only option B (hexagon inside hexagon) matches.",
  2
);

// Q6: All figures must have exactly 4 sides and be filled solid
const ff6 = makeFindFigureQuestion(
  [
    wrapSvg(drawShape("square", "solid", 50, 50, 30)),
    wrapSvg(drawShape("diamond", "solid", 50, 50, 28)),
  ],
  [
    wrapSvg(drawShape("triangle", "solid", 50, 55, 30)),      // a - 3 sides
    wrapSvg(drawShape("hexagon", "solid", 50, 50, 30)),        // b - 6 sides
    wrapSvg(drawShape("square", "outline", 50, 50, 28)),       // c - outline not solid
    wrapSvg(drawShape("diamond", "solid", 50, 50, 25)),        // d - 4 sides, solid (correct but different size)
    wrapSvg(drawShape("pentagon", "solid", 50, 50, 28)),       // e - 5 sides
  ],
  3,
  "All figures must have exactly 4 sides and be filled solid black. Only option D is a 4-sided solid shape.",
  1
);

// Q7: All figures must have a dot directly next to the flat side of a shape
const ff7 = makeFindFigureQuestion(
  [
    wrapSvg(drawShape("square", "outline", 50, 45, 25) + drawDot(50, 75)),
    wrapSvg(drawShape("triangle", "outline", 50, 42, 28) + drawDot(50, 75)),
  ],
  [
    wrapSvg(drawShape("circle", "outline", 50, 45, 25) + drawDot(50, 20)),              // a - dot on top
    wrapSvg(drawShape("pentagon", "outline", 50, 42, 28) + drawDot(50, 75)),             // b - dot below (correct)
    wrapSvg(drawShape("hexagon", "outline", 50, 45, 25) + drawDot(80, 45)),              // c - dot on right
    wrapSvg(drawShape("diamond", "outline", 50, 45, 25) + drawDot(50, 75)),              // d - dot below diamond (no flat bottom)
    wrapSvg(drawShape("square", "outline", 50, 45, 25)),                                  // e - no dot
  ],
  1,
  "All figures must have a dot directly below the shape. Option B has a dot directly below the pentagon.",
  2
);

// Q8: All figures must contain exactly one diagonal line inside the shape
const ff8 = makeFindFigureQuestion(
  [
    wrapSvg(drawShape("square", "outline", 50, 50, 30) + drawLine(25, 25, 75, 75)),
    wrapSvg(drawShape("circle", "outline", 50, 50, 30) + drawLine(30, 30, 70, 70)),
  ],
  [
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 30) + drawLine(25, 25, 75, 75) + drawLine(75, 25, 25, 75)), // a - two diagonals
    wrapSvg(drawShape("triangle", "outline", 50, 55, 30) + drawLine(30, 35, 70, 75)),                             // b - one diagonal (correct)
    wrapSvg(drawShape("diamond", "outline", 50, 50, 30) + drawLine(20, 50, 80, 50)),                               // c - horizontal line
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 30)),                                                          // d - no line
    wrapSvg(drawShape("square", "outline", 50, 50, 30) + drawLine(50, 22, 50, 78)),                                // e - vertical line
  ],
  1,
  "All figures must contain exactly one diagonal line inside the shape. Only option B has a single diagonal line.",
  2
);

// Q9: All figures must be hatched/shaded
const ff9 = makeFindFigureQuestion(
  [
    wrapSvg(drawShape("circle", "hatched", 50, 50, 30, 0, "h9a")),
    wrapSvg(drawShape("square", "hatched", 50, 50, 28, 0, "h9b")),
  ],
  [
    wrapSvg(drawShape("triangle", "solid", 50, 55, 30)),                                    // a - solid
    wrapSvg(drawShape("diamond", "outline", 50, 50, 30)),                                    // b - outline
    wrapSvg(drawShape("pentagon", "grey", 50, 50, 28)),                                      // c - grey
    wrapSvg(drawShape("hexagon", "hatched", 50, 50, 28, 0, "h9c")),                         // d - hatched (correct)
    wrapSvg(drawShape("circle", "outline", 50, 50, 30) + drawShape("circle", "solid", 50, 50, 15)), // e - nested
  ],
  3,
  "All figures must have hatched (diagonal line) shading. Only option D has hatched shading.",
  1
);

// Q10: All figures have two shapes — one large outline and one small solid — with exactly 3-dot difference in sides
const ff10 = makeFindFigureQuestion(
  [
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 32) + drawShape("triangle", "solid", 50, 50, 14)),  // 6 - 3 = 3
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 32) + drawDot(35, 45) + drawDot(65, 45)),           // 5 sides + 2 dots
  ],
  [
    wrapSvg(drawShape("square", "outline", 50, 50, 30) + drawShape("circle", "solid", 50, 50, 12)),     // a - square + circle
    wrapSvg(drawShape("triangle", "outline", 50, 55, 32) + drawDot(50, 55)),                              // b - triangle + 1 dot
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 32) + drawDot(40, 45) + drawDot(60, 45) + drawDot(50, 60)), // c - 3 dots
    wrapSvg(drawShape("diamond", "outline", 50, 50, 32) + drawShape("triangle", "solid", 50, 50, 12)),   // d - diamond + triangle
    wrapSvg(drawShape("circle", "outline", 50, 50, 32) + drawShape("square", "solid", 50, 50, 12)),      // e - circle + square
  ],
  3,
  "All figures have a large outline shape with a small solid shape inside. In each, the outer shape has more sides. Option D (diamond with triangle inside) follows this pattern.",
  3
);

// Q11: All figures are symmetrical about a vertical axis and have a horizontal line
const ff11 = makeFindFigureQuestion(
  [
    wrapSvg(drawShape("diamond", "outline", 50, 50, 30) + drawLine(20, 50, 80, 50)),
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 30) + drawLine(18, 50, 82, 50)),
  ],
  [
    wrapSvg(drawShape("triangle", "outline", 50, 55, 30) + drawLine(22, 70, 78, 70)),                   // a - triangle, line not through middle
    wrapSvg(drawShape("circle", "outline", 50, 50, 30) + drawLine(20, 50, 80, 50)),                      // b - circle with horizontal line (correct)
    wrapSvg(drawShape("square", "outline", 50, 50, 28) + drawLine(50, 22, 50, 78)),                      // c - vertical line
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 28) + drawLine(25, 25, 75, 75)),                    // d - diagonal
    wrapSvg(drawShape("diamond", "outline", 50, 50, 30)),                                                  // e - no line
  ],
  1,
  "All figures are symmetrical shapes with a horizontal line through the middle. Option B is a circle with a horizontal line through the middle.",
  2
);

// Q12: All figures must be outlines with exactly three dots forming a triangle pattern
const ff12 = makeFindFigureQuestion(
  [
    wrapSvg(drawShape("square", "outline", 50, 50, 30) + drawDot(40, 40) + drawDot(60, 40) + drawDot(50, 60)),
    wrapSvg(drawShape("circle", "outline", 50, 50, 30) + drawDot(38, 38) + drawDot(62, 38) + drawDot(50, 62)),
  ],
  [
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 28) + drawDot(40, 40) + drawDot(60, 40)),                    // a - only 2 dots
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 28) + drawDot(50, 35) + drawDot(50, 50) + drawDot(50, 65)),   // b - dots in a line
    wrapSvg(drawShape("diamond", "outline", 50, 50, 28) + drawDot(38, 38) + drawDot(62, 38) + drawDot(50, 60)),   // c - triangle pattern (correct)
    wrapSvg(drawShape("triangle", "outline", 50, 55, 28) + drawDot(50, 50)),                                        // d - only 1 dot
    wrapSvg(drawShape("square", "outline", 50, 50, 28) + drawDot(35, 35) + drawDot(65, 35) + drawDot(35, 65) + drawDot(65, 65)), // e - 4 dots
  ],
  2,
  "All figures have three dots arranged in a triangle pattern inside an outline shape. Only option C has exactly three dots in a triangle pattern.",
  3
);

// Q13: All figures must have an arrow pointing upward
const ff13 = (() => {
  const arrowUp = `<polygon points="50,15 40,35 45,35 45,70 55,70 55,35 60,35" fill="black"/>`;
  const arrowDown = `<polygon points="50,85 40,65 45,65 45,30 55,30 55,65 60,65" fill="black"/>`;
  const arrowRight = `<polygon points="85,50 65,40 65,45 30,45 30,55 65,55 65,60" fill="black"/>`;
  const arrowLeft = `<polygon points="15,50 35,40 35,45 70,45 70,55 35,55 35,60" fill="black"/>`;

  return makeFindFigureQuestion(
    [
      wrapSvg(drawShape("square", "outline", 50, 50, 30) + arrowUp),
      wrapSvg(drawShape("circle", "outline", 50, 50, 30) + arrowUp),
    ],
    [
      wrapSvg(drawShape("triangle", "outline", 50, 55, 28) + arrowDown),    // a - arrow down
      wrapSvg(drawShape("hexagon", "outline", 50, 50, 28) + arrowRight),    // b - arrow right
      wrapSvg(drawShape("diamond", "outline", 50, 50, 28) + arrowLeft),     // c - arrow left
      wrapSvg(drawShape("pentagon", "outline", 50, 50, 28) + arrowUp),      // d - arrow up (correct)
      wrapSvg(drawShape("square", "outline", 50, 50, 28) + arrowDown),      // e - arrow down
    ],
    3,
    "All figures must contain an arrow pointing upward. Only option D has an upward-pointing arrow.",
    1
  );
})();

// Q14: All figures are split in half — left side solid, right side outline
const ff14 = (() => {
  const splitCircle = (r: number) =>
    `<path d="M50,${50-r} A${r},${r} 0 0,0 50,${50+r}" fill="black" stroke="black" stroke-width="2"/>` +
    `<path d="M50,${50-r} A${r},${r} 0 0,1 50,${50+r}" fill="white" stroke="black" stroke-width="2"/>`;
  const splitSquare = (s: number) =>
    `<rect x="${50-s}" y="${50-s}" width="${s}" height="${2*s}" fill="black" stroke="black" stroke-width="2"/>` +
    `<rect x="50" y="${50-s}" width="${s}" height="${2*s}" fill="white" stroke="black" stroke-width="2"/>`;

  return makeFindFigureQuestion(
    [wrapSvg(splitCircle(30)), wrapSvg(splitSquare(25))],
    [
      wrapSvg(drawShape("circle", "solid", 50, 50, 28)),      // a - all solid
      wrapSvg(drawShape("circle", "outline", 50, 50, 28)),     // b - all outline
      wrapSvg(splitCircle(25)),                                  // c - split (correct)
      wrapSvg(drawShape("square", "grey", 50, 50, 25)),        // d - grey
      wrapSvg(drawShape("diamond", "hatched", 50, 50, 25, 0, "h14")), // e - hatched
    ],
    2,
    "All figures are split in half — the left side is solid black and the right side is white (outline). Only option C follows this split pattern.",
    3
  );
})();

// Q15: All figures have two shapes side by side of different sizes (large + small)
const ff15 = makeFindFigureQuestion(
  [
    wrapSvg(drawShape("circle", "outline", 35, 50, 25) + drawShape("circle", "outline", 72, 50, 12)),
    wrapSvg(drawShape("square", "outline", 35, 50, 22) + drawShape("square", "outline", 72, 50, 10)),
  ],
  [
    wrapSvg(drawShape("triangle", "outline", 50, 50, 30)),                                                          // a - single shape
    wrapSvg(drawShape("diamond", "outline", 35, 50, 22) + drawShape("diamond", "outline", 72, 50, 22)),             // b - same size
    wrapSvg(drawShape("hexagon", "outline", 35, 50, 24) + drawShape("hexagon", "outline", 72, 50, 11)),             // c - large + small (correct)
    wrapSvg(drawShape("pentagon", "outline", 72, 50, 22) + drawShape("pentagon", "outline", 28, 50, 10)),           // d - small then large (reversed)
    wrapSvg(drawShape("circle", "solid", 35, 50, 22) + drawShape("square", "solid", 72, 50, 10)),                   // e - different shapes
  ],
  2,
  "All figures have two shapes of the same type side by side — a larger one on the left and a smaller one on the right. Only option C matches.",
  2
);

// Q16: All figures have a shape with exactly two lines crossing through it
const ff16 = makeFindFigureQuestion(
  [
    wrapSvg(drawShape("circle", "outline", 50, 50, 30) + drawLine(25, 25, 75, 75) + drawLine(75, 25, 25, 75)),
    wrapSvg(drawShape("square", "outline", 50, 50, 28) + drawLine(22, 50, 78, 50) + drawLine(50, 22, 50, 78)),
  ],
  [
    wrapSvg(drawShape("diamond", "outline", 50, 50, 28) + drawLine(25, 50, 75, 50)),                               // a - one line
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 28) + drawLine(25, 30, 75, 70) + drawLine(75, 30, 25, 70)),   // b - two crossing lines (correct)
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 28)),                                                            // c - no lines
    wrapSvg(drawShape("triangle", "outline", 50, 55, 28) + drawLine(50, 28, 50, 78) + drawLine(25, 75, 75, 75) + drawLine(25, 75, 50, 28)), // d - three lines
    wrapSvg(drawShape("circle", "outline", 50, 50, 28) + drawLine(50, 22, 50, 78)),                                 // e - one line
  ],
  1,
  "All figures have a shape with exactly two lines crossing through it. Only option B has exactly two crossing lines.",
  3
);

// Q17: All figures are grey-filled shapes
const ff17 = makeFindFigureQuestion(
  [
    wrapSvg(drawShape("circle", "grey", 50, 50, 30)),
    wrapSvg(drawShape("square", "grey", 50, 50, 28)),
  ],
  [
    wrapSvg(drawShape("triangle", "solid", 50, 55, 30)),                    // a - solid
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 28)),                   // b - outline
    wrapSvg(drawShape("diamond", "hatched", 50, 50, 28, 0, "h17")),        // c - hatched
    wrapSvg(drawShape("hexagon", "grey", 50, 50, 28)),                      // d - grey (correct)
    wrapSvg(drawShape("circle", "solid", 50, 50, 28) + drawDot(50, 50, 10, "white")), // e - solid with white dot
  ],
  3,
  "All figures must be filled with grey. Only option D has grey fill.",
  1
);

// Q18: Each figure has a shape with the number of dots equal to the number of sides
const ff18 = makeFindFigureQuestion(
  [
    wrapSvg(drawShape("triangle", "outline", 50, 55, 30) + drawDot(40, 55) + drawDot(60, 55) + drawDot(50, 40)),  // 3 sides, 3 dots
    wrapSvg(drawShape("square", "outline", 50, 50, 25) + drawDot(38, 38) + drawDot(62, 38) + drawDot(38, 62) + drawDot(62, 62)), // 4 sides, 4 dots
  ],
  [
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 28) + drawDot(35, 40) + drawDot(65, 40) + drawDot(50, 55) + drawDot(40, 65) + drawDot(60, 65)), // a - 5 sides, 5 dots (correct)
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 28) + drawDot(50, 50)),   // b - 6 sides, 1 dot
    wrapSvg(drawShape("diamond", "outline", 50, 50, 28) + drawDot(40, 50) + drawDot(60, 50)), // c - 4 sides, 2 dots
    wrapSvg(drawShape("triangle", "outline", 50, 55, 28) + drawDot(50, 55)),  // d - 3 sides, 1 dot
    wrapSvg(drawShape("circle", "outline", 50, 50, 28) + drawDot(45, 45) + drawDot(55, 55) + drawDot(50, 40)), // e - circle, 3 dots
  ],
  0,
  "The number of dots inside each shape equals the number of sides of that shape. Triangle has 3 dots, square has 4 dots. Option A (pentagon) has 5 dots for 5 sides.",
  3
);

// Q19: All figures have a shape rotated 45 degrees from its normal orientation
const ff19 = makeFindFigureQuestion(
  [
    wrapSvg(drawShape("square", "outline", 50, 50, 28, 45)),       // rotated square = diamond orientation
    wrapSvg(drawShape("triangle", "outline", 50, 55, 28, 45)),     // rotated triangle
  ],
  [
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 28)),           // a - not rotated
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 28, 45)),      // b - rotated (correct)
    wrapSvg(drawShape("circle", "outline", 50, 50, 28)),             // c - circle (rotation doesn't show)
    wrapSvg(drawShape("square", "outline", 50, 50, 28)),             // d - not rotated
    wrapSvg(drawShape("diamond", "outline", 50, 50, 28)),            // e - not rotated (diamond is its natural form)
  ],
  1,
  "All figures are shapes rotated 45 degrees from their standard orientation. Only option B shows a pentagon rotated 45 degrees.",
  3
);

// Q20: All figures have a large outline shape with a small solid dot in the top-right corner
const ff20 = makeFindFigureQuestion(
  [
    wrapSvg(drawShape("square", "outline", 50, 50, 28) + drawDot(72, 28)),
    wrapSvg(drawShape("circle", "outline", 50, 50, 28) + drawDot(72, 28)),
  ],
  [
    wrapSvg(drawShape("triangle", "outline", 50, 55, 28) + drawDot(28, 28)),   // a - dot top-left
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 28) + drawDot(50, 50)),    // b - dot centre
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 28) + drawDot(72, 72)),    // c - dot bottom-right
    wrapSvg(drawShape("diamond", "outline", 50, 50, 28) + drawDot(72, 28)),    // d - dot top-right (correct)
    wrapSvg(drawShape("square", "outline", 50, 50, 28) + drawDot(28, 72)),     // e - dot bottom-left
  ],
  3,
  "All figures have a dot in the top-right corner. Only option D has a dot in the top-right corner.",
  2
);


const findFigureQuestions: FindFigureQuestion[] = [
  ff1, ff2, ff3, ff4, ff5, ff6, ff7, ff8, ff9, ff10,
  ff11, ff12, ff13, ff14, ff15, ff16, ff17, ff18, ff19, ff20,
];

// ─── "Complete the Series" Questions ───

interface SeriesQuestion {
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: number;
  bodyJson: {
    type: "nvr_complete_series";
    seriesItems: (string | null)[];
    missingIndex: number;
    optionSvgs: string[];
  };
}

function makeSeriesQuestion(
  series: (string | null)[],
  missingIndex: number,
  opts: string[],
  correctIdx: number,
  explanation: string,
  difficulty: number
): SeriesQuestion {
  return {
    questionText: "Find the figure that completes the series.",
    options: ["a", "b", "c", "d", "e"],
    correctAnswer: correctIdx,
    explanation,
    difficulty,
    bodyJson: {
      type: "nvr_complete_series",
      seriesItems: series,
      missingIndex,
      optionSvgs: opts,
    },
  };
}

// CS1: Shape rotates 90 degrees clockwise each step
const cs1 = (() => {
  const shapes = [0, 90, 180, 270, 360].map(deg =>
    wrapSvg(drawShape("triangle", "solid", 50, 50, 28, deg))
  );
  const missing = 2; // 180 degrees is missing
  const series = [...shapes];
  series[missing] = null;

  return makeSeriesQuestion(
    series, missing,
    [
      wrapSvg(drawShape("triangle", "solid", 50, 50, 28, 45)),    // a - wrong rotation
      wrapSvg(drawShape("triangle", "solid", 50, 50, 28, 180)),   // b - correct (180)
      wrapSvg(drawShape("triangle", "solid", 50, 50, 28, 270)),   // c - too far
      wrapSvg(drawShape("triangle", "outline", 50, 50, 28, 180)), // d - wrong fill
      wrapSvg(drawShape("triangle", "solid", 50, 50, 28, 135)),   // e - wrong rotation
    ],
    1,
    "The triangle rotates 90 degrees clockwise in each step. The missing figure should be the triangle at 180 degrees.",
    1
  );
})();

// CS2: Fill alternates between solid and outline
const cs2 = (() => {
  const fills: Fill[] = ["solid", "outline", "solid", "outline", "solid"];
  const shapes = fills.map(f => wrapSvg(drawShape("circle", f, 50, 50, 28)));
  const missing = 3;
  const series = [...shapes];
  series[missing] = null;

  return makeSeriesQuestion(
    series, missing,
    [
      wrapSvg(drawShape("circle", "solid", 50, 50, 28)),       // a - solid (wrong)
      wrapSvg(drawShape("circle", "hatched", 50, 50, 28, 0, "hcs2")), // b - hatched (wrong)
      wrapSvg(drawShape("square", "outline", 50, 50, 28)),     // c - wrong shape
      wrapSvg(drawShape("circle", "outline", 50, 50, 28)),     // d - outline (correct)
      wrapSvg(drawShape("circle", "grey", 50, 50, 28)),        // e - grey (wrong)
    ],
    3,
    "The fill alternates between solid and outline in each step. The pattern is solid, outline, solid, ?, solid — so the missing figure is an outline circle.",
    1
  );
})();

// CS3: Shape gets one more side each step (triangle → square → pentagon → hexagon → ...)
const cs3 = (() => {
  const types: ShapeType[] = ["triangle", "square", "pentagon", "hexagon"];
  const shapes = types.map(t => wrapSvg(drawShape(t, "outline", 50, 50, 28)));
  // Add a 7-sided shape approximation (circle-like)
  shapes.push(wrapSvg(`<polygon points="${Array.from({length: 7}, (_, i) => {
    const angle = -Math.PI/2 + (2*Math.PI*i)/7;
    return `${(50 + 28*Math.cos(angle)).toFixed(1)},${(50 + 28*Math.sin(angle)).toFixed(1)}`;
  }).join(" ")}" fill="white" stroke="black" stroke-width="2"/>`));

  const missing = 2; // pentagon
  const series = [...shapes];
  series[missing] = null;

  return makeSeriesQuestion(
    series, missing,
    [
      wrapSvg(drawShape("diamond", "outline", 50, 50, 28)),    // a - 4 sides (duplicate)
      wrapSvg(drawShape("hexagon", "outline", 50, 50, 28)),    // b - 6 sides (too many)
      wrapSvg(drawShape("triangle", "outline", 50, 50, 28)),   // c - 3 sides (too few)
      wrapSvg(drawShape("pentagon", "outline", 50, 50, 28)),   // d - 5 sides (correct)
      wrapSvg(drawShape("circle", "outline", 50, 50, 28)),     // e - circle
    ],
    3,
    "Each shape gains one more side: triangle (3) → square (4) → ? → hexagon (6) → heptagon (7). The missing figure has 5 sides — a pentagon.",
    1
  );
})();

// CS4: Dot moves clockwise around corners of a square, shape stays the same
const cs4 = (() => {
  const dotPositions: [number, number][] = [[72, 28], [72, 72], [28, 72], [28, 28], [72, 28]];
  const shapes = dotPositions.map(([dx, dy]) =>
    wrapSvg(drawShape("square", "outline", 50, 50, 25) + drawDot(dx, dy))
  );
  const missing = 2; // dot at bottom-left
  const series = [...shapes];
  series[missing] = null;

  return makeSeriesQuestion(
    series, missing,
    [
      wrapSvg(drawShape("square", "outline", 50, 50, 25) + drawDot(50, 50)),  // a - centre
      wrapSvg(drawShape("square", "outline", 50, 50, 25) + drawDot(28, 28)),  // b - top-left
      wrapSvg(drawShape("square", "outline", 50, 50, 25) + drawDot(72, 28)),  // c - top-right
      wrapSvg(drawShape("square", "outline", 50, 50, 25) + drawDot(28, 72)),  // d - bottom-left (correct)
      wrapSvg(drawShape("square", "outline", 50, 50, 25) + drawDot(72, 72)),  // e - bottom-right
    ],
    3,
    "The dot moves clockwise around the corners of the square: top-right → bottom-right → ? → top-left → top-right. The missing position is bottom-left.",
    2
  );
})();

// CS5: Shape grows larger in each step
const cs5 = (() => {
  const sizes = [12, 18, 24, 30, 36];
  const shapes = sizes.map(r => wrapSvg(drawShape("circle", "solid", 50, 50, r)));
  const missing = 3;
  const series = [...shapes];
  series[missing] = null;

  return makeSeriesQuestion(
    series, missing,
    [
      wrapSvg(drawShape("circle", "solid", 50, 50, 22)),    // a - too small
      wrapSvg(drawShape("circle", "solid", 50, 50, 36)),    // b - too big
      wrapSvg(drawShape("circle", "solid", 50, 50, 30)),    // c - correct
      wrapSvg(drawShape("circle", "outline", 50, 50, 30)),  // d - wrong fill
      wrapSvg(drawShape("circle", "solid", 50, 50, 15)),    // e - too small
    ],
    2,
    "The circle gets larger in each step. The sizes increase uniformly, so the missing circle should be the fourth size.",
    1
  );
})();

// CS6: Number of dots increases by one each step
const cs6 = (() => {
  const dotsPositions: [number, number][][] = [
    [[50, 50]],
    [[40, 50], [60, 50]],
    [[40, 40], [60, 40], [50, 60]],
    [[35, 35], [65, 35], [35, 65], [65, 65]],
    [[35, 35], [65, 35], [50, 50], [35, 65], [65, 65]],
  ];
  const shapes = dotsPositions.map(dots =>
    wrapSvg(drawShape("square", "outline", 50, 50, 32) + dots.map(([x, y]) => drawDot(x, y)).join(""))
  );
  const missing = 3; // 4 dots
  const series = [...shapes];
  series[missing] = null;

  return makeSeriesQuestion(
    series, missing,
    [
      wrapSvg(drawShape("square", "outline", 50, 50, 32) + drawDot(40, 40) + drawDot(60, 40) + drawDot(50, 60)), // a - 3 dots
      wrapSvg(drawShape("square", "outline", 50, 50, 32) + drawDot(35, 35) + drawDot(65, 35) + drawDot(50, 50) + drawDot(35, 65) + drawDot(65, 65)), // b - 5 dots
      wrapSvg(drawShape("square", "outline", 50, 50, 32) + drawDot(50, 50)),  // c - 1 dot
      wrapSvg(drawShape("square", "outline", 50, 50, 32) + drawDot(35, 35) + drawDot(65, 35) + drawDot(35, 65) + drawDot(65, 65)), // d - 4 dots (correct)
      wrapSvg(drawShape("circle", "outline", 50, 50, 32) + drawDot(35, 35) + drawDot(65, 35) + drawDot(35, 65) + drawDot(65, 65)), // e - wrong shape
    ],
    3,
    "The number of dots increases by one in each step: 1, 2, 3, ?, 5. The missing figure has 4 dots.",
    1
  );
})();

// CS7: Fill cycles through outline → grey → hatched → solid → outline
const cs7 = (() => {
  const fills: Fill[] = ["outline", "grey", "hatched", "solid", "outline"];
  const hIds = ["hcs7a", "hcs7b", "hcs7c", "hcs7d", "hcs7e"];
  const shapes = fills.map((f, i) => wrapSvg(drawShape("hexagon", f, 50, 50, 28, 0, hIds[i])));
  const missing = 2; // hatched
  const series = [...shapes];
  series[missing] = null;

  return makeSeriesQuestion(
    series, missing,
    [
      wrapSvg(drawShape("hexagon", "outline", 50, 50, 28)),                   // a - outline
      wrapSvg(drawShape("hexagon", "solid", 50, 50, 28)),                     // b - solid
      wrapSvg(drawShape("hexagon", "grey", 50, 50, 28)),                      // c - grey
      wrapSvg(drawShape("hexagon", "hatched", 50, 50, 28, 0, "hcs7ans")),    // d - hatched (correct)
      wrapSvg(drawShape("pentagon", "hatched", 50, 50, 28, 0, "hcs7e2")),    // e - wrong shape
    ],
    3,
    "The fill cycles through: outline → grey → hatched → solid → outline. The missing figure is the hexagon with hatched fill.",
    2
  );
})();

// CS8: Shape alternates + rotation increases
const cs8 = (() => {
  const items = [
    wrapSvg(drawShape("square", "solid", 50, 50, 25, 0)),
    wrapSvg(drawShape("square", "outline", 50, 50, 25, 0)),
    wrapSvg(drawShape("square", "solid", 50, 50, 25, 45)),
    wrapSvg(drawShape("square", "outline", 50, 50, 25, 45)),
    wrapSvg(drawShape("square", "solid", 50, 50, 25, 90)),
  ];
  const missing = 4;
  const series = [...items];
  series[missing] = null;

  return makeSeriesQuestion(
    series, missing,
    [
      wrapSvg(drawShape("square", "outline", 50, 50, 25, 90)),   // a - outline 90 (wrong fill)
      wrapSvg(drawShape("square", "solid", 50, 50, 25, 0)),      // b - solid 0 (wrong rotation)
      wrapSvg(drawShape("square", "solid", 50, 50, 25, 90)),     // c - solid 90 (correct)
      wrapSvg(drawShape("circle", "solid", 50, 50, 25)),          // d - wrong shape
      wrapSvg(drawShape("square", "solid", 50, 50, 25, 45)),     // e - wrong rotation
    ],
    2,
    "The square alternates between solid and outline, while rotating 45 degrees every two steps. The pattern is: solid 0°, outline 0°, solid 45°, outline 45°, solid 90°.",
    3
  );
})();

// CS9: Line rotates 45 degrees inside a circle each step
const cs9 = (() => {
  const angles = [0, 45, 90, 135, 180];
  const items = angles.map(a => {
    const x1 = 50 + 25 * Math.cos(a * Math.PI / 180);
    const y1 = 50 + 25 * Math.sin(a * Math.PI / 180);
    const x2 = 50 - 25 * Math.cos(a * Math.PI / 180);
    const y2 = 50 - 25 * Math.sin(a * Math.PI / 180);
    return wrapSvg(drawShape("circle", "outline", 50, 50, 28) +
      `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="black" stroke-width="2"/>`);
  });
  const missing = 2; // 90 degrees
  const series = [...items];
  series[missing] = null;

  return makeSeriesQuestion(
    series, missing,
    [
      wrapSvg(drawShape("circle", "outline", 50, 50, 28) + drawLine(50, 22, 50, 78)),   // a - vertical = 90° (correct)
      wrapSvg(drawShape("circle", "outline", 50, 50, 28) + drawLine(22, 50, 78, 50)),   // b - horizontal = 0°
      wrapSvg(drawShape("circle", "outline", 50, 50, 28) + drawLine(30, 30, 70, 70)),   // c - 45°
      wrapSvg(drawShape("circle", "outline", 50, 50, 28) + drawLine(30, 70, 70, 30)),   // d - 135°
      wrapSvg(drawShape("circle", "outline", 50, 50, 28)),                                // e - no line
    ],
    0,
    "The line inside the circle rotates 45 degrees clockwise in each step: 0° → 45° → ? → 135° → 180°. The missing line is at 90° (vertical).",
    2
  );
})();

// CS10: Two shapes swap fills (outline↔solid)
const cs10 = (() => {
  const items = [
    wrapSvg(drawShape("circle", "solid", 35, 50, 20) + drawShape("square", "outline", 68, 50, 18)),
    wrapSvg(drawShape("circle", "outline", 35, 50, 20) + drawShape("square", "solid", 68, 50, 18)),
    wrapSvg(drawShape("circle", "solid", 35, 50, 20) + drawShape("square", "outline", 68, 50, 18)),
    wrapSvg(drawShape("circle", "outline", 35, 50, 20) + drawShape("square", "solid", 68, 50, 18)),
    wrapSvg(drawShape("circle", "solid", 35, 50, 20) + drawShape("square", "outline", 68, 50, 18)),
  ];
  const missing = 1;
  const series = [...items];
  series[missing] = null;

  return makeSeriesQuestion(
    series, missing,
    [
      wrapSvg(drawShape("circle", "solid", 35, 50, 20) + drawShape("square", "solid", 68, 50, 18)),     // a - both solid
      wrapSvg(drawShape("circle", "outline", 35, 50, 20) + drawShape("square", "outline", 68, 50, 18)), // b - both outline
      wrapSvg(drawShape("circle", "outline", 35, 50, 20) + drawShape("square", "solid", 68, 50, 18)),   // c - correct
      wrapSvg(drawShape("circle", "solid", 35, 50, 20) + drawShape("square", "outline", 68, 50, 18)),   // d - same as 1st
      wrapSvg(drawShape("square", "outline", 35, 50, 18) + drawShape("circle", "solid", 68, 50, 20)),   // e - shapes swapped
    ],
    2,
    "The circle and square alternate their fills in each step. When the circle is solid, the square is outline, and vice versa. The missing figure has an outline circle and solid square.",
    2
  );
})();

// CS11: Shape + dot count both change
const cs11 = (() => {
  const items = [
    wrapSvg(drawShape("triangle", "outline", 50, 55, 28) + drawDot(50, 55)),
    wrapSvg(drawShape("square", "outline", 50, 50, 25) + drawDot(40, 50) + drawDot(60, 50)),
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 25) + drawDot(38, 42) + drawDot(62, 42) + drawDot(50, 60)),
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 25) + drawDot(38, 38) + drawDot(62, 38) + drawDot(38, 62) + drawDot(62, 62)),
    wrapSvg(`<polygon points="${Array.from({length: 7}, (_, i) => {
      const angle = -Math.PI/2 + (2*Math.PI*i)/7;
      return `${(50 + 25*Math.cos(angle)).toFixed(1)},${(50 + 25*Math.sin(angle)).toFixed(1)}`;
    }).join(" ")}" fill="white" stroke="black" stroke-width="2"/>` + drawDot(35, 38) + drawDot(65, 38) + drawDot(50, 50) + drawDot(35, 62) + drawDot(65, 62)),
  ];
  const missing = 3; // hexagon with 4 dots
  const series = [...items];
  series[missing] = null;

  return makeSeriesQuestion(
    series, missing,
    [
      wrapSvg(drawShape("hexagon", "outline", 50, 50, 25) + drawDot(38, 38) + drawDot(62, 38) + drawDot(50, 55)),  // a - 3 dots
      wrapSvg(drawShape("hexagon", "outline", 50, 50, 25) + drawDot(38, 38) + drawDot(62, 38) + drawDot(38, 62) + drawDot(62, 62) + drawDot(50, 50)), // b - 5 dots
      wrapSvg(drawShape("pentagon", "outline", 50, 50, 25) + drawDot(38, 38) + drawDot(62, 38) + drawDot(38, 62) + drawDot(62, 62)),  // c - wrong shape
      wrapSvg(drawShape("hexagon", "outline", 50, 50, 25) + drawDot(38, 38) + drawDot(62, 38) + drawDot(38, 62) + drawDot(62, 62)),   // d - correct
      wrapSvg(drawShape("hexagon", "solid", 50, 50, 25)),  // e - wrong fill
    ],
    3,
    "Both the number of sides and dots increase by one each step: triangle+1, square+2, pentagon+3, hexagon+4, heptagon+5. The missing figure is a hexagon with 4 dots.",
    3
  );
})();

// CS12: Shape reflects horizontally each step (asymmetric shape)
const cs12 = (() => {
  const flagRight = `<polygon points="25,20 75,20 75,55 25,55" fill="white" stroke="black" stroke-width="2"/>` +
    `<polygon points="25,20 50,37 25,55" fill="black"/>`;
  const flagLeft = `<polygon points="25,20 75,20 75,55 25,55" fill="white" stroke="black" stroke-width="2"/>` +
    `<polygon points="75,20 50,37 75,55" fill="black"/>`;

  const items = [
    wrapSvg(flagRight),
    wrapSvg(flagLeft),
    wrapSvg(flagRight),
    wrapSvg(flagLeft),
    wrapSvg(flagRight),
  ];
  const missing = 2;
  const series = [...items];
  series[missing] = null;

  return makeSeriesQuestion(
    series, missing,
    [
      wrapSvg(flagLeft),    // a - reflected
      wrapSvg(flagRight),   // b - correct (same as 1st)
      wrapSvg(drawShape("square", "solid", 50, 50, 25)),  // c - wrong shape
      wrapSvg(drawShape("square", "outline", 50, 50, 25) + drawShape("triangle", "solid", 50, 50, 15, 90)),  // d - different
      wrapSvg(drawShape("triangle", "solid", 50, 50, 25)),  // e - wrong shape
    ],
    1,
    "The shape reflects horizontally in each step. The pattern alternates between the black triangle on the left and right side of the rectangle.",
    2
  );
})();

// CS13: Arrow rotates 90 degrees clockwise each step
const cs13 = (() => {
  const arrowAt = (deg: number) => {
    return wrapSvg(`<g transform="rotate(${deg},50,50)"><polygon points="50,15 40,35 45,35 45,70 55,70 55,35 60,35" fill="black"/></g>`);
  };
  const items = [arrowAt(0), arrowAt(90), arrowAt(180), arrowAt(270), arrowAt(360)];
  const missing = 1;
  const series = [...items];
  series[missing] = null;

  return makeSeriesQuestion(
    series, missing,
    [
      arrowAt(45),    // a - 45 degrees
      arrowAt(180),   // b - 180 degrees
      arrowAt(90),    // c - 90 degrees (correct)
      arrowAt(270),   // d - 270 degrees
      arrowAt(135),   // e - 135 degrees
    ],
    2,
    "The arrow rotates 90 degrees clockwise in each step: up → right → down → left → up. The missing figure is the arrow pointing right (90°).",
    1
  );
})();

// CS14: Shape shrinks while a different shape grows (inverse relationship)
const cs14 = (() => {
  const items = [
    wrapSvg(drawShape("circle", "solid", 35, 50, 28) + drawShape("square", "outline", 70, 50, 8)),
    wrapSvg(drawShape("circle", "solid", 35, 50, 22) + drawShape("square", "outline", 68, 50, 12)),
    wrapSvg(drawShape("circle", "solid", 38, 50, 16) + drawShape("square", "outline", 66, 50, 16)),
    wrapSvg(drawShape("circle", "solid", 40, 50, 10) + drawShape("square", "outline", 64, 50, 20)),
    wrapSvg(drawShape("circle", "solid", 42, 50, 6) + drawShape("square", "outline", 62, 50, 24)),
  ];
  const missing = 2;
  const series = [...items];
  series[missing] = null;

  return makeSeriesQuestion(
    series, missing,
    [
      wrapSvg(drawShape("circle", "solid", 38, 50, 28) + drawShape("square", "outline", 66, 50, 28)),   // a - both large
      wrapSvg(drawShape("circle", "solid", 38, 50, 16) + drawShape("square", "outline", 66, 50, 16)),   // b - correct
      wrapSvg(drawShape("circle", "solid", 38, 50, 8) + drawShape("square", "outline", 66, 50, 8)),     // c - both small
      wrapSvg(drawShape("circle", "outline", 38, 50, 16) + drawShape("square", "solid", 66, 50, 16)),   // d - fills swapped
      wrapSvg(drawShape("circle", "solid", 38, 50, 22) + drawShape("square", "outline", 66, 50, 22)),   // e - wrong sizes
    ],
    1,
    "The circle gets smaller while the square gets larger in each step. The middle step should show them at equal size.",
    3
  );
})();

// CS15: Number of inner lines increases by one each step
const cs15 = (() => {
  const makeLines = (n: number) => {
    const step = 56 / (n + 1);
    return Array.from({ length: n }, (_, i) =>
      drawLine(22, 22 + step * (i + 1), 78, 22 + step * (i + 1))
    ).join("");
  };
  const items = [
    wrapSvg(drawShape("square", "outline", 50, 50, 28) + makeLines(1)),
    wrapSvg(drawShape("square", "outline", 50, 50, 28) + makeLines(2)),
    wrapSvg(drawShape("square", "outline", 50, 50, 28) + makeLines(3)),
    wrapSvg(drawShape("square", "outline", 50, 50, 28) + makeLines(4)),
    wrapSvg(drawShape("square", "outline", 50, 50, 28) + makeLines(5)),
  ];
  const missing = 4;
  const series = [...items];
  series[missing] = null;

  return makeSeriesQuestion(
    series, missing,
    [
      wrapSvg(drawShape("square", "outline", 50, 50, 28) + makeLines(3)),   // a - 3 lines
      wrapSvg(drawShape("square", "outline", 50, 50, 28) + makeLines(6)),   // b - 6 lines
      wrapSvg(drawShape("square", "outline", 50, 50, 28) + makeLines(4)),   // c - 4 lines
      wrapSvg(drawShape("square", "outline", 50, 50, 28) + makeLines(5)),   // d - 5 lines (correct)
      wrapSvg(drawShape("circle", "outline", 50, 50, 28) + makeLines(5)),   // e - wrong shape
    ],
    3,
    "The number of horizontal lines inside the square increases by one each step: 1, 2, 3, 4, ?. The missing figure has 5 lines.",
    1
  );
})();

// CS16: Cross-hatching rotates 45 degrees each step
const cs16 = (() => {
  const hatchAt = (angle: number, id: string) =>
    `<defs><pattern id="${id}" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(${angle})"><line x1="0" y1="0" x2="0" y2="8" stroke="black" stroke-width="2"/></pattern></defs>` +
    `<circle cx="50" cy="50" r="28" fill="url(#${id})" stroke="black" stroke-width="2"/>`;

  const items = [
    wrapSvg(hatchAt(0, "hcs16_0")),
    wrapSvg(hatchAt(45, "hcs16_45")),
    wrapSvg(hatchAt(90, "hcs16_90")),
    wrapSvg(hatchAt(135, "hcs16_135")),
    wrapSvg(hatchAt(180, "hcs16_180")),
  ];
  const missing = 3;
  const series = [...items];
  series[missing] = null;

  return makeSeriesQuestion(
    series, missing,
    [
      wrapSvg(hatchAt(90, "hcs16_a")),     // a - 90°
      wrapSvg(hatchAt(0, "hcs16_b")),      // b - 0°
      wrapSvg(hatchAt(135, "hcs16_c")),    // c - 135° (correct)
      wrapSvg(hatchAt(45, "hcs16_d")),     // d - 45°
      wrapSvg(drawShape("circle", "solid", 50, 50, 28)),  // e - solid
    ],
    2,
    "The hatching pattern rotates 45 degrees in each step: 0° → 45° → 90° → ? → 180°. The missing figure has hatching at 135°.",
    2
  );
})();

// CS17: Shape oscillates between two sizes
const cs17 = (() => {
  const items = [
    wrapSvg(drawShape("diamond", "solid", 50, 50, 30)),
    wrapSvg(drawShape("diamond", "solid", 50, 50, 15)),
    wrapSvg(drawShape("diamond", "solid", 50, 50, 30)),
    wrapSvg(drawShape("diamond", "solid", 50, 50, 15)),
    wrapSvg(drawShape("diamond", "solid", 50, 50, 30)),
  ];
  const missing = 1;
  const series = [...items];
  series[missing] = null;

  return makeSeriesQuestion(
    series, missing,
    [
      wrapSvg(drawShape("diamond", "solid", 50, 50, 30)),    // a - large
      wrapSvg(drawShape("diamond", "outline", 50, 50, 15)),  // b - small outline
      wrapSvg(drawShape("diamond", "solid", 50, 50, 22)),    // c - medium
      wrapSvg(drawShape("diamond", "solid", 50, 50, 15)),    // d - small solid (correct)
      wrapSvg(drawShape("square", "solid", 50, 50, 15)),     // e - wrong shape
    ],
    3,
    "The diamond alternates between large and small sizes: large, ?, large, small, large. The missing figure is the small diamond.",
    1
  );
})();

// CS18: Fill progresses solid → grey → outline → hatched → solid (cycle)
const cs18 = (() => {
  const fills: Fill[] = ["solid", "grey", "outline", "hatched", "solid"];
  const hIds = ["hcs18a", "hcs18b", "hcs18c", "hcs18d", "hcs18e"];
  const items = fills.map((f, i) => wrapSvg(drawShape("pentagon", f, 50, 50, 28, 0, hIds[i])));
  const missing = 4;
  const series = [...items];
  series[missing] = null;

  return makeSeriesQuestion(
    series, missing,
    [
      wrapSvg(drawShape("pentagon", "outline", 50, 50, 28)),                     // a - outline
      wrapSvg(drawShape("pentagon", "hatched", 50, 50, 28, 0, "hcs18ans")),     // b - hatched
      wrapSvg(drawShape("pentagon", "grey", 50, 50, 28)),                        // c - grey
      wrapSvg(drawShape("pentagon", "solid", 50, 50, 28)),                       // d - solid (correct)
      wrapSvg(drawShape("hexagon", "solid", 50, 50, 28)),                        // e - wrong shape
    ],
    3,
    "The fill cycles: solid → grey → outline → hatched → ?. The cycle restarts, so the missing figure is solid.",
    3
  );
})();

// CS19: Two shapes, one rotates while other stays fixed
const cs19 = (() => {
  const items = [
    wrapSvg(drawShape("circle", "outline", 35, 50, 18) + drawShape("triangle", "solid", 70, 50, 15, 0)),
    wrapSvg(drawShape("circle", "outline", 35, 50, 18) + drawShape("triangle", "solid", 70, 50, 15, 90)),
    wrapSvg(drawShape("circle", "outline", 35, 50, 18) + drawShape("triangle", "solid", 70, 50, 15, 180)),
    wrapSvg(drawShape("circle", "outline", 35, 50, 18) + drawShape("triangle", "solid", 70, 50, 15, 270)),
    wrapSvg(drawShape("circle", "outline", 35, 50, 18) + drawShape("triangle", "solid", 70, 50, 15, 360)),
  ];
  const missing = 3;
  const series = [...items];
  series[missing] = null;

  return makeSeriesQuestion(
    series, missing,
    [
      wrapSvg(drawShape("circle", "outline", 35, 50, 18) + drawShape("triangle", "solid", 70, 50, 15, 90)),    // a - 90°
      wrapSvg(drawShape("circle", "outline", 35, 50, 18) + drawShape("triangle", "solid", 70, 50, 15, 180)),   // b - 180°
      wrapSvg(drawShape("circle", "solid", 35, 50, 18) + drawShape("triangle", "solid", 70, 50, 15, 270)),     // c - wrong circle fill
      wrapSvg(drawShape("circle", "outline", 35, 50, 18) + drawShape("triangle", "solid", 70, 50, 15, 270)),   // d - 270° (correct)
      wrapSvg(drawShape("circle", "outline", 35, 50, 18) + drawShape("triangle", "outline", 70, 50, 15, 270)), // e - wrong triangle fill
    ],
    3,
    "The circle stays the same while the triangle rotates 90° clockwise each step. At the 4th position, the triangle should be at 270°.",
    2
  );
})();

// CS20: Concentric shapes — each step adds one more nested shape
const cs20 = (() => {
  const items = [
    wrapSvg(drawShape("circle", "outline", 50, 50, 35)),
    wrapSvg(drawShape("circle", "outline", 50, 50, 35) + drawShape("circle", "outline", 50, 50, 24)),
    wrapSvg(drawShape("circle", "outline", 50, 50, 35) + drawShape("circle", "outline", 50, 50, 24) + drawShape("circle", "outline", 50, 50, 13)),
    wrapSvg(drawShape("circle", "outline", 50, 50, 35) + drawShape("circle", "outline", 50, 50, 24) + drawShape("circle", "outline", 50, 50, 13) + drawDot(50, 50, 4)),
    wrapSvg(drawShape("circle", "outline", 50, 50, 35) + drawShape("circle", "outline", 50, 50, 24) + drawShape("circle", "outline", 50, 50, 13) + drawDot(50, 50, 4) + drawDot(50, 50, 1)),
  ];
  const missing = 2;
  const series = [...items];
  series[missing] = null;

  return makeSeriesQuestion(
    series, missing,
    [
      wrapSvg(drawShape("circle", "outline", 50, 50, 35) + drawShape("circle", "outline", 50, 50, 24)),  // a - 2 circles
      wrapSvg(drawShape("circle", "outline", 50, 50, 35) + drawShape("circle", "outline", 50, 50, 24) + drawShape("circle", "outline", 50, 50, 13) + drawDot(50, 50, 4)), // b - 4 elements
      wrapSvg(drawShape("circle", "outline", 50, 50, 35) + drawShape("circle", "outline", 50, 50, 24) + drawShape("circle", "outline", 50, 50, 13)),  // c - 3 circles (correct)
      wrapSvg(drawShape("circle", "solid", 50, 50, 35) + drawShape("circle", "outline", 50, 50, 24) + drawShape("circle", "outline", 50, 50, 13)),    // d - outer filled
      wrapSvg(drawShape("circle", "outline", 50, 50, 35) + drawDot(50, 50, 13)),  // e - only 2 elements
    ],
    2,
    "Each step adds one more concentric circle inside the previous ones. The missing figure should have 3 concentric circles.",
    2
  );
})();

const seriesQuestions: SeriesQuestion[] = [
  cs1, cs2, cs3, cs4, cs5, cs6, cs7, cs8, cs9, cs10,
  cs11, cs12, cs13, cs14, cs15, cs16, cs17, cs18, cs19, cs20,
];

// ─── "Find the Figure Like the First Three" Questions ───

interface FindFigureThreeQuestion {
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: number;
  bodyJson: {
    type: "nvr_find_figure_three";
    referenceItems: string[];
    optionSvgs: string[];
  };
}

function makeFindFigureThreeQuestion(
  refs: string[],
  opts: string[],
  correctIdx: number,
  explanation: string,
  difficulty: number
): FindFigureThreeQuestion {
  return {
    questionText: "Find the figure that is most like the three figures on the left.",
    options: ["a", "b", "c", "d", "e"],
    correctAnswer: correctIdx,
    explanation,
    difficulty,
    bodyJson: { type: "nvr_find_figure_three", referenceItems: refs, optionSvgs: opts },
  };
}

// FF3-1: All figures are shapes with a line through showing symmetry
const ff3_1 = makeFindFigureThreeQuestion(
  [
    wrapSvg(drawShape("circle", "outline", 50, 50, 30) + drawLine(50, 20, 50, 80)),
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 30) + drawLine(50, 18, 50, 82)),
    wrapSvg(`<polygon points="50,15 85,50 50,85 15,50" fill="white" stroke="black" stroke-width="2"/>` + drawLine(50, 15, 50, 85)),
  ],
  [
    wrapSvg(drawShape("triangle", "outline", 50, 55, 30) + drawLine(50, 25, 50, 80)),  // a - triangle with vertical line (correct)
    wrapSvg(drawShape("square", "outline", 50, 50, 28) + drawLine(22, 22, 78, 78)),     // b - diagonal line
    wrapSvg(drawShape("circle", "outline", 50, 50, 28)),                                  // c - no line
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 28) + drawLine(22, 50, 78, 50)),   // d - horizontal line
    wrapSvg(drawShape("hexagon", "solid", 50, 50, 28) + drawLine(50, 20, 50, 80)),      // e - solid fill
  ],
  0,
  "All figures are outline shapes with a vertical line of symmetry drawn through the centre. Only option A matches.",
  1
);

// FF3-2: All figures have two straight lines and two curved lines
const ff3_2 = makeFindFigureThreeQuestion(
  [
    wrapSvg(`<rect x="20" y="30" width="25" height="40" fill="white" stroke="black" stroke-width="2"/><path d="M55,30 Q80,50 55,70" fill="none" stroke="black" stroke-width="2"/><path d="M55,30 Q30,50 55,70" fill="none" stroke="black" stroke-width="2"/>`),
    wrapSvg(`<line x1="25" y1="25" x2="75" y2="25" stroke="black" stroke-width="2"/><line x1="25" y1="75" x2="75" y2="75" stroke="black" stroke-width="2"/><path d="M25,25 Q10,50 25,75" fill="none" stroke="black" stroke-width="2"/><path d="M75,25 Q90,50 75,75" fill="none" stroke="black" stroke-width="2"/>`),
    wrapSvg(`<line x1="30" y1="20" x2="30" y2="80" stroke="black" stroke-width="2"/><line x1="70" y1="20" x2="70" y2="80" stroke="black" stroke-width="2"/><path d="M30,20 Q50,35 70,20" fill="none" stroke="black" stroke-width="2"/><path d="M30,80 Q50,65 70,80" fill="none" stroke="black" stroke-width="2"/>`),
  ],
  [
    wrapSvg(drawShape("square", "outline", 50, 50, 28)),                                   // a - 4 straight lines
    wrapSvg(drawShape("circle", "outline", 50, 50, 28)),                                    // b - all curved
    wrapSvg(`<path d="M30,25 Q50,10 70,25" fill="none" stroke="black" stroke-width="2"/><path d="M30,75 Q50,90 70,75" fill="none" stroke="black" stroke-width="2"/><line x1="30" y1="25" x2="30" y2="75" stroke="black" stroke-width="2"/><line x1="70" y1="25" x2="70" y2="75" stroke="black" stroke-width="2"/>`), // c - correct
    wrapSvg(drawShape("triangle", "outline", 50, 55, 30)),                                  // d - 3 straight lines
    wrapSvg(`<line x1="25" y1="25" x2="75" y2="25" stroke="black" stroke-width="2"/><line x1="25" y1="50" x2="75" y2="50" stroke="black" stroke-width="2"/><line x1="25" y1="75" x2="75" y2="75" stroke="black" stroke-width="2"/>`), // e - 3 straight lines
  ],
  2,
  "All figures are made of two straight lines and two curved lines. Only option C matches.",
  2
);

// FF3-3: All figures are identical apart from rotation
const ff3_3 = (() => {
  const shape = `<polygon points="30,25 70,25 80,50 50,75 20,50" fill="white" stroke="black" stroke-width="2"/>`;
  return makeFindFigureThreeQuestion(
    [
      wrapSvg(`<g transform="rotate(0,50,50)">${shape}</g>`),
      wrapSvg(`<g transform="rotate(120,50,50)">${shape}</g>`),
      wrapSvg(`<g transform="rotate(240,50,50)">${shape}</g>`),
    ],
    [
      wrapSvg(`<g transform="rotate(60,50,50)">${shape}</g>`),    // a - correct (same shape, different rotation)
      wrapSvg(drawShape("pentagon", "outline", 50, 50, 28)),       // b - regular pentagon
      wrapSvg(`<g transform="scale(-1,1) translate(-100,0)">${`<g transform="rotate(60,50,50)">${shape}</g>`}</g>`), // c - reflected
      wrapSvg(drawShape("hexagon", "outline", 50, 50, 28)),        // d - hexagon
      wrapSvg(drawShape("square", "outline", 50, 50, 28, 30)),     // e - square
    ],
    0,
    "All figures must be identical apart from rotation. Only option A is the same irregular pentagon rotated.",
    2
  );
})();

// FF3-4: All figures are grey with one white quarter
const ff3_4 = (() => {
  const greyWithWhiteQuarter = (quadrant: number) => {
    const paths = [
      `<path d="M50,50 L50,20 A30,30 0 0,1 80,50 Z" fill="white" stroke="black" stroke-width="2"/>`,
      `<path d="M50,50 L80,50 A30,30 0 0,1 50,80 Z" fill="white" stroke="black" stroke-width="2"/>`,
      `<path d="M50,50 L50,80 A30,30 0 0,1 20,50 Z" fill="white" stroke="black" stroke-width="2"/>`,
      `<path d="M50,50 L20,50 A30,30 0 0,1 50,20 Z" fill="white" stroke="black" stroke-width="2"/>`,
    ];
    return wrapSvg(`<circle cx="50" cy="50" r="30" fill="#999" stroke="black" stroke-width="2"/>` + paths[quadrant]);
  };
  return makeFindFigureThreeQuestion(
    [greyWithWhiteQuarter(0), greyWithWhiteQuarter(1), greyWithWhiteQuarter(3)],
    [
      wrapSvg(`<circle cx="50" cy="50" r="30" fill="#999" stroke="black" stroke-width="2"/>`),         // a - all grey
      wrapSvg(`<circle cx="50" cy="50" r="30" fill="white" stroke="black" stroke-width="2"/>`),        // b - all white
      greyWithWhiteQuarter(2),                                                                            // c - correct
      wrapSvg(`<circle cx="50" cy="50" r="30" fill="black" stroke="black" stroke-width="2"/><path d="M50,50 L50,20 A30,30 0 0,1 80,50 Z" fill="white" stroke="black" stroke-width="2"/>`), // d - black not grey
      wrapSvg(`<circle cx="50" cy="50" r="30" fill="#999" stroke="black" stroke-width="2"/><path d="M50,50 L50,20 A30,30 0 0,0 20,50 Z" fill="white" stroke="black" stroke-width="2"/><path d="M50,50 L50,80 A30,30 0 0,0 80,50 Z" fill="white" stroke="black" stroke-width="2"/>`), // e - two white quarters
    ],
    2,
    "All figures must be grey with one white quarter. Only option C matches.",
    1
  );
})();

// FF3-5: All figures have a line crossing both shapes
const ff3_5 = makeFindFigureThreeQuestion(
  [
    wrapSvg(drawShape("circle", "outline", 35, 50, 18) + drawShape("square", "outline", 70, 50, 15) + drawLine(15, 50, 88, 50)),
    wrapSvg(drawShape("triangle", "outline", 35, 55, 20) + drawShape("diamond", "outline", 70, 50, 15) + drawLine(15, 40, 88, 60)),
    wrapSvg(drawShape("hexagon", "outline", 35, 50, 18) + drawShape("pentagon", "outline", 70, 50, 16) + drawLine(15, 55, 88, 45)),
  ],
  [
    wrapSvg(drawShape("circle", "outline", 35, 50, 18) + drawShape("square", "outline", 70, 50, 15)),                                    // a - no line
    wrapSvg(drawShape("square", "outline", 35, 50, 18) + drawShape("triangle", "outline", 70, 55, 16) + drawLine(15, 50, 88, 50)),      // b - correct
    wrapSvg(drawShape("circle", "outline", 35, 50, 18) + drawLine(15, 50, 55, 50)),                                                       // c - line doesn't cross both
    wrapSvg(drawShape("diamond", "solid", 35, 50, 18) + drawShape("circle", "solid", 70, 50, 15) + drawLine(15, 50, 88, 50)),            // d - solid shapes
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 28) + drawLine(22, 50, 78, 50)),                                                     // e - only one shape
  ],
  1,
  "All figures must have a line which crosses both shapes. Only option B matches.",
  2
);

// FF3-6: All figures have overlapping shapes where sides add to 11
const ff3_6 = makeFindFigureThreeQuestion(
  [
    wrapSvg(drawShape("pentagon", "outline", 40, 50, 24) + drawShape("hexagon", "outline", 62, 50, 22)),   // 5+6=11
    wrapSvg(drawShape("square", "outline", 40, 50, 22) + `<polygon points="${Array.from({length: 7}, (_, i) => { const a = -Math.PI/2 + (2*Math.PI*i)/7; return `${(62 + 22*Math.cos(a)).toFixed(1)},${(50 + 22*Math.sin(a)).toFixed(1)}`; }).join(" ")}" fill="white" stroke="black" stroke-width="2"/>`),  // 4+7=11
    wrapSvg(drawShape("triangle", "outline", 38, 55, 22) + `<polygon points="${Array.from({length: 8}, (_, i) => { const a = -Math.PI/4 + (2*Math.PI*i)/8; return `${(64 + 20*Math.cos(a)).toFixed(1)},${(50 + 20*Math.sin(a)).toFixed(1)}`; }).join(" ")}" fill="white" stroke="black" stroke-width="2"/>`),  // 3+8=11
  ],
  [
    wrapSvg(drawShape("triangle", "outline", 40, 55, 22) + drawShape("square", "outline", 64, 50, 18)),     // a - 3+4=7
    wrapSvg(drawShape("hexagon", "outline", 40, 50, 22) + drawShape("hexagon", "outline", 64, 50, 20)),     // b - 6+6=12
    wrapSvg(drawShape("circle", "outline", 40, 50, 22) + drawShape("pentagon", "outline", 64, 50, 20)),     // c - circle has no sides
    wrapSvg(drawShape("hexagon", "outline", 40, 50, 22) + drawShape("pentagon", "outline", 64, 50, 20)),    // d - 6+5=11 (correct)
    wrapSvg(drawShape("square", "outline", 40, 50, 22) + drawShape("square", "outline", 64, 50, 18)),       // e - 4+4=8
  ],
  3,
  "In all figures, the number of sides of the overlapping shapes must add up to eleven. Only option D (hexagon 6 + pentagon 5 = 11) matches.",
  3
);

// FF3-7: All figures have shape with fewest sides in the middle as dashed
const ff3_7 = makeFindFigureThreeQuestion(
  [
    wrapSvg(drawShape("hexagon", "outline", 35, 50, 18) + `<polygon points="${shapePoints("triangle", 50, 50, 14)}" fill="none" stroke="black" stroke-width="2" stroke-dasharray="4,3"/>` + drawShape("square", "outline", 68, 50, 14)),
    wrapSvg(drawShape("pentagon", "outline", 35, 50, 18) + `<polygon points="${shapePoints("square", 50, 50, 14)}" fill="none" stroke="black" stroke-width="2" stroke-dasharray="4,3"/>` + drawShape("hexagon", "outline", 68, 50, 16)),
    wrapSvg(drawShape("square", "outline", 35, 50, 16) + `<circle cx="50" cy="50" r="14" fill="none" stroke="black" stroke-width="2"/>` + drawShape("pentagon", "outline", 68, 50, 16)),
  ],
  [
    wrapSvg(drawShape("hexagon", "outline", 35, 50, 18) + `<polygon points="${shapePoints("triangle", 50, 50, 14)}" fill="none" stroke="black" stroke-width="2" stroke-dasharray="4,3"/>` + drawShape("pentagon", "outline", 68, 50, 16)), // a - triangle is fewest, dashed (correct)
    wrapSvg(drawShape("triangle", "outline", 35, 55, 18) + `<polygon points="${shapePoints("hexagon", 50, 50, 14)}" fill="none" stroke="black" stroke-width="2" stroke-dasharray="4,3"/>` + drawShape("square", "outline", 68, 50, 14)), // b - hexagon dashed but not fewest
    wrapSvg(drawShape("pentagon", "outline", 35, 50, 18) + drawShape("square", "outline", 50, 50, 14) + drawShape("hexagon", "outline", 68, 50, 16)),                                                                                      // c - none dashed
    wrapSvg(drawShape("circle", "outline", 35, 50, 18) + drawShape("circle", "outline", 50, 50, 14) + drawShape("circle", "outline", 68, 50, 16)),                                                                                           // d - all same shape
    wrapSvg(`<polygon points="${shapePoints("triangle", 35, 55, 18)}" fill="none" stroke="black" stroke-width="2" stroke-dasharray="4,3"/>` + drawShape("square", "outline", 50, 50, 14) + drawShape("pentagon", "outline", 68, 50, 16)),  // e - fewest is not in middle
  ],
  0,
  "In all figures, the shape with the smallest number of sides must have a dashed outline. Only option A follows this rule.",
  3
);

// FF3-8: All figures have same number of lines at bottom as number of dots at top
const ff3_8 = makeFindFigureThreeQuestion(
  [
    wrapSvg(drawDot(40, 25) + drawDot(60, 25) + drawShape("square", "outline", 50, 55, 20) + drawLine(35, 80, 45, 80) + drawLine(55, 80, 65, 80)),
    wrapSvg(drawDot(35, 25) + drawDot(50, 25) + drawDot(65, 25) + drawShape("circle", "outline", 50, 55, 18) + drawLine(30, 80, 40, 80) + drawLine(45, 80, 55, 80) + drawLine(60, 80, 70, 80)),
    wrapSvg(drawDot(50, 25) + drawShape("triangle", "outline", 50, 55, 20) + drawLine(45, 80, 55, 80)),
  ],
  [
    wrapSvg(drawDot(40, 25) + drawDot(60, 25) + drawShape("pentagon", "outline", 50, 55, 18) + drawLine(45, 80, 55, 80)),           // a - 2 dots, 1 line
    wrapSvg(drawDot(40, 25) + drawDot(60, 25) + drawShape("hexagon", "outline", 50, 55, 18) + drawLine(35, 80, 45, 80) + drawLine(55, 80, 65, 80)), // b - 2 dots, 2 lines (correct)
    wrapSvg(drawDot(50, 25) + drawShape("diamond", "outline", 50, 55, 18) + drawLine(35, 80, 45, 80) + drawLine(55, 80, 65, 80)),   // c - 1 dot, 2 lines
    wrapSvg(drawDot(35, 25) + drawDot(50, 25) + drawDot(65, 25) + drawShape("square", "outline", 50, 55, 18) + drawLine(35, 80, 45, 80) + drawLine(55, 80, 65, 80)), // d - 3 dots, 2 lines
    wrapSvg(drawShape("circle", "outline", 50, 55, 18) + drawLine(35, 80, 45, 80) + drawLine(55, 80, 65, 80)),                       // e - 0 dots, 2 lines
  ],
  1,
  "All figures must have the same number of lines at the bottom as number of dots at the top. Only option B has 2 dots and 2 lines.",
  2
);

// FF3-9: All figures have one less inner line than number of sides of shape
const ff3_9 = makeFindFigureThreeQuestion(
  [
    wrapSvg(drawShape("square", "outline", 50, 50, 28) + drawLine(28, 38, 72, 38) + drawLine(28, 50, 72, 50) + drawLine(28, 62, 72, 62)),           // 4 sides, 3 lines
    wrapSvg(drawShape("triangle", "outline", 50, 55, 28) + drawLine(35, 55, 65, 55) + drawLine(40, 42, 60, 42)),                                      // 3 sides, 2 lines
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 28) + drawLine(28, 35, 72, 35) + drawLine(28, 45, 72, 45) + drawLine(28, 55, 72, 55) + drawLine(28, 65, 72, 65)), // 5 sides, 4 lines
  ],
  [
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 28) + drawLine(25, 35, 75, 35) + drawLine(25, 45, 75, 45) + drawLine(25, 55, 75, 55) + drawLine(25, 65, 75, 65)), // a - 6 sides, 4 lines (wrong: need 5)
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 28) + drawLine(25, 32, 75, 32) + drawLine(25, 42, 75, 42) + drawLine(25, 52, 75, 52) + drawLine(25, 62, 75, 62) + drawLine(25, 72, 75, 72)), // b - 6 sides, 5 lines (correct)
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 28) + drawLine(25, 35, 75, 35) + drawLine(25, 50, 75, 50) + drawLine(25, 65, 75, 65)),             // c - 6 sides, 3 lines
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 28) + drawLine(25, 50, 75, 50)),                                                                     // d - 6 sides, 1 line
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 28)),                                                                                                 // e - 6 sides, 0 lines
  ],
  1,
  "All figures must have one less inner line than the number of sides of the shape. Hexagon has 6 sides so needs 5 lines. Only option B matches.",
  3
);

// FF3-10: All figures have a large shape with 5 sides and same number of dashed outlines as raindrops
const ff3_10 = makeFindFigureThreeQuestion(
  [
    wrapSvg(drawShape("pentagon", "outline", 50, 45, 28) + `<polygon points="${shapePoints("triangle", 35, 72, 8)}" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="3,2"/>` + `<polygon points="${shapePoints("triangle", 55, 72, 8)}" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="3,2"/>`),
    wrapSvg(drawShape("pentagon", "outline", 50, 45, 28) + `<polygon points="${shapePoints("triangle", 35, 72, 8)}" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="3,2"/>` + `<polygon points="${shapePoints("triangle", 50, 72, 8)}" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="3,2"/>` + `<polygon points="${shapePoints("triangle", 65, 72, 8)}" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="3,2"/>`),
    wrapSvg(drawShape("pentagon", "outline", 50, 45, 28) + `<polygon points="${shapePoints("triangle", 50, 72, 8)}" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="3,2"/>`),
  ],
  [
    wrapSvg(drawShape("hexagon", "outline", 50, 45, 28) + `<polygon points="${shapePoints("triangle", 35, 75, 8)}" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="3,2"/>` + `<polygon points="${shapePoints("triangle", 55, 75, 8)}" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="3,2"/>` + `<polygon points="${shapePoints("triangle", 75, 75, 8)}" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="3,2"/>` + `<polygon points="${shapePoints("triangle", 15, 75, 8)}" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="3,2"/>`), // a - hexagon not pentagon
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 28)),                                                                                    // b - no dashed shapes
    wrapSvg(drawShape("pentagon", "solid", 50, 45, 28) + `<polygon points="${shapePoints("triangle", 35, 72, 8)}" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="3,2"/>` + `<polygon points="${shapePoints("triangle", 55, 72, 8)}" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="3,2"/>` + `<polygon points="${shapePoints("triangle", 75, 72, 8)}" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="3,2"/>` + `<polygon points="${shapePoints("triangle", 15, 72, 8)}" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="3,2"/>`), // c - solid pentagon
    wrapSvg(drawShape("pentagon", "outline", 50, 45, 28) + `<polygon points="${shapePoints("triangle", 35, 72, 8)}" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="3,2"/>` + `<polygon points="${shapePoints("triangle", 50, 72, 8)}" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="3,2"/>` + `<polygon points="${shapePoints("triangle", 65, 72, 8)}" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="3,2"/>` + `<polygon points="${shapePoints("triangle", 80, 72, 8)}" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="3,2"/>`), // d - 4 dashed shapes (correct)
    wrapSvg(drawShape("pentagon", "outline", 50, 45, 28) + `<polygon points="${shapePoints("triangle", 50, 72, 8)}" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="3,2"/>`), // e - only 1 dashed shape
  ],
  3,
  "All figures must have a large five-sided shape. There must be the same number of shapes with dashed outlines as the number of sides inside the five-sided shape. Option D has a pentagon with 4 small dashed triangles.",
  3
);

const findFigureThreeQuestions: FindFigureThreeQuestion[] = [
  ff3_1, ff3_2, ff3_3, ff3_4, ff3_5, ff3_6, ff3_7, ff3_8, ff3_9, ff3_10,
];

// ─── "Odd One Out" Questions ───

interface OddOneOutQuestion {
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: number;
  bodyJson: {
    type: "nvr_odd_one_out";
    optionSvgs: string[];
  };
}

function makeOddOneOutQuestion(
  opts: string[],
  correctIdx: number,
  explanation: string,
  difficulty: number
): OddOneOutQuestion {
  return {
    questionText: "Find the odd one out.",
    options: ["a", "b", "c", "d", "e"],
    correctAnswer: correctIdx,
    explanation,
    difficulty,
    bodyJson: { type: "nvr_odd_one_out", optionSvgs: opts },
  };
}

// OOO1: All other figures have a black dot
const ooo1 = makeOddOneOutQuestion(
  [
    wrapSvg(drawShape("circle", "outline", 50, 50, 28) + drawDot(50, 50)),
    wrapSvg(drawShape("square", "outline", 50, 50, 25) + drawDot(50, 50)),
    wrapSvg(drawShape("triangle", "outline", 50, 55, 28) + drawDot(50, 55)),
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 28)),                        // d - no dot (odd)
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 28) + drawDot(50, 50)),
  ],
  3,
  "All other figures have a black dot inside the shape. Option D has no dot.",
  1
);

// OOO2: All other figures are hatched in the same direction
const ooo2 = makeOddOneOutQuestion(
  [
    wrapSvg(drawShape("square", "hatched", 50, 50, 28, 0, "hooo2a")),
    wrapSvg(drawShape("circle", "hatched", 50, 50, 28, 0, "hooo2b")),
    wrapSvg(drawShape("triangle", "hatched", 50, 55, 28, 0, "hooo2c")),
    wrapSvg(drawShape("pentagon", "hatched", 50, 50, 28, 0, "hooo2d")),
    wrapSvg(`<defs><pattern id="hooo2e" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(135)"><line x1="0" y1="0" x2="0" y2="6" stroke="black" stroke-width="1.5"/></pattern></defs><circle cx="50" cy="50" r="28" fill="url(#hooo2e)" stroke="black" stroke-width="2"/>`),  // e - different hatch direction (odd)
  ],
  4,
  "All other figures are hatched in the same direction. Option E has hatching in the opposite direction.",
  1
);

// OOO3: All other figures are made of two identical shapes
const ooo3 = makeOddOneOutQuestion(
  [
    wrapSvg(drawShape("triangle", "solid", 35, 50, 18) + drawShape("triangle", "solid", 65, 50, 18)),
    wrapSvg(drawShape("circle", "solid", 35, 50, 16) + drawShape("circle", "solid", 65, 50, 16)),
    wrapSvg(drawShape("square", "solid", 35, 50, 16) + drawShape("triangle", "solid", 65, 55, 18)),   // c - different shapes (odd)
    wrapSvg(drawShape("hexagon", "solid", 35, 50, 16) + drawShape("hexagon", "solid", 65, 50, 16)),
    wrapSvg(drawShape("diamond", "solid", 35, 50, 18) + drawShape("diamond", "solid", 65, 50, 18)),
  ],
  2,
  "In all other figures, the two shapes are identical. In option C, the shapes are different (square and triangle).",
  1
);

// OOO4: All other figures have two overlapping shapes
const ooo4 = makeOddOneOutQuestion(
  [
    wrapSvg(drawShape("circle", "outline", 40, 50, 22) + drawShape("square", "outline", 60, 50, 18)),
    wrapSvg(drawShape("triangle", "outline", 40, 55, 22) + drawShape("circle", "outline", 62, 50, 16)),
    wrapSvg(drawShape("pentagon", "outline", 40, 50, 22) + drawShape("diamond", "outline", 62, 50, 16)),
    wrapSvg(drawShape("hexagon", "outline", 40, 50, 22) + drawShape("triangle", "outline", 62, 55, 16)),
    wrapSvg(drawShape("square", "outline", 35, 50, 18) + drawShape("circle", "outline", 72, 50, 16)),   // e - not overlapping (odd)
  ],
  4,
  "In all other figures, the two shapes are overlapping. In option E, the shapes are separated.",
  1
);

// OOO5: All other figures have an arrow pointing towards the grey semicircle
const ooo5 = (() => {
  const arrowRight = `<polygon points="70,50 55,40 55,45 35,45 35,55 55,55 55,60" fill="black"/>`;
  const arrowLeft = `<polygon points="30,50 45,40 45,45 65,45 65,55 45,55 45,60" fill="black"/>`;
  const arrowUp = `<polygon points="50,30 40,45 45,45 45,65 55,65 55,45 60,45" fill="black"/>`;
  const semiRight = `<path d="M75,30 A25,25 0 0,1 75,70" fill="#999" stroke="black" stroke-width="2"/>`;
  const semiLeft = `<path d="M25,30 A25,25 0 0,0 25,70" fill="#999" stroke="black" stroke-width="2"/>`;
  const semiTop = `<path d="M30,25 A25,25 0 0,1 70,25" fill="#999" stroke="black" stroke-width="2"/>`;

  return makeOddOneOutQuestion(
    [
      wrapSvg(arrowRight + semiRight),     // a - arrow right, semi right
      wrapSvg(arrowLeft + semiLeft),       // b - arrow left, semi left
      wrapSvg(arrowUp + semiTop),          // c - arrow up, semi top
      wrapSvg(arrowRight + semiLeft),      // d - arrow right but semi on LEFT (odd)
      wrapSvg(arrowLeft + semiLeft),       // e - arrow left, semi left
    ],
    3,
    "In all other figures, the arrow points towards the grey semicircle. In option D, the arrow points away from it.",
    2
  );
})();

// OOO6: All other figures have arrowhead touching the outline
const ooo6 = (() => {
  const shapeWithArrow = (shape: string, arrowTouching: boolean) => {
    const offset = arrowTouching ? 0 : 8;
    return wrapSvg(shape + `<polygon points="${50-offset},22 ${45-offset},32 ${55-offset},32" fill="black"/>`);
  };
  return makeOddOneOutQuestion(
    [
      wrapSvg(drawShape("square", "outline", 50, 50, 25) + `<polygon points="50,25 45,15 55,15" fill="black"/>`),
      wrapSvg(drawShape("circle", "outline", 50, 50, 25) + `<polygon points="50,25 45,15 55,15" fill="black"/>`),
      wrapSvg(drawShape("hexagon", "outline", 50, 50, 25) + `<polygon points="50,25 45,15 55,15" fill="black"/>`),
      wrapSvg(drawShape("pentagon", "outline", 50, 50, 25) + `<polygon points="50,25 45,15 55,15" fill="black"/>`),
      wrapSvg(drawShape("diamond", "outline", 50, 50, 25) + `<polygon points="42,15 37,5 47,5" fill="black"/>`),   // e - arrowhead not touching (odd)
    ],
    4,
    "In all other figures, the arrowhead is touching the outline of the shape. In option E, the arrowhead is not touching.",
    2
  );
})();

// OOO7: All other figures have two shapes cut from large shape that are reflections
const ooo7 = makeFindFigureThreeQuestion(
  // Using find_figure_three structure for visual, but this generates OOO
  [wrapSvg(drawShape("circle", "outline", 50, 50, 28)), wrapSvg(drawShape("circle", "outline", 50, 50, 28)), wrapSvg(drawShape("circle", "outline", 50, 50, 28))],
  [wrapSvg(drawShape("circle", "outline", 50, 50, 28)), wrapSvg(drawShape("circle", "outline", 50, 50, 28)), wrapSvg(drawShape("circle", "outline", 50, 50, 28)), wrapSvg(drawShape("circle", "outline", 50, 50, 28)), wrapSvg(drawShape("circle", "outline", 50, 50, 28))],
  0, "", 1
);
// Actually let me redo OOO7 properly
const ooo7_real = makeOddOneOutQuestion(
  [
    wrapSvg(drawShape("circle", "outline", 50, 50, 28) + drawShape("square", "solid", 50, 50, 12)),
    wrapSvg(drawShape("square", "outline", 50, 50, 25) + drawShape("circle", "solid", 50, 50, 10)),
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 28) + drawShape("triangle", "solid", 50, 52, 12)),
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 28) + drawShape("diamond", "solid", 50, 50, 12)),
    wrapSvg(drawShape("triangle", "outline", 50, 55, 28) + drawShape("triangle", "solid", 50, 55, 12)),  // e - same shape inside (odd)
  ],
  4,
  "In all other figures, the inner and outer shapes are different. In option E, both shapes are triangles.",
  2
);

// OOO8: All other figures have same number of lines as black hexagons
const ooo8 = makeOddOneOutQuestion(
  [
    wrapSvg(drawShape("hexagon", "solid", 30, 50, 12) + drawLine(55, 35, 55, 65)),                                                          // a - 1 hexagon, 1 line
    wrapSvg(drawShape("hexagon", "solid", 25, 40, 10) + drawShape("hexagon", "solid", 25, 65, 10) + drawLine(55, 30, 55, 50) + drawLine(55, 55, 55, 75)),  // b - 2 hexagons, 2 lines
    wrapSvg(drawShape("hexagon", "solid", 25, 35, 10) + drawShape("hexagon", "solid", 25, 55, 10) + drawShape("hexagon", "solid", 25, 75, 10) + drawLine(55, 30, 55, 42) + drawLine(55, 48, 55, 60) + drawLine(55, 66, 55, 78)),  // c - 3 hexagons, 3 lines
    wrapSvg(drawShape("hexagon", "solid", 25, 50, 10) + drawLine(55, 30, 55, 50) + drawLine(55, 55, 55, 75)),                                // d - 1 hexagon, 2 lines (odd)
    wrapSvg(drawShape("hexagon", "solid", 25, 40, 10) + drawShape("hexagon", "solid", 25, 65, 10) + drawLine(55, 35, 55, 50) + drawLine(55, 55, 55, 70)),  // e - 2 hexagons, 2 lines
  ],
  3,
  "In all other figures, the number of lines equals the number of black hexagons. In option D, there is 1 hexagon but 2 lines.",
  2
);

// OOO9: All other figures have the square in the top half and diamond in bottom half
const ooo9 = makeOddOneOutQuestion(
  [
    wrapSvg(drawShape("square", "outline", 50, 30, 15) + drawShape("diamond", "outline", 50, 70, 15)),
    wrapSvg(drawShape("square", "solid", 50, 30, 12) + drawShape("diamond", "solid", 50, 70, 12)),
    wrapSvg(drawShape("square", "grey", 50, 30, 14) + drawShape("diamond", "grey", 50, 70, 14)),
    wrapSvg(drawShape("square", "outline", 50, 70, 15) + drawShape("diamond", "outline", 50, 30, 15)),  // d - positions swapped (odd)
    wrapSvg(drawShape("square", "hatched", 50, 30, 14, 0, "hooo9") + drawShape("diamond", "hatched", 50, 70, 14, 0, "hooo9b")),
  ],
  3,
  "In all other figures the square is in the top half and the diamond is in the bottom half. In option D, their positions are swapped.",
  1
);

// OOO10: All other figures have a large shape divided into two triangles and a four-sided shape
const ooo10 = makeOddOneOutQuestion(
  [
    wrapSvg(`<polygon points="20,80 80,80 80,20" fill="white" stroke="black" stroke-width="2"/><polygon points="20,80 80,20 20,20" fill="#999" stroke="black" stroke-width="2"/>`),
    wrapSvg(`<polygon points="20,20 80,20 80,80" fill="white" stroke="black" stroke-width="2"/><polygon points="20,20 80,80 20,80" fill="#999" stroke="black" stroke-width="2"/>`),
    wrapSvg(`<polygon points="20,20 80,20 20,80" fill="#999" stroke="black" stroke-width="2"/><polygon points="80,20 80,80 20,80" fill="white" stroke="black" stroke-width="2"/>`),
    wrapSvg(`<polygon points="20,20 80,20 50,50" fill="#999" stroke="black" stroke-width="2"/><polygon points="80,20 80,80 50,50" fill="white" stroke="black" stroke-width="2"/><polygon points="80,80 20,80 50,50" fill="#999" stroke="black" stroke-width="2"/><polygon points="20,80 20,20 50,50" fill="white" stroke="black" stroke-width="2"/>`), // d - divided into 4 triangles (odd)
    wrapSvg(`<polygon points="50,20 80,80 20,80" fill="white" stroke="black" stroke-width="2"/><rect x="20" y="20" width="60" height="30" fill="#999" stroke="black" stroke-width="2"/>`),
  ],
  3,
  "All other figures have a large shape divided into two triangles and a four-sided shape. Option D is divided into four triangles.",
  3
);

const oddOneOutQuestions: OddOneOutQuestion[] = [
  ooo1, ooo2, ooo3, ooo4, ooo5, ooo6, ooo7_real, ooo8, ooo9, ooo10,
];

// ─── "Complete the Pair" Questions ───

interface CompletePairQuestion {
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: number;
  bodyJson: {
    type: "nvr_complete_pair";
    pairA: string;
    pairB: string;
    pairC: string;
    optionSvgs: string[];
  };
}

function makeCompletePairQuestion(
  pairA: string, pairB: string, pairC: string,
  opts: string[], correctIdx: number,
  explanation: string, difficulty: number
): CompletePairQuestion {
  return {
    questionText: "Complete the pair. The first two figures are related. Find the figure that goes with the third figure in the same way.",
    options: ["a", "b", "c", "d", "e"],
    correctAnswer: correctIdx,
    explanation,
    difficulty,
    bodyJson: { type: "nvr_complete_pair", pairA, pairB, pairC, optionSvgs: opts },
  };
}

// CP1: The two shapes swap outline types (dashed → solid)
const cp1 = makeCompletePairQuestion(
  wrapSvg(`<rect x="20" y="20" width="60" height="60" fill="none" stroke="black" stroke-width="2" stroke-dasharray="5,4"/><rect x="30" y="30" width="20" height="20" fill="none" stroke="black" stroke-width="2"/>`),
  wrapSvg(`<rect x="20" y="20" width="60" height="60" fill="none" stroke="black" stroke-width="2"/><rect x="30" y="30" width="20" height="20" fill="none" stroke="black" stroke-width="2" stroke-dasharray="5,4"/>`),
  wrapSvg(drawShape("triangle", "outline", 50, 55, 28) + `<polygon points="${shapePoints("triangle", 50, 58, 12)}" fill="none" stroke="black" stroke-width="2" stroke-dasharray="5,4"/>`),
  [
    wrapSvg(drawShape("triangle", "outline", 50, 55, 28) + drawShape("triangle", "outline", 50, 58, 12)),                                                        // a - both solid
    wrapSvg(`<polygon points="${shapePoints("triangle", 50, 55, 28)}" fill="none" stroke="black" stroke-width="2" stroke-dasharray="5,4"/>` + drawShape("triangle", "outline", 50, 58, 12)),  // b - correct (swap outlines)
    wrapSvg(drawShape("triangle", "solid", 50, 55, 28) + drawShape("triangle", "solid", 50, 58, 12)),                                                             // c - both solid fill
    wrapSvg(`<polygon points="${shapePoints("triangle", 50, 55, 28)}" fill="none" stroke="black" stroke-width="2" stroke-dasharray="5,4"/>` + `<polygon points="${shapePoints("triangle", 50, 58, 12)}" fill="none" stroke="black" stroke-width="2" stroke-dasharray="5,4"/>`), // d - both dashed
    wrapSvg(drawShape("square", "outline", 50, 50, 25) + `<polygon points="${shapePoints("square", 50, 50, 12)}" fill="none" stroke="black" stroke-width="2" stroke-dasharray="5,4"/>`),     // e - wrong shape
  ],
  1,
  "The dashed and solid outlines swap. The outer shape becomes dashed and the inner becomes solid. Option B applies this swap.",
  2
);

// CP2: Fill changes from half-black to all-black (outline → solid)
const cp2 = makeCompletePairQuestion(
  wrapSvg(`<circle cx="50" cy="50" r="28" fill="white" stroke="black" stroke-width="2"/><path d="M50,22 A28,28 0 0,1 50,78" fill="black"/>`),
  wrapSvg(drawShape("circle", "solid", 50, 50, 28)),
  wrapSvg(`<rect x="22" y="22" width="56" height="56" fill="white" stroke="black" stroke-width="2"/><rect x="50" y="22" width="28" height="56" fill="black" stroke="black" stroke-width="2"/>`),
  [
    wrapSvg(drawShape("square", "outline", 50, 50, 28)),      // a - outline
    wrapSvg(drawShape("square", "solid", 50, 50, 28)),        // b - correct (all solid)
    wrapSvg(drawShape("square", "grey", 50, 50, 28)),         // c - grey
    wrapSvg(`<rect x="22" y="22" width="56" height="56" fill="white" stroke="black" stroke-width="2"/><rect x="22" y="22" width="28" height="56" fill="black" stroke="black" stroke-width="2"/>`), // d - other half filled
    wrapSvg(drawShape("circle", "solid", 50, 50, 28)),        // e - wrong shape
  ],
  1,
  "The half-filled shape becomes fully filled (solid black). Apply the same transformation to the half-filled square.",
  1
);

// CP3: Shape rotates 90 degrees clockwise
const cp3 = makeCompletePairQuestion(
  wrapSvg(drawShape("triangle", "outline", 50, 55, 28, 0)),
  wrapSvg(drawShape("triangle", "outline", 50, 55, 28, 90)),
  wrapSvg(`<polygon points="50,20 80,50 50,80 20,50" fill="white" stroke="black" stroke-width="2"/><polygon points="50,20 65,35 50,50 35,35" fill="black"/>`),
  [
    wrapSvg(`<polygon points="50,20 80,50 50,80 20,50" fill="white" stroke="black" stroke-width="2"/><polygon points="65,35 80,50 65,65 50,50" fill="black"/>`),  // a - correct (rotated 90° CW)
    wrapSvg(`<polygon points="50,20 80,50 50,80 20,50" fill="white" stroke="black" stroke-width="2"/><polygon points="50,50 65,65 50,80 35,65" fill="black"/>`),  // b - rotated 180°
    wrapSvg(`<polygon points="50,20 80,50 50,80 20,50" fill="white" stroke="black" stroke-width="2"/><polygon points="20,50 35,35 50,50 35,65" fill="black"/>`),  // c - rotated 270°
    wrapSvg(`<polygon points="50,20 80,50 50,80 20,50" fill="white" stroke="black" stroke-width="2"/><polygon points="50,20 65,35 50,50 35,35" fill="black"/>`),  // d - no rotation
    wrapSvg(`<polygon points="50,20 80,50 50,80 20,50" fill="black" stroke="black" stroke-width="2"/>`),                                                            // e - all black
  ],
  0,
  "The shape rotates 90 degrees clockwise. The black quarter of the diamond should move to the right side.",
  2
);

// CP4: Shape gets an extra side and inner elements remove
const cp4 = makeCompletePairQuestion(
  wrapSvg(drawShape("triangle", "outline", 50, 55, 28) + drawDot(40, 55) + drawDot(60, 55) + drawDot(50, 42)),
  wrapSvg(drawShape("square", "outline", 50, 50, 25)),
  wrapSvg(drawShape("pentagon", "outline", 50, 50, 28) + drawDot(35, 45) + drawDot(65, 45) + drawDot(50, 60) + drawDot(40, 35) + drawDot(60, 35)),
  [
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 28)),     // a - same shape
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 28)),      // b - correct (extra side, no dots)
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 28) + drawDot(50, 50)),  // c - extra side but has dot
    wrapSvg(drawShape("square", "outline", 50, 50, 25)),       // d - too few sides
    wrapSvg(drawShape("circle", "outline", 50, 50, 28)),       // e - circle
  ],
  1,
  "The shape gains one extra side and all dots are removed. Pentagon (5) becomes hexagon (6), with no dots.",
  2
);

// CP5: Fills of overlapping hexagons swap and outline shrinks
const cp5 = makeCompletePairQuestion(
  wrapSvg(drawShape("hexagon", "solid", 50, 50, 30) + drawShape("hexagon", "outline", 50, 50, 15)),
  wrapSvg(drawShape("hexagon", "outline", 50, 50, 30) + drawShape("hexagon", "solid", 50, 50, 15)),
  wrapSvg(drawShape("triangle", "solid", 50, 55, 30) + drawShape("triangle", "outline", 50, 58, 14)),
  [
    wrapSvg(drawShape("triangle", "solid", 50, 55, 30) + drawShape("triangle", "solid", 50, 58, 14)),       // a - both solid
    wrapSvg(drawShape("triangle", "outline", 50, 55, 30) + drawShape("triangle", "outline", 50, 58, 14)),   // b - both outline
    wrapSvg(drawShape("triangle", "outline", 50, 55, 30) + drawShape("triangle", "solid", 50, 58, 14)),     // c - correct (fills swap)
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 30) + drawShape("hexagon", "solid", 50, 50, 15)),       // d - hexagons not triangles
    wrapSvg(drawShape("triangle", "grey", 50, 55, 30) + drawShape("triangle", "grey", 50, 58, 14)),         // e - both grey
  ],
  2,
  "The fills of the inner and outer shapes swap. Solid becomes outline and outline becomes solid.",
  1
);

// CP6: Reflection — shape reflects horizontally
const cp6 = makeCompletePairQuestion(
  wrapSvg(`<polygon points="30,25 70,25 70,75 30,75" fill="white" stroke="black" stroke-width="2"/><polygon points="30,25 50,50 30,75" fill="black"/>`),
  wrapSvg(`<polygon points="30,25 70,25 70,75 30,75" fill="white" stroke="black" stroke-width="2"/><polygon points="70,25 50,50 70,75" fill="black"/>`),
  wrapSvg(`<polygon points="25,30 75,30 75,70 25,70" fill="white" stroke="black" stroke-width="2"/><polygon points="25,30 50,50 75,30" fill="black"/>`),
  [
    wrapSvg(`<polygon points="25,30 75,30 75,70 25,70" fill="white" stroke="black" stroke-width="2"/><polygon points="25,70 50,50 75,70" fill="black"/>`),  // a - correct (reflected)
    wrapSvg(`<polygon points="25,30 75,30 75,70 25,70" fill="white" stroke="black" stroke-width="2"/><polygon points="25,30 50,50 25,70" fill="black"/>`),  // b - left side
    wrapSvg(`<polygon points="25,30 75,30 75,70 25,70" fill="white" stroke="black" stroke-width="2"/><polygon points="75,30 50,50 75,70" fill="black"/>`),  // c - right side
    wrapSvg(`<polygon points="25,30 75,30 75,70 25,70" fill="black" stroke="black" stroke-width="2"/>`),                                                      // d - all black
    wrapSvg(`<polygon points="25,30 75,30 75,70 25,70" fill="white" stroke="black" stroke-width="2"/><polygon points="25,30 50,50 75,30" fill="black"/>`),  // e - same as C (no change)
  ],
  0,
  "The black triangle reflects across the horizontal centre line. The top triangle becomes a bottom triangle.",
  2
);

// CP7: Size change — large becomes small, inner becomes outer
const cp7 = makeCompletePairQuestion(
  wrapSvg(drawShape("circle", "outline", 50, 50, 32) + drawShape("circle", "solid", 50, 50, 12)),
  wrapSvg(drawShape("circle", "solid", 50, 50, 32) + drawShape("circle", "outline", 50, 50, 12)),
  wrapSvg(drawShape("square", "outline", 50, 50, 28) + drawShape("square", "solid", 50, 50, 10)),
  [
    wrapSvg(drawShape("square", "solid", 50, 50, 28) + drawShape("square", "outline", 50, 50, 10)),    // a - correct
    wrapSvg(drawShape("square", "outline", 50, 50, 28) + drawShape("square", "outline", 50, 50, 10)),  // b - both outline
    wrapSvg(drawShape("square", "solid", 50, 50, 28) + drawShape("square", "solid", 50, 50, 10)),      // c - both solid
    wrapSvg(drawShape("circle", "solid", 50, 50, 28) + drawShape("circle", "outline", 50, 50, 10)),    // d - wrong shape
    wrapSvg(drawShape("square", "grey", 50, 50, 28) + drawShape("square", "grey", 50, 50, 10)),        // e - both grey
  ],
  0,
  "The fills swap — the outer shape becomes solid and the inner becomes outline. Apply the same to the squares.",
  1
);

// CP8: Add dots inside the shape equal to number of sides
const cp8 = makeCompletePairQuestion(
  wrapSvg(drawShape("triangle", "outline", 50, 55, 28)),
  wrapSvg(drawShape("triangle", "outline", 50, 55, 28) + drawDot(40, 55) + drawDot(60, 55) + drawDot(50, 40)),
  wrapSvg(drawShape("square", "outline", 50, 50, 25)),
  [
    wrapSvg(drawShape("square", "outline", 50, 50, 25) + drawDot(38, 38) + drawDot(62, 38) + drawDot(38, 62) + drawDot(62, 62)),    // a - 4 dots (correct)
    wrapSvg(drawShape("square", "outline", 50, 50, 25) + drawDot(40, 50) + drawDot(60, 50) + drawDot(50, 40)),                       // b - 3 dots
    wrapSvg(drawShape("square", "outline", 50, 50, 25) + drawDot(40, 50) + drawDot(60, 50)),                                          // c - 2 dots
    wrapSvg(drawShape("square", "solid", 50, 50, 25) + drawDot(38, 38, 4, "white") + drawDot(62, 38, 4, "white") + drawDot(38, 62, 4, "white") + drawDot(62, 62, 4, "white")), // d - solid with white dots
    wrapSvg(drawShape("square", "outline", 50, 50, 25) + drawDot(50, 50)),                                                             // e - 1 dot
  ],
  0,
  "Dots are added inside the shape equal to the number of sides. Triangle gets 3 dots, so square gets 4 dots.",
  2
);

// CP9: Shape becomes its outline and a smaller version appears inside
const cp9 = makeCompletePairQuestion(
  wrapSvg(drawShape("pentagon", "solid", 50, 50, 28)),
  wrapSvg(drawShape("pentagon", "outline", 50, 50, 28) + drawShape("pentagon", "solid", 50, 50, 12)),
  wrapSvg(drawShape("hexagon", "solid", 50, 50, 28)),
  [
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 28)),                                                   // a - just outline
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 28) + drawShape("hexagon", "solid", 50, 50, 12)),      // b - correct
    wrapSvg(drawShape("hexagon", "solid", 50, 50, 28) + drawShape("hexagon", "outline", 50, 50, 12)),      // c - fills wrong way
    wrapSvg(drawShape("hexagon", "outline", 50, 50, 28) + drawShape("pentagon", "solid", 50, 50, 12)),     // d - inner is wrong shape
    wrapSvg(drawShape("pentagon", "outline", 50, 50, 28) + drawShape("pentagon", "solid", 50, 50, 12)),    // e - wrong outer shape
  ],
  1,
  "The solid shape becomes an outline with a smaller solid version inside. Apply to the hexagon.",
  1
);

// CP10: Shapes swap positions and fills
const cp10 = makeCompletePairQuestion(
  wrapSvg(drawShape("circle", "solid", 30, 50, 18) + drawShape("square", "outline", 70, 50, 15)),
  wrapSvg(drawShape("square", "solid", 30, 50, 15) + drawShape("circle", "outline", 70, 50, 18)),
  wrapSvg(drawShape("triangle", "solid", 30, 55, 18) + drawShape("diamond", "outline", 70, 50, 15)),
  [
    wrapSvg(drawShape("diamond", "solid", 30, 50, 15) + drawShape("triangle", "outline", 70, 55, 18)),    // a - correct
    wrapSvg(drawShape("triangle", "outline", 30, 55, 18) + drawShape("diamond", "solid", 70, 50, 15)),    // b - swapped but fills wrong
    wrapSvg(drawShape("diamond", "outline", 30, 50, 15) + drawShape("triangle", "solid", 70, 55, 18)),    // c - fills not swapped
    wrapSvg(drawShape("triangle", "solid", 70, 55, 18) + drawShape("diamond", "outline", 30, 50, 15)),    // d - shapes swapped but fills same
    wrapSvg(drawShape("circle", "solid", 30, 50, 18) + drawShape("square", "outline", 70, 50, 15)),       // e - wrong shapes
  ],
  0,
  "The two shapes swap positions and the fills are preserved (left shape stays solid, right stays outline). Option A correctly swaps triangle and diamond.",
  3
);

const completePairQuestions: CompletePairQuestion[] = [
  cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10,
];

// ─── "Complete the Grid" Questions ───

interface CompleteGridQuestion {
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: number;
  bodyJson: {
    type: "nvr_complete_grid";
    gridItems: (string | null)[];
    gridSize: 2 | 3;
    missingIndex: number;
    optionSvgs: string[];
  };
}

function makeCompleteGridQuestion(
  gridItems: (string | null)[],
  gridSize: 2 | 3,
  missingIndex: number,
  opts: string[],
  correctIdx: number,
  explanation: string,
  difficulty: number
): CompleteGridQuestion {
  return {
    questionText: "Find the figure that completes the grid.",
    options: ["a", "b", "c", "d", "e"],
    correctAnswer: correctIdx,
    explanation,
    difficulty,
    bodyJson: { type: "nvr_complete_grid", gridItems, gridSize, missingIndex, optionSvgs: opts },
  };
}

// CG1: 2x2 grid — top row reflects to bottom row, fills swap
const cg1 = makeCompleteGridQuestion(
  [
    wrapSvg(drawShape("triangle", "solid", 50, 55, 28)),
    wrapSvg(drawShape("triangle", "outline", 50, 55, 28)),
    wrapSvg(drawShape("triangle", "outline", 50, 55, 28, 180)),
    null,  // missing: solid reflected triangle
  ],
  2, 3,
  [
    wrapSvg(drawShape("triangle", "outline", 50, 55, 28, 180)),  // a - outline
    wrapSvg(drawShape("triangle", "solid", 50, 55, 28)),          // b - not reflected
    wrapSvg(drawShape("triangle", "solid", 50, 55, 28, 180)),    // c - correct
    wrapSvg(drawShape("square", "solid", 50, 50, 25)),            // d - wrong shape
    wrapSvg(drawShape("triangle", "grey", 50, 55, 28, 180)),     // e - grey
  ],
  2,
  "Working from top to bottom, the shape reflects. Working from left to right, fills swap (solid↔outline). Missing is solid + reflected.",
  2
);

// CG2: 2x2 — shapes rotate 90° left to right, fills change top to bottom
const cg2 = makeCompleteGridQuestion(
  [
    wrapSvg(drawShape("square", "outline", 50, 50, 25) + drawDot(35, 35)),
    wrapSvg(drawShape("square", "outline", 50, 50, 25) + drawDot(65, 35)),
    wrapSvg(drawShape("square", "solid", 50, 50, 25) + drawDot(35, 35, 4, "white")),
    null,  // solid with dot top-right
  ],
  2, 3,
  [
    wrapSvg(drawShape("square", "solid", 50, 50, 25) + drawDot(35, 65, 4, "white")),  // a - dot bottom-left
    wrapSvg(drawShape("square", "outline", 50, 50, 25) + drawDot(65, 35)),              // b - outline
    wrapSvg(drawShape("square", "solid", 50, 50, 25) + drawDot(65, 35, 4, "white")),  // c - correct
    wrapSvg(drawShape("square", "solid", 50, 50, 25)),                                   // d - no dot
    wrapSvg(drawShape("square", "solid", 50, 50, 25) + drawDot(65, 65, 4, "white")),  // e - dot bottom-right
  ],
  2,
  "Left to right: the dot moves clockwise. Top to bottom: fill changes from outline to solid. Missing cell is solid with dot in top-right.",
  2
);

// CG3: 3x3 grid — each row has circle, square, triangle; each column has solid, outline, grey
const cg3 = (() => {
  const shapes: ShapeType[] = ["circle", "square", "triangle"];
  const fills: Fill[] = ["solid", "outline", "grey"];
  const grid: (string | null)[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const shapeIdx = (r + c) % 3;
      const fillIdx = c;
      const cy = shapes[shapeIdx] === "triangle" ? 55 : 50;
      grid.push(wrapSvg(drawShape(shapes[shapeIdx], fills[fillIdx], 50, cy, 28)));
    }
  }
  const missingIdx = 8; // bottom-right
  grid[missingIdx] = null;
  // Row 2 has: square(solid), triangle(outline), ?(grey)
  // Column 2 has: grey triangle, grey circle, ?(grey square)
  // So missing = square, grey

  return makeCompleteGridQuestion(
    grid, 3, missingIdx,
    [
      wrapSvg(drawShape("square", "grey", 50, 50, 28)),      // a - correct
      wrapSvg(drawShape("square", "outline", 50, 50, 28)),    // b - wrong fill
      wrapSvg(drawShape("triangle", "grey", 50, 55, 28)),     // c - wrong shape
      wrapSvg(drawShape("circle", "grey", 50, 50, 28)),       // d - wrong shape
      wrapSvg(drawShape("square", "solid", 50, 50, 28)),      // e - wrong fill
    ],
    0,
    "Each row has a circle, square, and triangle. Each column has a different fill (solid, outline, grey). Missing is a grey square.",
    2
  );
})();

// CG4: 2x2 — outer shape shrinks to fit inside star
const cg4 = makeCompleteGridQuestion(
  [
    wrapSvg(`<polygon points="50,15 61,40 90,40 67,55 77,80 50,65 23,80 33,55 10,40 39,40" fill="white" stroke="black" stroke-width="2"/><rect x="30" y="30" width="40" height="40" fill="none" stroke="black" stroke-width="2"/>`),
    wrapSvg(`<polygon points="50,15 61,40 90,40 67,55 77,80 50,65 23,80 33,55 10,40 39,40" fill="white" stroke="black" stroke-width="2"/><rect x="38" y="38" width="24" height="24" fill="none" stroke="black" stroke-width="2"/>`),
    wrapSvg(`<polygon points="50,15 61,40 90,40 67,55 77,80 50,65 23,80 33,55 10,40 39,40" fill="white" stroke="black" stroke-width="2"/><circle cx="50" cy="50" r="25" fill="none" stroke="black" stroke-width="2"/>`),
    null,
  ],
  2, 3,
  [
    wrapSvg(`<polygon points="50,15 61,40 90,40 67,55 77,80 50,65 23,80 33,55 10,40 39,40" fill="white" stroke="black" stroke-width="2"/><circle cx="50" cy="50" r="15" fill="none" stroke="black" stroke-width="2"/>`),  // a - correct
    wrapSvg(`<polygon points="50,15 61,40 90,40 67,55 77,80 50,65 23,80 33,55 10,40 39,40" fill="white" stroke="black" stroke-width="2"/><circle cx="50" cy="50" r="25" fill="none" stroke="black" stroke-width="2"/>`),  // b - same as C
    wrapSvg(`<polygon points="50,15 61,40 90,40 67,55 77,80 50,65 23,80 33,55 10,40 39,40" fill="white" stroke="black" stroke-width="2"/>`),                                                                                  // c - no inner shape
    wrapSvg(`<polygon points="50,15 61,40 90,40 67,55 77,80 50,65 23,80 33,55 10,40 39,40" fill="white" stroke="black" stroke-width="2"/><circle cx="50" cy="50" r="30" fill="none" stroke="black" stroke-width="2"/>`),  // d - circle bigger
    wrapSvg(drawShape("circle", "outline", 50, 50, 15)),                                                                                                                                                                         // e - no star
  ],
  0,
  "Working from top to bottom, the outer shape shrinks to fit inside the star. The square shrinks, so the circle should also shrink.",
  2
);

// CG5: 3x3 — each shape appears once per row/column, fill cycles
const cg5 = (() => {
  const grid = [
    wrapSvg(drawShape("circle", "solid", 50, 50, 25)),
    wrapSvg(drawShape("square", "outline", 50, 50, 22)),
    wrapSvg(drawShape("triangle", "grey", 50, 55, 25)),
    wrapSvg(drawShape("triangle", "outline", 50, 55, 25)),
    wrapSvg(drawShape("circle", "grey", 50, 50, 25)),
    wrapSvg(drawShape("square", "solid", 50, 50, 22)),
    wrapSvg(drawShape("square", "grey", 50, 50, 22)),
    wrapSvg(drawShape("triangle", "solid", 50, 55, 25)),
    null as string | null,  // circle, outline
  ];
  return makeCompleteGridQuestion(
    grid, 3, 8,
    [
      wrapSvg(drawShape("circle", "outline", 50, 50, 25)),    // a - correct
      wrapSvg(drawShape("circle", "solid", 50, 50, 25)),      // b - wrong fill
      wrapSvg(drawShape("circle", "grey", 50, 50, 25)),       // c - wrong fill
      wrapSvg(drawShape("square", "outline", 50, 50, 22)),    // d - wrong shape
      wrapSvg(drawShape("triangle", "outline", 50, 55, 25)),  // e - wrong shape
    ],
    0,
    "Each shape (circle, square, triangle) and each fill (solid, outline, grey) appears once in each row and column. Missing is an outline circle.",
    3
  );
})();

// CG6: 2x2 — cross rotates 45° L→R, small shape changes color T→B
const cg6 = makeCompleteGridQuestion(
  [
    wrapSvg(drawLine(25, 25, 75, 75) + drawLine(75, 25, 25, 75) + drawShape("circle", "outline", 50, 30, 6)),
    wrapSvg(drawLine(50, 20, 50, 80) + drawLine(20, 50, 80, 50) + drawShape("circle", "outline", 70, 50, 6)),
    wrapSvg(drawLine(25, 25, 75, 75) + drawLine(75, 25, 25, 75) + drawShape("circle", "solid", 50, 30, 6)),
    null,
  ],
  2, 3,
  [
    wrapSvg(drawLine(50, 20, 50, 80) + drawLine(20, 50, 80, 50) + drawShape("circle", "solid", 70, 50, 6)),    // a - correct
    wrapSvg(drawLine(50, 20, 50, 80) + drawLine(20, 50, 80, 50) + drawShape("circle", "outline", 70, 50, 6)),  // b - outline not solid
    wrapSvg(drawLine(25, 25, 75, 75) + drawLine(75, 25, 25, 75) + drawShape("circle", "solid", 50, 30, 6)),    // c - not rotated
    wrapSvg(drawLine(50, 20, 50, 80) + drawLine(20, 50, 80, 50) + drawShape("square", "solid", 70, 50, 6)),    // d - square not circle
    wrapSvg(drawLine(50, 20, 50, 80) + drawLine(20, 50, 80, 50)),                                                 // e - no small shape
  ],
  0,
  "Left to right: the cross rotates 45 degrees. Top to bottom: the small shape's fill changes from outline to solid. Missing is a rotated cross with solid dot.",
  2
);

// CG7: 3x3 — arrows point in different directions per row, black triangles in corners
const cg7 = (() => {
  const grid = [
    wrapSvg(drawShape("square", "outline", 50, 50, 30) + `<polygon points="50,28 45,40 55,40" fill="black"/>`),   // up
    wrapSvg(drawShape("square", "outline", 50, 50, 30) + `<polygon points="72,50 60,45 60,55" fill="black"/>`),   // right
    wrapSvg(drawShape("square", "outline", 50, 50, 30) + `<polygon points="50,72 45,60 55,60" fill="black"/>`),   // down
    wrapSvg(drawShape("square", "outline", 50, 50, 30) + `<polygon points="72,50 60,45 60,55" fill="black"/>`),   // right
    wrapSvg(drawShape("square", "outline", 50, 50, 30) + `<polygon points="50,72 45,60 55,60" fill="black"/>`),   // down
    wrapSvg(drawShape("square", "outline", 50, 50, 30) + `<polygon points="28,50 40,45 40,55" fill="black"/>`),   // left
    wrapSvg(drawShape("square", "outline", 50, 50, 30) + `<polygon points="50,72 45,60 55,60" fill="black"/>`),   // down
    wrapSvg(drawShape("square", "outline", 50, 50, 30) + `<polygon points="28,50 40,45 40,55" fill="black"/>`),   // left
    null as string | null,
  ];
  return makeCompleteGridQuestion(
    grid, 3, 8,
    [
      wrapSvg(drawShape("square", "outline", 50, 50, 30) + `<polygon points="50,28 45,40 55,40" fill="black"/>`),   // a - up (correct)
      wrapSvg(drawShape("square", "outline", 50, 50, 30) + `<polygon points="72,50 60,45 60,55" fill="black"/>`),   // b - right
      wrapSvg(drawShape("square", "outline", 50, 50, 30) + `<polygon points="50,72 45,60 55,60" fill="black"/>`),   // c - down
      wrapSvg(drawShape("square", "outline", 50, 50, 30) + `<polygon points="28,50 40,45 40,55" fill="black"/>`),   // d - left
      wrapSvg(drawShape("square", "outline", 50, 50, 30)),                                                             // e - no arrow
    ],
    0,
    "Each arrow direction appears once in each row and column. The missing cell needs an up-pointing arrow.",
    3
  );
})();

// CG8: 2x2 — each grid square rotates 90° anticlockwise
const cg8 = makeCompleteGridQuestion(
  [
    wrapSvg(`<rect x="20" y="20" width="60" height="60" fill="white" stroke="black" stroke-width="2"/><rect x="20" y="20" width="30" height="30" fill="black"/>`),
    wrapSvg(`<rect x="20" y="20" width="60" height="60" fill="white" stroke="black" stroke-width="2"/><rect x="50" y="20" width="30" height="30" fill="black"/>`),
    wrapSvg(`<rect x="20" y="20" width="60" height="60" fill="white" stroke="black" stroke-width="2"/><rect x="50" y="50" width="30" height="30" fill="black"/>`),
    null,
  ],
  2, 3,
  [
    wrapSvg(`<rect x="20" y="20" width="60" height="60" fill="white" stroke="black" stroke-width="2"/><rect x="20" y="50" width="30" height="30" fill="black"/>`),  // a - correct
    wrapSvg(`<rect x="20" y="20" width="60" height="60" fill="white" stroke="black" stroke-width="2"/><rect x="20" y="20" width="30" height="30" fill="black"/>`),  // b - same as first
    wrapSvg(`<rect x="20" y="20" width="60" height="60" fill="white" stroke="black" stroke-width="2"/><rect x="35" y="35" width="30" height="30" fill="black"/>`),  // c - centre
    wrapSvg(`<rect x="20" y="20" width="60" height="60" fill="black" stroke="black" stroke-width="2"/>`),                                                              // d - all black
    wrapSvg(`<rect x="20" y="20" width="60" height="60" fill="white" stroke="black" stroke-width="2"/><rect x="50" y="50" width="30" height="30" fill="black"/>`),  // e - same as third
  ],
  0,
  "The black square moves clockwise around the corners: top-left → top-right → bottom-right → bottom-left.",
  1
);

const completeGridQuestions: CompleteGridQuestion[] = [
  cg1, cg2, cg3, cg4, cg5, cg6, cg7, cg8,
];

// ─── "Vertical Code" Questions ───

interface VerticalCodeQuestion {
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: number;
  bodyJson: {
    type: "nvr_vertical_code";
    codeItems: Array<{ svg: string; code: string }>;
    questionSvg: string;
    optionCodes: string[];
  };
}

function makeVerticalCodeQuestion(
  codeItems: Array<{ svg: string; code: string }>,
  questionSvg: string,
  optionCodes: string[],
  correctIdx: number,
  explanation: string,
  difficulty: number
): VerticalCodeQuestion {
  return {
    questionText: "Work out the code for the figure shown.",
    options: ["a", "b", "c", "d", "e"],
    correctAnswer: correctIdx,
    explanation,
    difficulty,
    bodyJson: { type: "nvr_vertical_code", codeItems, questionSvg, optionCodes },
  };
}

// VC1: Shape = first letter (P=circle, S=dotted circle, R=dashed circle), Size = second letter (X=large, Y=small)
const vc1 = makeVerticalCodeQuestion(
  [
    { svg: wrapSvg(drawShape("circle", "outline", 50, 50, 30)), code: "PX" },
    { svg: wrapSvg(`<circle cx="50" cy="50" r="22" fill="white" stroke="black" stroke-width="2" stroke-dasharray="2,3"/>`), code: "SY" },
    { svg: wrapSvg(`<circle cx="50" cy="50" r="30" fill="white" stroke="black" stroke-width="2" stroke-dasharray="6,4"/>`), code: "RX" },
  ],
  wrapSvg(`<circle cx="50" cy="50" r="22" fill="white" stroke="black" stroke-width="2"/>`),
  ["SX", "SR", "PY", "PX", "RY"],
  2,  // PY — solid outline (P), small (Y)
  "P = solid outline, S = dotted outline, R = dashed outline. X = large, Y = small. The figure is a small solid-outline circle = PY.",
  1
);

// VC2: Fill = first letter (K=hatched, L=diagonal), Shape = second letter (P=square, R=circle)
const vc2 = makeVerticalCodeQuestion(
  [
    { svg: wrapSvg(drawShape("square", "hatched", 50, 50, 25, 0, "hvc2a")), code: "KP" },
    { svg: wrapSvg(`<defs><pattern id="hvc2b" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(0)"><line x1="0" y1="0" x2="0" y2="8" stroke="black" stroke-width="2"/></pattern></defs><circle cx="50" cy="50" r="25" fill="url(#hvc2b)" stroke="black" stroke-width="2"/>`), code: "KR" },
    { svg: wrapSvg(`<defs><pattern id="hvc2c" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(135)"><line x1="0" y1="0" x2="0" y2="8" stroke="black" stroke-width="2"/></pattern></defs><rect x="25" y="25" width="50" height="50" fill="url(#hvc2c)" stroke="black" stroke-width="2"/>`), code: "LP" },
  ],
  wrapSvg(`<defs><pattern id="hvc2q" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(0)"><line x1="0" y1="0" x2="0" y2="8" stroke="black" stroke-width="2"/></pattern></defs><rect x="25" y="25" width="50" height="50" fill="url(#hvc2q)" stroke="black" stroke-width="2"/>`),
  ["KP", "LP", "KR", "PR", "LR"],
  0,  // KP — vertical lines (K), square (P)
  "K = vertical/horizontal hatching, L = diagonal hatching. P = square, R = circle. The figure has vertical hatching on a square = KP.",
  2
);

// VC3: Outer shape = first letter (A=triangle, B=pentagon), Inner fill = second letter (X=solid, Y=outline)
const vc3 = makeVerticalCodeQuestion(
  [
    { svg: wrapSvg(drawShape("triangle", "outline", 50, 55, 30) + drawShape("triangle", "solid", 50, 58, 12)), code: "AX" },
    { svg: wrapSvg(drawShape("pentagon", "outline", 50, 50, 30) + drawShape("square", "outline", 50, 50, 12)), code: "BY" },
    { svg: wrapSvg(drawShape("pentagon", "outline", 50, 50, 30) + drawShape("hexagon", "solid", 50, 50, 12)), code: "BX" },
  ],
  wrapSvg(drawShape("triangle", "outline", 50, 55, 30) + drawShape("circle", "outline", 50, 55, 10)),
  ["XY", "AX", "BY", "BX", "AY"],
  4,  // AY — triangle outer (A), outline inner (Y)
  "A = triangle outer, B = pentagon outer. X = solid inner, Y = outline inner. The figure has triangle outer + outline inner = AY.",
  1
);

// VC4: Arrow direction = first letter (S=left, R=down, P=right), Size = second letter (X=small, Y=medium, Z=large)
const vc4 = makeVerticalCodeQuestion(
  [
    { svg: wrapSvg(`<polygon points="15,50 35,40 35,45 55,45 55,55 35,55 35,60" fill="white" stroke="black" stroke-width="2"/><rect x="60" y="42" width="12" height="16" fill="#999" stroke="black" stroke-width="1.5"/>`), code: "SZ" },
    { svg: wrapSvg(`<g transform="rotate(90,50,50)"><polygon points="22,50 38,42 38,46 58,46 58,54 38,54 38,58" fill="white" stroke="black" stroke-width="2"/></g><circle cx="50" cy="75" r="6" fill="#999" stroke="black" stroke-width="1.5"/>`), code: "RX" },
    { svg: wrapSvg(`<polygon points="85,50 65,40 65,45 45,45 45,55 65,55 65,60" fill="white" stroke="black" stroke-width="2"/><rect x="28" y="42" width="12" height="16" fill="#999" stroke="black" stroke-width="1.5"/>`), code: "RY" },
    { svg: wrapSvg(`<polygon points="85,50 70,43 70,46 55,46 55,54 70,54 70,57" fill="white" stroke="black" stroke-width="2"/><circle cx="42" cy="50" r="4" fill="#999" stroke="black" stroke-width="1.5"/>`), code: "PY" },
  ],
  wrapSvg(`<polygon points="15,50 30,43 30,46 45,46 45,54 30,54 30,57" fill="white" stroke="black" stroke-width="2"/>`),
  ["SX", "PX", "RZ", "PZ", "SY"],
  0,  // SX — left arrow (S), small (X)
  "S = left arrow, R = down arrow, P = right arrow. X = small, Y = medium, Z = large. The figure is a small left arrow = SX.",
  2
);

// VC5: Number of shapes = first letter (F=2, G=3), Dot position = second letter (N=left, M=right), Size = third letter (X=large, Y=small)
const vc5 = makeVerticalCodeQuestion(
  [
    { svg: wrapSvg(`<rect x="15" y="25" width="20" height="50" fill="white" stroke="black" stroke-width="2"/><rect x="40" y="25" width="20" height="50" fill="white" stroke="black" stroke-width="2"/>` + drawDot(72, 50)), code: "FNX" },
    { svg: wrapSvg(`<rect x="15" y="30" width="15" height="40" fill="white" stroke="black" stroke-width="2"/><rect x="33" y="30" width="15" height="40" fill="white" stroke="black" stroke-width="2"/><rect x="51" y="30" width="15" height="40" fill="white" stroke="black" stroke-width="2"/>` + drawDot(75, 50)), code: "GNY" },
    { svg: wrapSvg(`<rect x="35" y="25" width="20" height="50" fill="white" stroke="black" stroke-width="2"/><rect x="60" y="25" width="20" height="50" fill="white" stroke="black" stroke-width="2"/>` + drawDot(20, 50)), code: "FMY" },
  ],
  wrapSvg(`<rect x="20" y="30" width="15" height="40" fill="white" stroke="black" stroke-width="2"/><rect x="38" y="30" width="15" height="40" fill="white" stroke="black" stroke-width="2"/><rect x="56" y="30" width="15" height="40" fill="white" stroke="black" stroke-width="2"/>` + drawDot(15, 50)),
  ["FNY", "GNY", "FNX", "FMY", "GNX"],
  3,  // GNX — wait let me reconsider... dot is on left so M? No wait:
  // Looking at FNX: dot on right = N? That's confusing. Let me re-check:
  // FNX: 2 shapes, dot on RIGHT => N=right?
  // GNY: 3 shapes, dot on RIGHT => N=right
  // FMY: 2 shapes, dot on LEFT => M=left
  // Question: 3 shapes, dot on LEFT => G, M
  // But size: original FNX has larger rects, so X=large. GNY has smaller, Y=small. FMY has medium = Y?
  // Question figure has small rects => Y? No, they're medium...
  // This is getting confusing. Let me simplify.
  "F = 2 shapes, G = 3 shapes. N = dot on right, M = dot on left. X = large, Y = small. The figure has 3 small shapes with dot on left = GMY. Closest option is FMY but with G.",
  3
);

// Let me redo VC5 more cleanly
const vc5_clean = makeVerticalCodeQuestion(
  [
    { svg: wrapSvg(drawShape("circle", "outline", 50, 50, 28) + drawDot(50, 50)), code: "PX" },
    { svg: wrapSvg(drawShape("hexagon", "outline", 50, 50, 28) + drawDot(50, 50)), code: "QX" },
    { svg: wrapSvg(drawShape("circle", "outline", 50, 50, 18) + drawDot(50, 50)), code: "PY" },
    { svg: wrapSvg(drawShape("square", "outline", 50, 50, 25) + drawDot(50, 50)), code: "RX" },
  ],
  wrapSvg(drawShape("square", "outline", 50, 50, 16) + drawDot(50, 50)),
  ["PY", "QY", "RY", "RX", "PX"],
  2,  // RY — square (R), small (Y)
  "P = circle, Q = hexagon, R = square. X = large, Y = small. The figure is a small square = RY.",
  1
);

// VC6: Shape container = first letter (G=circle, H=oval, J=square, K=diamond), Inner pattern = second letter (L=star, P=cross, X=hexagonal)
const vc6 = makeVerticalCodeQuestion(
  [
    { svg: wrapSvg(drawShape("circle", "outline", 50, 50, 30) + `<polygon points="50,30 55,42 68,42 58,50 62,62 50,54 38,62 42,50 32,42 45,42" fill="none" stroke="black" stroke-width="1.5"/>`), code: "GL" },
    { svg: wrapSvg(`<rect x="22" y="22" width="56" height="56" fill="white" stroke="black" stroke-width="2"/><polygon points="50,30 55,42 68,42 58,50 62,62 50,54 38,62 42,50 32,42 45,42" fill="none" stroke="black" stroke-width="1.5"/>`), code: "JP" },
    { svg: wrapSvg(drawShape("diamond", "outline", 50, 50, 30) + drawLine(40, 50, 60, 50) + drawLine(50, 40, 50, 60)), code: "KX" },
    { svg: wrapSvg(drawShape("circle", "outline", 50, 50, 30) + drawLine(40, 50, 60, 50) + drawLine(50, 40, 50, 60)), code: "HL" },
  ],
  wrapSvg(drawShape("diamond", "outline", 50, 50, 30) + `<polygon points="50,35 53,43 62,43 55,48 58,56 50,51 42,56 45,48 38,43 47,43" fill="none" stroke="black" stroke-width="1.5"/>`),
  ["KL", "JX", "KP", "JL", "HP"],
  0,  // KL — diamond (K), star (L)
  "G = circle, H = oval, J = square, K = diamond. L = star pattern, P = cross pattern, X = hexagonal pattern. Diamond + star = KL.",
  2
);

// VC7: Cross rotation = first letter (A-D), Dot count = second letter (U=1, V=2)
const vc7 = makeVerticalCodeQuestion(
  [
    { svg: wrapSvg(drawShape("circle", "outline", 50, 50, 28) + drawLine(35, 35, 65, 65) + drawLine(65, 35, 35, 65) + drawDot(50, 28, 3)), code: "DU" },
    { svg: wrapSvg(drawShape("circle", "outline", 50, 50, 28) + drawLine(35, 35, 65, 65) + drawLine(65, 35, 35, 65) + drawDot(42, 28, 3) + drawDot(58, 28, 3)), code: "BU" },
    { svg: wrapSvg(drawShape("circle", "outline", 50, 50, 28) + drawLine(50, 22, 50, 78) + drawLine(22, 50, 78, 50) + drawDot(72, 50, 3) + drawDot(50, 72, 3) + drawDot(28, 50, 3)), code: "AW" },
    { svg: wrapSvg(drawShape("circle", "outline", 50, 50, 28) + drawLine(50, 22, 50, 78) + drawLine(22, 50, 78, 50) + drawDot(50, 28, 3) + drawDot(72, 50, 3)), code: "CV" },
  ],
  wrapSvg(drawShape("circle", "outline", 50, 50, 28) + drawLine(35, 35, 65, 65) + drawLine(65, 35, 35, 65) + drawDot(42, 72, 3) + drawDot(58, 72, 3)),
  ["AU", "BU", "BV", "CU", "DV"],
  2,  // BV — diagonal cross (B), 2 dots (V)
  "A,B,C,D = different cross rotations. U = one dot, V = two dots, W = three dots. Diagonal cross + 2 dots = BV.",
  2
);

// VC8: Shape arrangement = first letter (A=triangle+circle+square, B=circle+square+triangle...), Fill = second letter (S=solid, P=outline, R=mixed)
const vc8 = makeVerticalCodeQuestion(
  [
    { svg: wrapSvg(drawShape("triangle", "solid", 25, 55, 14) + drawShape("circle", "solid", 50, 50, 12) + drawShape("square", "solid", 75, 50, 11)), code: "AS" },
    { svg: wrapSvg(drawShape("triangle", "outline", 25, 55, 14) + drawShape("circle", "outline", 50, 50, 12) + drawShape("square", "outline", 75, 50, 11)), code: "BP" },
    { svg: wrapSvg(drawShape("square", "solid", 25, 50, 11) + drawShape("triangle", "solid", 50, 55, 14) + drawShape("circle", "solid", 75, 50, 12)), code: "AR" },
    { svg: wrapSvg(drawShape("square", "outline", 25, 50, 11) + drawShape("triangle", "outline", 50, 55, 14) + drawShape("circle", "outline", 75, 50, 12)), code: "AS" },
  ],
  wrapSvg(`<rect x="18" y="40" width="16" height="16" fill="none" stroke="black" stroke-width="2"/><circle cx="50" cy="48" r="10" fill="none" stroke="black" stroke-width="2"/>` + drawShape("triangle", "outline", 75, 50, 12)),
  ["BR", "BS", "AR", "BP", "AP"],
  3,  // BP — all outline (P)
  "A = specific arrangement, B = alternative arrangement. S = all solid, P = all outline, R = mixed fills. All outline shapes = BP.",
  3
);

const verticalCodeQuestions: VerticalCodeQuestion[] = [
  vc1, vc2, vc3, vc4, vc5_clean, vc6, vc7, vc8,
];

// ─── Insert into database ───

type AnyQuestion = { questionText: string; options: string[]; correctAnswer: number; explanation: string; difficulty: number; bodyJson: any };

const allQuestionSets: Array<{ questions: AnyQuestion[]; topicId: string; questionType: string; tag: string }> = [
  { questions: findFigureQuestions, topicId: "top_shapes", questionType: "nvr_find_figure", tag: "find_figure" },
  { questions: findFigureThreeQuestions, topicId: "top_shapes", questionType: "nvr_find_figure_three", tag: "find_figure_three" },
  { questions: oddOneOutQuestions, topicId: "top_shapes", questionType: "nvr_odd_one_out", tag: "odd_one_out" },
  { questions: seriesQuestions, topicId: "top_spatial", questionType: "nvr_complete_series", tag: "complete_series" },
  { questions: completePairQuestions, topicId: "top_spatial", questionType: "nvr_complete_pair", tag: "complete_pair" },
  { questions: completeGridQuestions, topicId: "top_spatial", questionType: "nvr_complete_grid", tag: "complete_grid" },
  { questions: verticalCodeQuestions, topicId: "top_spatial", questionType: "nvr_vertical_code", tag: "vertical_code" },
];

let totalCount = 0;
for (const { questions, topicId, questionType, tag } of allQuestionSets) {
  console.log(`Inserting ${questions.length} ${questionType} questions...`);
  for (const q of questions) {
    await prisma.question.create({
      data: {
        topicId,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        bodyJson: q.bodyJson,
        tags: ["non_verbal_reasoning", "nvr", tag, "GL"],
        type: "mcq",
        ageRange: "10-11",
        examBoard: "GL",
        questionType,
      },
    });
  }
  console.log(`✅ Added ${questions.length} ${questionType} questions`);
  totalCount += questions.length;
}

console.log(`\n🎉 Total: ${totalCount} GL NVR questions added!`);

await prisma.$disconnect();
