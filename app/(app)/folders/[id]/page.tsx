"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FolderKanban,
  ArrowLeft,
  BookOpen,
  Brain,
  Pen,
  Trash2,
  Loader2,
  Book,
  Star,
  Beaker,
  Calculator,
  Globe,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/lib/utils";

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

type Tab = "all" | "QUESTION" | "FLASHCARD" | "NOTE";

interface FolderItem {
  id: string;
  type: "QUESTION" | "FLASHCARD" | "NOTE";
  referenceId: string;
  details: Record<string, unknown> | null;
}

interface Folder {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export default function FolderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const folderId = params.id as string;

  const [folder, setFolder] = useState<Folder | null>(null);
  const [items, setItems] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const fetchData = useCallback(async () => {
    try {
      const [folderRes, itemsRes] = await Promise.all([
        fetch(`/api/folders`).then((r) => r.json()),
        fetch(`/api/folders/${folderId}/items`).then((r) => r.json()),
      ]);
      const found = folderRes.find((f: Folder) => f.id === folderId);
      setFolder(found ?? null);
      setItems(Array.isArray(itemsRes) ? itemsRes : []);
    } catch {
      toast.error("Failed to load folder");
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function removeItem(itemId: string) {
    try {
      const res = await fetch(`/api/folders/${folderId}/items/${itemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Item removed");
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch {
      toast.error("Failed to remove item");
    }
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "all", label: "All", icon: FolderKanban },
    { id: "QUESTION", label: "Questions", icon: BookOpen },
    { id: "FLASHCARD", label: "Flashcards", icon: Brain },
    { id: "NOTE", label: "Notes", icon: Pen },
  ];

  const filtered = activeTab === "all" ? items : items.filter((i) => i.type === activeTab);

  function getTypeBadge(type: string) {
    switch (type) {
      case "QUESTION": return { label: "Question", color: "bg-blue-100 text-blue-700" };
      case "FLASHCARD": return { label: "Flashcard", color: "bg-purple-100 text-purple-700" };
      case "NOTE": return { label: "Note", color: "bg-amber-100 text-amber-700" };
      default: return { label: type, color: "bg-gray-100 text-gray-700" };
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#0F3226]/50" />
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="text-center py-20">
        <p className="text-[#6B7A72]">Folder not found</p>
        <button onClick={() => router.push("/folders")} className="mt-4 text-sm text-[#0F3226] underline">
          Back to folders
        </button>
      </div>
    );
  }

  const IconComp = ICON_MAP[folder.icon] ?? FolderKanban;

  return (
    <div>
      <button
        onClick={() => router.push("/folders")}
        className="mb-6 flex items-center gap-1.5 text-xs font-medium text-[#6B7A72] transition-colors hover:text-[#0F3226]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Folders
      </button>

      <div
        className="relative mb-6 overflow-hidden rounded-2xl p-6"
        style={{ backgroundColor: folder.color + "0D" }}
      >
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundColor: folder.color }} />
        <div className="relative flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-[#FDFCF9] shadow-md"
            style={{ backgroundColor: folder.color }}
          >
            <IconComp className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#0A1A14]">{folder.name}</h1>
            <p className="mt-0.5 text-sm text-[#6B7A72]">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-1 rounded-xl bg-[#0F3226]/5 p-1">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = tab.id === "all" ? items.length : items.filter((i) => i.type === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#FDFCF9] text-[#0F3226] shadow-sm"
                  : "text-[#6B7A72] hover:text-[#0F3226]"
              }`}
            >
              <TabIcon className="h-3.5 w-3.5" />
              {tab.label}
              <span className="ml-0.5 text-[10px] opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D6D0C4]/50 px-6 py-16 text-center"
          >
            <FolderKanban className="mb-3 h-8 w-8 text-[#6B7A72]/30" />
            <p className="text-sm text-[#6B7A72]">No items in this folder</p>
          </motion.div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {filtered.map((item) => {
              const badge = getTypeBadge(item.type);
              const details = item.details ?? {};
              const title =
                (details as any).questionText ??
                (details as any).title ??
                (details as any).front ??
                "Untitled";
              const date = (details as any).createdAt
                ? formatDate(new Date((details as any).createdAt))
                : "";
              const snippet =
                typeof title === "string" && title.length > 100
                  ? title.slice(0, 100) + "..."
                  : title;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] px-5 py-4 shadow-sm transition-all hover:shadow-md"
                >
                  <span className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-semibold ${badge.color}`}>
                    {badge.label}
                  </span>
                  <div className="flex-1 truncate">
                    <p className="text-sm font-medium text-[#0A1A14]">{snippet}</p>
                    {date && <p className="mt-0.5 text-xs text-[#6B7A72]">{date}</p>}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#6B7A72]/40 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
