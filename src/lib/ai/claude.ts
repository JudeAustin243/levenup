import Anthropic from "@anthropic-ai/sdk";
import type { AxisScores } from "../hexagon";

const getClient = () =>
  new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

interface ScheduleSession {
  subject: string;
  topic: string;
  durationMins: number;
  questionCount: number;
  focus: string;
}

interface ScheduleDay {
  dayOfWeek: string;
  date: string;
  sessions: ScheduleSession[];
}

export interface GeneratedSchedule {
  days: ScheduleDay[];
}

export interface SubjectTopics {
  name: string;
  topics: string[];
}

export async function generateSchedule(params: {
  hexagonScores: AxisScores;
  examDate: string | null;
  examBoard: string | null;
  childAge: number | null;
  childName: string;
  subjectTopics: SubjectTopics[];
}): Promise<GeneratedSchedule> {
  const { hexagonScores, examDate, examBoard, childName, subjectTopics } = params;

  const daysUntilExam = examDate
    ? Math.ceil(
        (new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null;

  const weakAreas = Object.entries(hexagonScores)
    .filter(([, score]) => score < 60)
    .map(([axis]) => axis);

  const strongAreas = Object.entries(hexagonScores)
    .filter(([, score]) => score >= 70)
    .map(([axis]) => axis);

  const today = new Date();
  const weekDays: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    weekDays.push(d.toISOString().split("T")[0]);
  }

  const prompt = `You are an expert 11+ exam tutor. Generate a personalised 7-day study schedule for ${childName}.

${examBoard ? `Exam board: ${examBoard}` : "Exam board: General 11+"}
${daysUntilExam ? `Days until exam: ${daysUntilExam}` : "No exam date set"}

Current hexagon profile scores (0-100):
- Mathematical Reasoning: ${hexagonScores.mathsReasoning}
- Numerical Fluency: ${hexagonScores.numericalFluency}
- English Comprehension: ${hexagonScores.english}
- Verbal Reasoning: ${hexagonScores.verbalReasoning}
- Non-Verbal Reasoning: ${hexagonScores.nonVerbalReasoning}
- Exam Technique & Speed: ${hexagonScores.examTechnique}

Weak areas (prioritise): ${weakAreas.length > 0 ? weakAreas.join(", ") : "None identified yet"}
Strong areas (maintain): ${strongAreas.length > 0 ? strongAreas.join(", ") : "None identified yet"}

Rules:
- EXACTLY 3 sessions per day, each from a DIFFERENT subject
- Each session should be 15-25 minutes with 15 questions
- Rotate through all 4 subjects across the week so each gets good coverage
- Weight more sessions towards weak areas
- Subjects and their available topics (ONLY use these exact topic names):
${subjectTopics.map((s) => `- ${s.name}: ${s.topics.join(", ")}`).join("\n")}
- Pick a different topic each session — vary topics across the week
${daysUntilExam && daysUntilExam < 42 ? "- Exam is close! Include more intensive revision and mock practice." : ""}

Dates for this week: ${weekDays.join(", ")}

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{"days":[{"dayOfWeek":"Monday","date":"2026-02-23","sessions":[{"subject":"Maths","topic":"Fractions & Decimals","durationMins":20,"questionCount":15,"focus":"Fractions of amounts and remainders"},{"subject":"English","topic":"Word Classes","durationMins":20,"questionCount":15,"focus":"Identifying nouns, verbs and adjectives"},{"subject":"Verbal Reasoning","topic":"Word Building & Spelling","durationMins":20,"questionCount":15,"focus":"Anagrams and compound words"}]}]}`;

  if (!process.env.ANTHROPIC_API_KEY) {
    return generateFallbackSchedule(weekDays, hexagonScores, subjectTopics);
  }

  try {
    const client = getClient();
    const message = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const parsed = JSON.parse(text);
    return parsed as GeneratedSchedule;
  } catch {
    return generateFallbackSchedule(weekDays, hexagonScores, subjectTopics);
  }
}

function generateFallbackSchedule(
  weekDays: string[],
  _scores: AxisScores,
  subjectTopics: SubjectTopics[]
): GeneratedSchedule {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const subjects = subjectTopics.length > 0
    ? subjectTopics
    : [
        { name: "Maths", topics: ["Fractions & Decimals"] },
        { name: "English", topics: ["Word Classes"] },
        { name: "Verbal Reasoning", topics: ["Word Building & Spelling"] },
        { name: "Non-Verbal Reasoning", topics: ["Complete Series"] },
      ];

  return {
    days: weekDays.map((date, dayIdx) => {
      const dayOfWeek = dayNames[new Date(date).getDay()];

      // Pick 3 different subjects for this day, rotating the starting point
      const sessions: ScheduleSession[] = [];
      for (let s = 0; s < 3; s++) {
        const subject = subjects[(dayIdx + s) % subjects.length];
        const topic = subject.topics[(dayIdx + s) % subject.topics.length];
        sessions.push({
          subject: subject.name,
          topic,
          durationMins: 20,
          questionCount: 15,
          focus: "Practice and revision",
        });
      }

      return { dayOfWeek, date, sessions };
    }),
  };
}
