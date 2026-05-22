"use client";

import { useState, useEffect } from "react";
import { Select } from "@/components/ui/select";

interface Board {
  id: string;
  code: string;
  name: string;
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

interface BoardSelectorProps {
  onSelect: (boardId: string, levelId: string, subjectId: string) => void;
  initialBoardId?: string;
  initialLevelId?: string;
  initialSubjectId?: string;
}

export function BoardSelector({
  onSelect,
  initialBoardId = "",
  initialLevelId = "",
  initialSubjectId = "",
}: BoardSelectorProps) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [selectedBoard, setSelectedBoard] = useState(initialBoardId);
  const [selectedLevel, setSelectedLevel] = useState(initialLevelId);
  const [selectedSubject, setSelectedSubject] = useState(initialSubjectId);

  const [loadingBoards, setLoadingBoards] = useState(true);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  useEffect(() => {
    async function fetchBoards() {
      try {
        const res = await fetch("/api/boards");
        const data = await res.json();
        setBoards(data);
      } catch (err) {
        console.error("Failed to fetch boards:", err);
      } finally {
        setLoadingBoards(false);
      }
    }
    fetchBoards();
  }, []);

  useEffect(() => {
    if (!selectedBoard) {
      setLevels([]);
      setSubjects([]);
      return;
    }

    setLoadingLevels(true);
    setSelectedLevel("");
    setSelectedSubject("");

    fetch(`/api/boards/${selectedBoard}/levels`)
      .then((res) => res.json())
      .then(setLevels)
      .catch(console.error)
      .finally(() => setLoadingLevels(false));
  }, [selectedBoard]);

  useEffect(() => {
    if (!selectedBoard) {
      setSubjects([]);
      return;
    }

    setLoadingSubjects(true);
    setSelectedSubject("");

    const levelParam = selectedLevel ? `?levelId=${selectedLevel}` : "";
    fetch(`/api/boards/${selectedBoard}/subjects${levelParam}`)
      .then((res) => res.json())
      .then(setSubjects)
      .catch(console.error)
      .finally(() => setLoadingSubjects(false));
  }, [selectedBoard, selectedLevel]);

  useEffect(() => {
    if (selectedBoard && selectedLevel && selectedSubject) {
      onSelect(selectedBoard, selectedLevel, selectedSubject);
    }
  }, [selectedBoard, selectedLevel, selectedSubject, onSelect]);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Select
        label="Board"
        placeholder={loadingBoards ? "Loading..." : "Select board"}
        options={boards.map((b) => ({ value: b.id, label: b.name }))}
        value={selectedBoard}
        onChange={(e) => setSelectedBoard(e.target.value)}
      />
      <Select
        label="Level"
        placeholder={
          loadingLevels
            ? "Loading..."
            : selectedBoard
              ? "Select level"
              : "Select board first"
        }
        options={levels.map((l) => ({ value: l.id, label: l.name }))}
        value={selectedLevel}
        onChange={(e) => setSelectedLevel(e.target.value)}
        disabled={!selectedBoard || loadingLevels}
      />
      <Select
        label="Subject"
        placeholder={
          loadingSubjects
            ? "Loading..."
            : selectedBoard
              ? "Select subject"
              : "Select board first"
        }
        options={subjects.map((s) => ({ value: s.id, label: s.name }))}
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
        disabled={!selectedBoard || loadingSubjects}
      />
    </div>
  );
}
