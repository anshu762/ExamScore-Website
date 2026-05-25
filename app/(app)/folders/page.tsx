"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FolderKanban,
  Plus,
  Book,
  Star,
  Beaker,
  Calculator,
  Globe,
  Pen,
  ChartNoAxesColumnIncreasing,
  Brain,
  MoreHorizontal,
  Trash2,
  FolderOpen,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CreateFolderModal } from "@/components/shared/CreateFolderModal";

const ICON_MAP: Record<string, React.ElementType> = {
  book: Book,
  star: Star,
  beaker: Beaker,
  calculator: Calculator,
  globe: Globe,
  pen: Pen,
  chart: ChartNoAxesColumnIncreasing,
  brain: Brain,
};

interface Folder {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
  _count?: { items: number };
}

export default function FoldersPage() {
  const router = useRouter();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch("/api/folders");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFolders(data);
    } catch {
      toast.error("Failed to load folders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFolders(); }, [fetchFolders]);

  function handleCreated(newFolder?: Record<string, unknown>) {
    if (newFolder) {
      setFolders((prev) => [newFolder as unknown as Folder, ...prev]);
    } else {
      fetchFolders();
    }
  }

  async function deleteFolder(id: string) {
    try {
      const res = await fetch(`/api/folders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Folder deleted");
      setFolders((prev) => prev.filter((f) => f.id !== id));
    } catch {
      toast.error("Failed to delete folder");
    }
    setMenuOpen(null);
  }

  function getIconComponent(icon: string) {
    return ICON_MAP[icon] ?? FolderKanban;
  }

  const totalItems = folders.reduce((sum, f) => sum + (f._count?.items ?? 0), 0);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-[#6B7A72]">
            <span className="inline-block h-1 w-1 rounded-full bg-[#C9A84C]" />
            Folders
          </div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-[#0A1A14] sm:text-3xl">
            Study Folders
          </h1>
          <p className="text-sm text-[#3D4F47]">
            {loading
              ? "Loading..."
              : folders.length === 0
                ? "Organize your saved questions"
                : `${totalItems} item${totalItems !== 1 ? "s" : ""} across ${folders.length} folder${folders.length !== 1 ? "s" : ""}`
            }
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-[#0F3226] px-5 py-2.5 text-sm font-medium text-[#FDFCF9] shadow-sm transition-all hover:bg-[#1A4A36] hover:shadow-md"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FDFCF9]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <Plus className="relative h-4 w-4" />
          <span className="relative">New Folder</span>
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-[#D6D0C4]/20 bg-[#FDFCF9] shadow-sm">
              <div className="animate-pulse p-5">
                <div className="mb-4 flex items-start justify-between">
                  <div className="h-10 w-10 rounded-xl bg-[#D6D0C4]/30" />
                  <div className="h-8 w-8 rounded-lg bg-[#D6D0C4]/20" />
                </div>
                <div className="mb-1 h-4 w-3/4 rounded bg-[#D6D0C4]/30" />
                <div className="h-3 w-1/3 rounded bg-[#D6D0C4]/20" />
                <div className="mt-4 h-1 w-full rounded-full bg-[#D6D0C4]/20" />
              </div>
            </div>
          ))}
        </div>
      ) : folders.length === 0 ? (
        /* Empty state */
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D6D0C4]/40 bg-[#FDFCF9] px-6 py-20 text-center shadow-sm"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F3226]/5 to-[#0F3226]/10">
            <FolderOpen className="h-7 w-7 text-[#0F3226]/40" />
          </div>
          <h3 className="mt-5 font-serif text-xl font-semibold text-[#0A1A14]">No folders yet</h3>
          <p className="mt-1.5 max-w-sm text-sm text-[#6B7A72]">
            Create a folder to save and organize your AI answers by topic, subject, or exam.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0F3226] px-5 py-2.5 text-sm font-medium text-[#FDFCF9] shadow-sm transition-all hover:bg-[#1A4A36] hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Create your first folder
          </button>
        </motion.div>
      ) : (
        /* Folder grid */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {folders.map((f, idx) => {
            const Icon = getIconComponent(f.icon);
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
              >
                <div
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#D6D0C4]/30 bg-[#FDFCF9] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  onClick={() => router.push(`/folders/${f.id}`)}
                >
                  {/* Color accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 opacity-80"
                    style={{ backgroundColor: f.color }}
                  />

                  {/* Background tint */}
                  <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundColor: f.color }} />

                  <div className="relative p-5">
                    {/* Top row */}
                    <div className="mb-4 flex items-start justify-between">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-[#FDFCF9] shadow-sm transition-transform group-hover:scale-105"
                        style={{ backgroundColor: f.color }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Three-dot menu */}
                      <div className="relative" ref={menuOpen === f.id ? menuRef : undefined}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === f.id ? null : f.id); }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7A72]/30 opacity-0 transition-all hover:bg-[#0F3226]/5 hover:text-[#6B7A72] group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        <AnimatePresence>
                          {menuOpen === f.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.12 }}
                              className="absolute right-0 top-10 z-20 w-40 overflow-hidden rounded-xl border border-[#D6D0C4]/20 bg-[#FDFCF9] py-1 shadow-lg"
                            >
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteFolder(f.id); }}
                                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete folder
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Folder info */}
                    <h3 className="font-serif text-base font-semibold text-[#0A1A14]">{f.name}</h3>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[#6B7A72]">
                      <span>{f._count?.items ?? 0} item{(f._count?.items ?? 0) !== 1 ? "s" : ""}</span>
                      <ChevronRight className="h-3 w-3 text-[#D6D0C4] transition-transform group-hover:translate-x-0.5" />
                    </div>

                    {/* Progress bar */}
                    {(f._count?.items ?? 0) > 0 && (
                      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-[#D6D0C4]/15">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            backgroundColor: f.color,
                            width: `${Math.min((f._count?.items ?? 0) * 10, 100)}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <CreateFolderModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={handleCreated} />
    </div>
  );
}
