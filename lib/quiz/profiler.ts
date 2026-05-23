import type { Question } from "./questions";

export interface ResultProfile {
  weaknesses: string[];
  recommendedTechniques: string[];
  studyStyle: "visual" | "written" | "practice-based";
  sessionPreference: "short_frequent" | "long_infrequent";
  notes: string;
}

const TAG_TECHNIQUES: Record<string, string[]> = {
  time_management: ["timed_practice"],
  last_minute: ["past_paper_drilling"],
  inconsistent: ["streak_building", "daily_goals"],
  no_self_testing: ["active_recall"],
  rote_memorisation: ["blurting", "mind_maps"],
  conceptual_gaps: ["mind_maps", "blurting"],
  exam_anxiety: ["timed_practice", "daily_goals"],
  performance_pressure: ["timed_practice"],
  numerical_struggle: ["past_paper_drilling", "timed_practice"],
  theory_struggle: ["blurting", "mind_maps"],
  memorisation_struggle: ["flashcards", "active_recall"],
  procrastination: ["streak_building", "daily_goals"],
  avoidant: ["blurting", "active_recall"],
  easily_distracted: ["daily_goals", "streak_building"],
  streak_building_needed: ["streak_building", "daily_goals"],
  short_attention: ["daily_goals"],
  no_flashcard_experience: ["flashcards"],
};

const WEAKNESS_LABELS: Record<string, string> = {
  time_management: "Time Management",
  last_minute: "Last-Minute Cramming",
  inconsistent: "Inconsistent Study Habits",
  no_self_testing: "Lack of Self-Testing",
  rote_memorisation: "Rote Memorisation",
  conceptual_gaps: "Conceptual Gaps",
  exam_anxiety: "Exam Anxiety",
  performance_pressure: "Performance Pressure",
  numerical_struggle: "Numerical Difficulty",
  theory_struggle: "Theory Difficulty",
  memorisation_struggle: "Memorisation Difficulty",
  procrastination: "Procrastination",
  avoidant: "Avoidance of Mistakes",
  easily_distracted: "Easily Distracted",
  short_attention: "Short Attention Span",
  streak_building_needed: "Lack of Consistency",
  no_flashcard_experience: "Unfamiliar with Flashcards",
};

const TECHNIQUE_META: Record<string, { name: string; description: string }> = {
  flashcards: { name: "Flashcards", description: "Use digital flashcards for spaced repetition of key facts" },
  active_recall: { name: "Active Recall", description: "Test yourself regularly instead of re-reading notes" },
  timed_practice: { name: "Timed Practice", description: "Solve past papers under exam conditions to build speed" },
  blurting: { name: "Blurting", description: "Write everything you remember about a topic, then check gaps" },
  mind_maps: { name: "Mind Maps", description: "Visualise connections between concepts for deeper understanding" },
  past_paper_drilling: { name: "Past Paper Drilling", description: "Focus on exam-style questions to spot patterns and improve technique" },
  streak_building: { name: "Streak Building", description: "Study a little every day to build momentum and consistency" },
  daily_goals: { name: "Daily Goals", description: "Set small daily targets to stay on track and avoid overwhelm" },
};

export function generateProfile(
  answers: Record<number, string>,
  quizQuestions: Question[]
): ResultProfile {
  const tagCounts: Record<string, number> = {};

  for (const [qIdStr, value] of Object.entries(answers)) {
    const qId = Number(qIdStr);
    const question = quizQuestions.find((q) => q.id === qId);
    if (!question) continue;
    const option = question.options.find((o) => o.value === value);
    if (!option) continue;
    for (const tag of option.tags) {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    }
  }

  const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  const used = new Set<string>();
  const weaknesses: string[] = [];
  const techniqueSet = new Set<string>();

  const negativeTags = Object.keys(WEAKNESS_LABELS);
  for (const [tag, count] of sorted) {
    if (weaknesses.length >= 4) break;
    if (negativeTags.includes(tag) && count >= 1 && !used.has(tag)) {
      weaknesses.push(WEAKNESS_LABELS[tag]);
      used.add(tag);
      const extras = TAG_TECHNIQUES[tag] ?? [];
      for (const t of extras) techniqueSet.add(t);
    }
  }

  if (techniqueSet.size < 3) {
    const defaults = ["flashcards", "active_recall", "timed_practice"];
    for (const t of defaults) techniqueSet.add(t);
  }

  const studyStyle = tagCounts.visual
    ? "visual"
    : tagCounts.written
      ? "written"
      : tagCounts.practice_based
        ? "practice-based"
        : "written";

  const sessionPreference =
    tagCounts.short_attention || tagCounts.easily_distracted
      ? "short_frequent"
      : "long_infrequent";

  const ordered = ["flashcards", "active_recall", "timed_practice", "past_paper_drilling", "blurting", "mind_maps", "streak_building", "daily_goals"];
  const recommendedTechniques = ordered.filter((t) => techniqueSet.has(t));

  const notes = buildNotes(weaknesses, recommendedTechniques, studyStyle);

  return { weaknesses, recommendedTechniques, studyStyle, sessionPreference, notes };
}

function buildNotes(
  weaknesses: string[],
  techniques: string[],
  style: string
): string {
  const top = techniques.slice(0, 3).map((t) => TECHNIQUE_META[t]?.name ?? t);
  return `Based on your responses, you learn best through ${style} methods. Focus on ${top.join(", ")} to strengthen ${weaknesses.slice(0, 2).join(" and ").toLowerCase()}.`;
}

export { TECHNIQUE_META };
