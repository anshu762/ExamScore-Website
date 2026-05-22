"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Search } from "lucide-react";

interface Board {
  id: string;
  code: string;
  name: string;
  description: string;
}

interface Level {
  id: string;
  name: string;
  order: number;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface StoredSelection {
  boardCode: string;
  boardName: string;
  levelId: string;
  levelName: string;
  subjectId: string;
  subjectName: string;
}

interface BoardSelectorProps {
  onComplete: (selection: StoredSelection) => void;
}

const STORAGE_KEY = "examscore-selection";

export function BoardSelector({ onComplete }: BoardSelectorProps) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const [loadingBoards, setLoadingBoards] = useState(true);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/boards")
      .then((r) => r.json())
      .then(setBoards)
      .catch(console.error)
      .finally(() => setLoadingBoards(false));
  }, []);

  const handleBoardSelect = useCallback((board: Board) => {
    setSelectedBoard(board);
    setStep(2);
    setLoadingLevels(true);
    setLevels([]);
    fetch(`/api/boards/${board.code.toLowerCase()}/levels`)
      .then((r) => r.json())
      .then(setLevels)
      .catch(console.error)
      .finally(() => setLoadingLevels(false));
  }, []);

  const handleLevelSelect = useCallback((level: Level) => {
    if (!selectedBoard) return;
    setSelectedLevel(level);
    setStep(3);
    setLoadingSubjects(true);
    setSubjects([]);
    setFilteredSubjects([]);
    setSearch("");
    fetch(`/api/boards/${selectedBoard.code.toLowerCase()}/levels/${level.id}/subjects`)
      .then((r) => r.json())
      .then((data) => {
        setSubjects(data);
        setFilteredSubjects(data);
      })
      .catch(console.error)
      .finally(() => setLoadingSubjects(false));
  }, [selectedBoard]);

  const handleSubjectSelect = useCallback((subject: Subject) => {
    if (!selectedBoard || !selectedLevel) return;
    setSelectedSubject(subject);

    const selection: StoredSelection = {
      boardCode: selectedBoard.code,
      boardName: selectedBoard.name,
      levelId: selectedLevel.id,
      levelName: selectedLevel.name,
      subjectId: subject.id,
      subjectName: subject.name,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    fetch("/api/user/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ primaryBoard: selectedBoard.code }),
    }).catch(() => {});

    onComplete(selection);
  }, [selectedBoard, selectedLevel, onComplete]);

  useEffect(() => {
    if (subjects.length > 0) {
      const q = search.toLowerCase();
      setFilteredSubjects(
        q
          ? subjects.filter((s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q))
          : subjects
      );
    }
  }, [search, subjects]);

  return (
    <div className="mx-auto w-full max-w-3xl">
      {step === 1 && (
        <div>
          <div className="mb-8 text-center">
            <h2 className="font-serif text-2xl font-semibold text-[#0A1A14]">Choose Your Board</h2>
            <p className="mt-1.5 text-sm text-[#3D4F47]">Select your curriculum to get started.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loadingBoards
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-28 animate-pulse rounded-xl border border-[#D6D0C4]/40 bg-[#FDFCF9]/50" />
                ))
              : boards.map((board, i) => (
                  <motion.button
                    key={board.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    onClick={() => handleBoardSelect(board)}
                    className="group relative rounded-xl border border-[#D6D0C4]/50 bg-[#FDFCF9] p-5 text-left shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F3226]/5 ring-1 ring-[#0F3226]/10 transition-colors group-hover:bg-[#0F3226]/10">
                      <BookOpen className="h-4 w-4 text-[#0F3226]" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-[#0A1A14]">{board.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#3D4F47]">{board.description}</p>
                  </motion.button>
                ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-[#3D4F47]">
              <span className="font-medium text-[#0F3226]">{selectedBoard?.name}</span>
              <span className="text-[#D6D0C4]">/</span>
              <span className="text-[#D6D0C4]">Level</span>
            </div>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-[#0A1A14]">Select Your Level</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {loadingLevels
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 w-32 animate-pulse rounded-lg border border-[#D6D0C4]/40 bg-[#FDFCF9]/50" />
                ))
              : levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => handleLevelSelect(level)}
                    className="rounded-lg border border-[#D6D0C4]/50 bg-[#FDFCF9] px-5 py-2.5 text-sm font-medium text-[#0A1A14] shadow-sm transition-all duration-150 hover:border-[#0F3226]/30 hover:bg-[#0F3226]/5"
                  >
                    {level.name}
                  </button>
                ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setStep(1); setSelectedBoard(null); setLevels([]); }}
              className="text-xs text-[#6B7A72] underline underline-offset-2 transition-colors hover:text-[#0F3226]"
            >
              Change board
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-[#3D4F47]">
              <span className="font-medium text-[#0F3226]">{selectedBoard?.name}</span>
              <span className="text-[#D6D0C4]">/</span>
              <span className="font-medium text-[#0F3226]">{selectedLevel?.name}</span>
              <span className="text-[#D6D0C4]">/</span>
              <span className="text-[#D6D0C4]">Subject</span>
            </div>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-[#0A1A14]">Choose a Subject</h2>
          </div>

          <div className="relative mx-auto mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7A72]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subjects..."
              className="w-full rounded-lg border border-[#D6D0C4]/50 bg-[#FDFCF9] py-2.5 pl-10 pr-4 text-sm text-[#0A1A14] outline-none transition-colors placeholder:text-[#6B7A72]/60 focus:border-[#0F3226]/40 focus:ring-1 focus:ring-[#0F3226]/20"
            />
          </div>

          {loadingSubjects ? (
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-9 w-28 animate-pulse rounded-lg border border-[#D6D0C4]/40 bg-[#FDFCF9]/50" />
              ))}
            </div>
          ) : filteredSubjects.length === 0 ? (
            <p className="text-center text-sm text-[#6B7A72]">
              {search ? "No subjects match your search." : "No subjects available for this level."}
            </p>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
              {filteredSubjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => handleSubjectSelect(subject)}
                  className="rounded-lg border border-[#D6D0C4]/50 bg-[#FDFCF9] px-4 py-2 text-sm font-medium text-[#0A1A14] shadow-sm transition-all duration-150 hover:border-[#0F3226]/30 hover:bg-[#0F3226]/5"
                >
                  {subject.name}
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => { setStep(2); setSelectedLevel(null); setSubjects([]); }}
              className="text-xs text-[#6B7A72] underline underline-offset-2 transition-colors hover:text-[#0F3226]"
            >
              Change level
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function getStoredSelection(): StoredSelection | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredSelection) : null;
  } catch {
    return null;
  }
}
