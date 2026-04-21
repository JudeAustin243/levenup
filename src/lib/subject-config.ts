// Shared subject colors and icon mappings used across all pages

export const subjectColors: Record<string, { bg: string; text: string; light: string; border: string }> = {
  maths:                  { bg: "bg-red-600",    text: "text-red-600",    light: "bg-red-50",    border: "border-red-200" },
  english:                { bg: "bg-blue-600",   text: "text-blue-600",   light: "bg-blue-50",   border: "border-blue-200" },
  "verbal-reasoning":     { bg: "bg-green-600",  text: "text-green-600",  light: "bg-green-50",  border: "border-green-200" },
  "non-verbal-reasoning": { bg: "bg-orange-500", text: "text-orange-500", light: "bg-orange-50", border: "border-orange-200" },
};

export function getSubjectColors(slug: string) {
  return subjectColors[slug] || subjectColors.maths;
}

// Icon name mapping for use in SubjectIcon component
export const subjectIconName: Record<string, string> = {
  maths: "divide",
  english: "book-open",
  "verbal-reasoning": "cog",
  "non-verbal-reasoning": "puzzle",
};
