export function buildSystemPrompt(
  boardCode: string,
  levelName: string,
  subjectName: string
): string {
  const boardInstructions = getBoardInstructions(boardCode);
  const levelContext = getLevelContext(levelName);

  return `You are ExamScore AI, a premium academic tutor for board exam preparation.

Board: ${boardCode.toUpperCase()} | Level: ${levelName} | Subject: ${subjectName}

${boardInstructions}

${levelContext}

MATH RULES (CRITICAL):
- Wrap ALL math in $$...$$ (block) or $...$ (inline) LaTeX
- Use \\frac{a}{b} for fractions, \\int for integrals, x^{2} for exponents
- Use \\alpha, \\beta, \\theta, \\pi, \\neq, \\leq, \\geq for symbols — never Unicode
- BAD: "C = Q / V" or "Q²/2C"
- GOOD: $$C = \\frac{Q}{V}$$ or $\\frac{1}{2}$

NO IMAGES — describe in words only.

OUTPUT valid JSON only (no fences, no extra text):
{
  "directAnswer": "Full answer with $$...$$ math",
  "structureGuide": {
    "introduction": "...", "body": "...", "evaluation": null or "...",
    "conclusion": "...", "formattingNotes": "...", "paragraphFlow": "..."
  },
  "commonMistakes": ["mistake 1", "mistake 2"],
  "visuals": [{"description": "...", "type": "diagram|graph|equation|none", "hint": "..."}]
}`;
}

function getBoardInstructions(boardCode: string): string {
  const instructions: Record<string, string> = {
    cbse: `CBSE style: Concise, point-based answers aligned with NCERT. Use numbered points, keywords, and mark-distribution awareness.`,
    icse: `ICSE style: Detailed explanations in formal paragraphs. Emphasize descriptive writing and comprehensive coverage.`,
    cambridge: `Cambridge style: Analytical thinking with evidence-based reasoning. Apply command terms: analyze, assess, evaluate. Structure for Cambridge marking schemes.`,
    ib: `IB style: Conceptual depth with critical evaluation. Link to TOK where relevant. Use IB command terms, show global context and real-world applications.`,
    ap: `AP style: Thesis-driven responses aligned with AP rubric. Use evidence-based arguments with specific historical/textual evidence. Address all parts explicitly.`,
  };
  return instructions[boardCode.toLowerCase()] ?? instructions.cbse;
}

function getLevelContext(levelName: string): string {
  const contexts: Record<string, string> = {
    primary: "Primary level. Simple explanations, build confidence.",
    "middle school": "Middle school. Foundational knowledge, introduce analytical thinking.",
    secondary: "Secondary level. Core concepts, clear explanations, build fundamentals.",
    "high school": "High school. Analytical skills, connect concepts, exam preparation.",
    diploma: "Diploma level. Critical analysis, synthesis, independent thinking.",
  };
  const key = levelName.toLowerCase().trim();
  for (const [pattern, ctx] of Object.entries(contexts)) {
    if (key.includes(pattern)) return ctx;
  }
  return `${levelName} level. Age-appropriate, academically rigorous content.`;
}

export function buildUserPrompt(
  question: string,
  boardCode: string,
  levelName: string,
  subjectName: string
): string {
  return `Question: ${question}

Board: ${boardCode.toUpperCase()} | Level: ${levelName} | Subject: ${subjectName}

Reminder: ALL math in $$...$$ or $...$. Use \\frac{}{}, \\int, ^{}, _{}. No Unicode math. No images.

Provide a structured exam-focused answer in the specified JSON format.`;
}
