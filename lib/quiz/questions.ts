export interface Question {
  id: number;
  text: string;
  options: Option[];
}

export interface Option {
  value: string;
  label: string;
  tags: string[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "When do you usually start revising for an exam?",
    options: [
      { value: "a", label: "The night before", tags: ["time_management", "last_minute"] },
      { value: "b", label: "1–2 weeks before", tags: ["moderate_preparation"] },
      { value: "c", label: "Throughout the term", tags: ["consistent_revision"] },
      { value: "d", label: "I don't have a set pattern", tags: ["time_management", "inconsistent"] },
    ],
  },
  {
    id: 2,
    text: "How do you best remember new information?",
    options: [
      { value: "a", label: "Seeing diagrams and images", tags: ["visual"] },
      { value: "b", label: "Writing it down repeatedly", tags: ["written"] },
      { value: "c", label: "Saying it out loud", tags: ["spoken"] },
      { value: "d", label: "Practicing with problems", tags: ["practice_based"] },
    ],
  },
  {
    id: 3,
    text: "When you study, do you feel you understand the concept or just memorise the steps?",
    options: [
      { value: "a", label: "I understand deeply", tags: ["conceptual_mastery"] },
      { value: "b", label: "I mostly memorise steps", tags: ["rote_memorisation"] },
      { value: "c", label: "A mix of both", tags: ["moderate_understanding"] },
      { value: "d", label: "I'm not sure", tags: ["conceptual_gaps"] },
    ],
  },
  {
    id: 4,
    text: "How often do you test yourself on what you've studied?",
    options: [
      { value: "a", label: "After every topic", tags: ["active_recall", "consistent_revision"] },
      { value: "b", label: "Only before exams", tags: ["last_minute", "exam_focused"] },
      { value: "c", label: "Rarely", tags: ["no_self_testing"] },
      { value: "d", label: "When I have time", tags: ["inconsistent", "no_self_testing"] },
    ],
  },
  {
    id: 5,
    text: "How do you usually feel during an exam?",
    options: [
      { value: "a", label: "Calm and focused", tags: ["exam_confidence"] },
      { value: "b", label: "A little nervous but manage", tags: ["moderate_anxiety"] },
      { value: "c", label: "Very anxious — it affects my performance", tags: ["exam_anxiety", "performance_pressure"] },
      { value: "d", label: "I blank out or rush", tags: ["exam_anxiety", "time_management"] },
    ],
  },
  {
    id: 6,
    text: "Which study format helps you learn the most?",
    options: [
      { value: "a", label: "Past papers and practice tests", tags: ["past_papers", "practice_based"] },
      { value: "b", label: "Reading textbooks or notes", tags: ["reading", "passive_learning"] },
      { value: "c", label: "Active recall flashcards", tags: ["flashcards", "active_recall"] },
      { value: "d", label: "Summarising and rewriting notes", tags: ["written", "summarising"] },
    ],
  },
  {
    id: 7,
    text: "How long can you study before needing a break?",
    options: [
      { value: "a", label: "20–30 minutes", tags: ["short_attention"] },
      { value: "b", label: "45–60 minutes", tags: ["moderate_attention"] },
      { value: "c", label: "2+ hours", tags: ["long_focus"] },
      { value: "d", label: "It depends on the subject", tags: ["variable_attention"] },
    ],
  },
  {
    id: 8,
    text: "Which type of subject do you find hardest?",
    options: [
      { value: "a", label: "Numerical / problem-based (math, physics)", tags: ["numerical_struggle"] },
      { value: "b", label: "Theory / essay-based (history, English)", tags: ["theory_struggle"] },
      { value: "c", label: "Memorisation-heavy (biology, geography)", tags: ["memorisation_struggle"] },
      { value: "d", label: "All are equally challenging", tags: ["general_struggle"] },
    ],
  },
  {
    id: 9,
    text: "Do you create a study plan or schedule?",
    options: [
      { value: "a", label: "Always — I plan everything", tags: ["planner", "consistent_revision"] },
      { value: "b", label: "Sometimes — for major exams", tags: ["moderate_preparation"] },
      { value: "c", label: "Rarely — I study when I feel like it", tags: ["inconsistent", "time_management"] },
      { value: "d", label: "I tried but couldn't stick to it", tags: ["time_management", "streak_building_needed"] },
    ],
  },
  {
    id: 10,
    text: "What is your main goal for using ExamScore?",
    options: [
      { value: "a", label: "Score top marks (90%+)", tags: ["top_marks", "high_ambition"] },
      { value: "b", label: "Pass comfortably", tags: ["pass_focused"] },
      { value: "c", label: "Build deep understanding", tags: ["deep_learning", "conceptual_mastery"] },
      { value: "d", label: "Improve exam technique and time management", tags: ["exam_technique", "time_management"] },
    ],
  },
  {
    id: 11,
    text: "When you get a question wrong, what do you usually do?",
    options: [
      { value: "a", label: "Review the answer and understand why", tags: ["reflective", "deep_learning"] },
      { value: "b", label: "Just memorise the correct answer", tags: ["rote_memorisation"] },
      { value: "c", label: "Move on without much thought", tags: ["avoidant"] },
      { value: "d", label: "Re-solve it until I get it right", tags: ["practice_based", "persistent"] },
    ],
  },
  {
    id: 12,
    text: "How often do you lose focus during study sessions?",
    options: [
      { value: "a", label: "Almost never — I stay locked in", tags: ["long_focus"] },
      { value: "b", label: "Every 15–20 minutes", tags: ["short_attention", "easily_distracted"] },
      { value: "c", label: "It depends on the subject or mood", tags: ["variable_attention"] },
      { value: "d", label: "Very often — I can't concentrate", tags: ["short_attention", "easily_distracted"] },
    ],
  },
  {
    id: 13,
    text: "What's your biggest challenge when preparing for exams?",
    options: [
      { value: "a", label: "Not enough time / procrastination", tags: ["time_management", "procrastination"] },
      { value: "b", label: "Understanding difficult concepts", tags: ["conceptual_gaps", "deep_learning"] },
      { value: "c", label: "Remembering everything I studied", tags: ["memorisation_struggle", "rote_memorisation"] },
      { value: "d", label: "Applying knowledge under exam pressure", tags: ["performance_pressure", "exam_anxiety"] },
    ],
  },
  {
    id: 14,
    text: "Do you prefer studying alone or in groups?",
    options: [
      { value: "a", label: "Alone — I focus better", tags: ["solo_learner"] },
      { value: "b", label: "In groups — discussion helps me learn", tags: ["collaborative"] },
      { value: "c", label: "A mix of both", tags: ["flexible_learner"] },
      { value: "d", label: "I haven't tried group study", tags: ["solo_learner", "inexperienced_group"] },
    ],
  },
  {
    id: 15,
    text: "How do you feel about using flashcards for revision?",
    options: [
      { value: "a", label: "Love them — they work great for me", tags: ["flashcards", "active_recall"] },
      { value: "b", label: "I've tried but didn't stick with them", tags: ["time_management", "inconsistent"] },
      { value: "c", label: "Never used them", tags: ["no_flashcard_experience"] },
      { value: "d", label: "I prefer other methods", tags: ["alternative_methods"] },
    ],
  },
];
