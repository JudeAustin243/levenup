export interface SubTopic {
  id: string;
  name: string;
  description: string;
  questionCount: number;
}

export interface TopicGroup {
  id: string;
  name: string;
  icon: string; // lucide icon name
  color: string; // tailwind color token
  subTopics: SubTopic[];
}

export interface ExamBoard {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  topicGroups: TopicGroup[];
}

function totalQuestions(groups: TopicGroup[]): number {
  return groups.reduce(
    (sum, g) => sum + g.subTopics.reduce((s, t) => s + t.questionCount, 0),
    0,
  );
}

const alphabetGroup: TopicGroup = {
  id: "alphabet-letters",
  name: "Alphabet & Letter Sequences",
  icon: "Type",
  color: "topic-blue",
  subTopics: [
    { id: "alphabet-series", name: "Alphabet Series", description: "Continue letter patterns in the right order", questionCount: 25 },
    { id: "alphabetical-order", name: "Alphabetical Order", description: "Put words in the correct A–Z order", questionCount: 20 },
    { id: "letter-sequences", name: "Letter Sequences", description: "Spot and extend letter patterns", questionCount: 30 },
  ],
};

const wordBuildingGroup: TopicGroup = {
  id: "word-building",
  name: "Word Building & Spelling",
  icon: "Puzzle",
  color: "topic-purple",
  subTopics: [
    { id: "anagram", name: "Anagram", description: "Rearrange letters to make a real word", questionCount: 20 },
    { id: "compound-words", name: "Compound Words", description: "Join two words to make a new one", questionCount: 18 },
    { id: "forming-new-words", name: "Forming New Words", description: "Create new words from given letters", questionCount: 22 },
    { id: "four-letter-completion", name: "Four Letter Completion", description: "Find the four-letter word that fits", questionCount: 15 },
    { id: "hidden-words", name: "Hidden Words", description: "Spot words hiding inside a sentence", questionCount: 25 },
    { id: "missing-letters", name: "Missing Letters", description: "Fill in the blanks to complete words", questionCount: 20 },
    { id: "move-a-letter", name: "Move A Letter", description: "Shift one letter to fix both words", questionCount: 15 },
  ],
};

const wordMeaningsGroup: TopicGroup = {
  id: "word-meanings",
  name: "Word Meanings",
  icon: "BookOpen",
  color: "topic-teal",
  subTopics: [
    { id: "multiple-meanings", name: "Multiple Meanings", description: "Find the word that has more than one meaning", questionCount: 20 },
    { id: "synonyms-antonyms", name: "Synonyms & Antonyms", description: "Match words with similar or opposite meanings", questionCount: 28 },
    { id: "odd-one-out", name: "Odd One Out", description: "Find the word that doesn't belong", questionCount: 22 },
  ],
};

const codesGroup: TopicGroup = {
  id: "codes-equations",
  name: "Codes & Equations",
  icon: "KeyRound",
  color: "topic-orange",
  subTopics: [
    { id: "letter-equations", name: "Letter Equations", description: "Solve equations using letter values", questionCount: 18 },
    { id: "letter-word-codes", name: "Letter Word Codes", description: "Crack the code by matching letters", questionCount: 22 },
    { id: "missing-number-equations", name: "Missing Number Equations", description: "Find the missing number in the equation", questionCount: 20 },
  ],
};

const logicGroup: TopicGroup = {
  id: "logic-puzzles",
  name: "Logic & Puzzles",
  icon: "Lightbulb",
  color: "topic-amber",
  subTopics: [
    { id: "logic-puzzles", name: "Logic Puzzles", description: "Use clues to work out the answer", questionCount: 25 },
    { id: "analogies", name: "Analogies", description: "Find the connection between pairs of words", questionCount: 28 },
    { id: "comprehension", name: "Comprehension", description: "Read a passage and answer questions", questionCount: 20 },
  ],
};

const allTopicGroups: TopicGroup[] = [
  alphabetGroup,
  wordBuildingGroup,
  wordMeaningsGroup,
  codesGroup,
  logicGroup,
];

// Scale question counts for a board variant
function scaleGroups(groups: TopicGroup[], factor: number): TopicGroup[] {
  return groups.map((g) => ({
    ...g,
    subTopics: g.subTopics.map((st) => ({
      ...st,
      questionCount: Math.round(st.questionCount * factor),
    })),
  }));
}

export const glAssessment: ExamBoard = {
  id: "gl-assessment",
  name: "GL Assessment",
  subtitle: "Official-style GL practice by topic",
  description: "Practice questions in the style of GL Assessment papers",
  icon: "GraduationCap",
  topicGroups: allTopicGroups,
};

export const cemPractice: ExamBoard = {
  id: "cem-practice",
  name: "CEM Practice",
  subtitle: "Practice for CEM-style questions",
  description: "Build your skills with CEM-style verbal reasoning",
  icon: "Brain",
  topicGroups: scaleGroups(allTopicGroups, 0.8),
};

export const isebPractice: ExamBoard = {
  id: "iseb-practice",
  name: "ISEB Practice",
  subtitle: "Practice for ISEB pre-test questions",
  description: "Get ready for ISEB pre-test verbal reasoning",
  icon: "ClipboardList",
  topicGroups: scaleGroups(allTopicGroups, 0.7),
};

export const generalPractice: ExamBoard = {
  id: "general-practice",
  name: "General Practice",
  subtitle: "Mixed-topic practice across all boards",
  description: "Extra practice not tied to any specific exam board",
  icon: "BookOpen",
  topicGroups: scaleGroups(allTopicGroups, 0.3),
};

export const examBoards: ExamBoard[] = [glAssessment, cemPractice, isebPractice];

export function getBoardTotalQuestions(board: ExamBoard): number {
  return totalQuestions(board.topicGroups);
}

export function getTopicGroupTotal(group: TopicGroup): number {
  return group.subTopics.reduce((s, t) => s + t.questionCount, 0);
}
