"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FolderKanban, Loader2, Plus } from "lucide-react";
import { Dialog } from "./Dialog";
import { CreateFolderModal } from "./CreateFolderModal";

interface Folder {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface FolderSelectorModalProps {
  open: boolean;
  onClose: () => void;
  sessionId: string;
  onSaved?: () => void;
}

export function FolderSelectorModal({ open, onClose, sessionId, onSaved }: FolderSelectorModalProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetch("/api/folders")
        .then((r) => r.json())
        .then((data) => {
          setFolders(data);
          setSelectedId(null);
        })
        .catch(() => toast.error("Failed to load folders"))
        .finally(() => setLoading(false));
    }
  }, [open]);

  async function handleSave() {
    if (!selectedId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/folders/${selectedId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "QUESTION", referenceId: sessionId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save");
      }
      toast.success("Saved to folder");
      onClose();
      onSaved?.();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function handleCreated(newFolder?: Record<string, unknown>) {
    setShowCreate(false);
    if (newFolder) {
      setFolders((prev) => [newFolder as unknown as Folder, ...prev]);
    } else {
      setLoading(true);
      fetch("/api/folders")
        .then((r) => r.json())
        .then((data) => setFolders(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }

  return (
    <>
      <Dialog open={open && !showCreate} onClose={onClose} title="Save to Folder">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-[#0F3226]/50" />
          </div>
        ) : folders.length === 0 ? (
          <div className="py-6 text-center">
            <FolderKanban className="mx-auto mb-3 h-8 w-8 text-[#6B7A72]/40" />
            <p className="mb-1 text-sm font-medium text-[#0A1A14]">No folders yet</p>
            <p className="mb-4 text-xs text-[#6B7A72]">Create a folder to organize your answers</p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F3226] px-4 py-2 text-xs font-medium text-[#FDFCF9] transition-colors hover:bg-[#0A1A14]"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Folder
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="max-h-56 space-y-1 overflow-y-auto">
              {folders.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedId(f.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                    selectedId === f.id
                      ? "border-[#0F3226]/40 bg-[#0F3226]/5"
                      : "border-transparent hover:border-[#D6D0C4]/50 hover:bg-[#0F3226]/[0.02]"
                  }`}
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[#FDFCF9] text-xs"
                    style={{ backgroundColor: f.color }}
                  >
                    <FolderKanban className="h-4 w-4" />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="font-medium text-[#0A1A14]">{f.name}</p>
                  </div>
                  {selectedId === f.id && (
                    <div className="h-2.5 w-2.5 rounded-full bg-[#0F3226]" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#D6D0C4]/50 px-4 py-2.5 text-xs font-medium text-[#6B7A72] transition-colors hover:border-[#0F3226]/30 hover:text-[#0F3226]"
            >
              <Plus className="h-3.5 w-3.5" />
              Create new folder
            </button>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-sm font-medium text-[#6B7A72] transition-colors hover:bg-[#0F3226]/5"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedId || saving}
                className="flex items-center gap-2 rounded-xl bg-[#0F3226] px-5 py-2 text-sm font-medium text-[#FDFCF9] transition-all hover:bg-[#0A1A14] disabled:opacity-50"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </Dialog>

      <CreateFolderModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={handleCreated} />
    </>
  );
}
