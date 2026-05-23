"use client";

import { useState, useEffect, useCallback } from "react";
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
  Loader2,
  MoreHorizontal,
  Trash2,
  Palette,
} from "lucide-react";
import { motion } from "framer-motion";
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

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#0A1A14]">My Study Folders</h1>
          <p className="mt-1 text-sm text-[#6B7A72]">Organize your saved questions and notes</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl bg-[#0F3226] px-5 py-2.5 text-sm font-medium text-[#FDFCF9] transition-all hover:bg-[#0A1A14]"
        >
          <Plus className="h-4 w-4" />
          New Folder
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-[#D6D0C4]/20" />
          ))}
        </div>
      ) : folders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D6D0C4]/50 bg-[#FDFCF9] px-6 py-16 text-center">
          <FolderKanban className="mb-4 h-12 w-12 text-[#6B7A72]/30" />
          <h3 className="mb-1 font-serif text-lg font-semibold text-[#0A1A14]">No folders yet</h3>
          <p className="mb-6 text-sm text-[#6B7A72]">Create your first folder to organize study materials</p>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-xl bg-[#0F3226] px-5 py-2.5 text-sm font-medium text-[#FDFCF9] transition-colors hover:bg-[#0A1A14]"
          >
            <Plus className="h-4 w-4" />
            Create Folder
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {folders.map((f, idx) => {
            const Icon = getIconComponent(f.icon);
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#D6D0C4]/40 bg-[#FDFCF9] shadow-sm transition-all hover:shadow-md"
                onClick={() => router.push(`/folders/${f.id}`)}
              >
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundColor: f.color }} />
                <div className="relative p-5">
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-[#FDFCF9]"
                      style={{ backgroundColor: f.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === f.id ? null : f.id); }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7A72]/50 opacity-0 transition-all hover:bg-[#0F3226]/5 hover:text-[#6B7A72] group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {menuOpen === f.id && (
                        <div className="absolute right-0 top-10 z-20 w-40 overflow-hidden rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] py-1 shadow-lg">
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteFolder(f.id); }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-xs text-red-600 transition-colors hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="mb-1 font-serif text-base font-semibold text-[#0A1A14]">{f.name}</h3>
                    <p className="text-xs text-[#6B7A72]">
                      {f._count?.items ?? 0} {f._count?.items === 1 ? "item" : "items"}
                    </p>

                    {(f._count?.items ?? 0) > 0 && (
                      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-[#D6D0C4]/20">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ backgroundColor: f.color, width: `${Math.min((f._count?.items ?? 0) * 10, 100)}%` }}
                        />
                    </div>
                  )}
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
