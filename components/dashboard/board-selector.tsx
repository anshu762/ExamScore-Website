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
  const [selectedBoardCode, setSelectedBoardCode] = useState("");

  const [loadingBoards, setLoadingBoards] = useState(true);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  useEffect(() => {
    fetch("/api/boards")
      .then((r) => r.json())
      .then((data: Board[]) => {
        setBoards(data);
        if (initialBoardId) {
          const match = data.find((b) => b.id === initialBoardId);
          if (match) setSelectedBoardCode(match.code.toLowerCase());
        }
      })
      .catch(console.error)
      .finally(() => setLoadingBoards(false));
  }, [initialBoardId]);

  useEffect(() => {
    if (!selectedBoard || !selectedBoardCode) {
      setLevels([]);
      setSubjects([]);
      return;
    }
    setLoadingLevels(true);
    setSelectedLevel("");
    setSelectedSubject("");
    fetch(`/api/boards/${selectedBoardCode}/levels`)
      .then((r) => r.json())
      .then(setLevels)
      .catch(console.error)
      .finally(() => setLoadingLevels(false));
  }, [selectedBoard, selectedBoardCode]);

  useEffect(() => {
    if (!selectedBoard || !selectedBoardCode) {
      setSubjects([]);
      return;
    }
    if (!selectedLevel) {
      setSubjects([]);
      return;
    }
    setLoadingSubjects(true);
    setSelectedSubject("");
    fetch(`/api/boards/${selectedBoardCode}/levels/${selectedLevel}/subjects`)
      .then((r) => r.json())
      .then(setSubjects)
      .catch(console.error)
      .finally(() => setLoadingSubjects(false));
  }, [selectedBoard, selectedBoardCode, selectedLevel]);

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
        onChange={(e) => {
          const id = e.target.value;
          setSelectedBoard(id);
          const match = boards.find((b) => b.id === id);
          setSelectedBoardCode(match ? match.code.toLowerCase() : "");
        }}
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
            : selectedBoard && selectedLevel
              ? "Select subject"
              : "Select board and level first"
        }
        options={subjects.map((s) => ({ value: s.id, label: s.name }))}
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
        disabled={!selectedBoard || !selectedLevel || loadingSubjects}
      />
    </div>
  );
}
