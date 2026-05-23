"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Book,
  Star,
  Beaker,
  Calculator,
  Globe,
  Pen,
  ChartNoAxesColumnIncreasing,
  Brain,
  Loader2,
} from "lucide-react";
import { Dialog } from "./Dialog";

const COLORS = [
  { value: "#0F3226", label: "Forest Green" },
  { value: "#1B3A5C", label: "Navy" },
  { value: "#A0522D", label: "Terracotta" },
  { value: "#B76E79", label: "Dusty Rose" },
  { value: "#6B7A72", label: "Slate" },
  { value: "#C8963E", label: "Gold" },
  { value: "#1B6B5A", label: "Deep Teal" },
  { value: "#2D2D2D", label: "Charcoal" },
];

const ICONS = [
  { value: "book", component: Book },
  { value: "star", component: Star },
  { value: "beaker", component: Beaker },
  { value: "calculator", component: Calculator },
  { value: "globe", component: Globe },
  { value: "pen", component: Pen },
  { value: "chart", component: ChartNoAxesColumnIncreasing },
  { value: "brain", component: Brain },
];

interface CreateFolderModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (folder?: Record<string, unknown>) => void;
}

export function CreateFolderModal({ open, onClose, onCreated }: CreateFolderModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0].value);
  const [icon, setIcon] = useState(ICONS[0].value);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), color, icon }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error ?? "Failed to create");
      }
      const newFolder = await res.json();
      toast.success("Folder created");
      setName("");
      setColor(COLORS[0].value);
      setIcon(ICONS[0].value);
      onClose();
      onCreated?.(newFolder);
    } catch (err) {
      console.error("Create folder error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to create folder");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="New Folder">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#0F3226]/60">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Physics Chapter 2"
            maxLength={60}
            autoFocus
            className="w-full rounded-xl border border-[#D6D0C4]/50 bg-[#FDFCF9] px-4 py-2.5 text-sm text-[#0A1A14] outline-none transition-colors placeholder:text-[#6B7A72]/40 focus:border-[#0F3226]/40 focus:ring-2 focus:ring-[#0F3226]/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#0F3226]/60">
            Color
          </label>
          <div className="flex gap-2.5">
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.label}
                onClick={() => setColor(c.value)}
                className="relative flex h-8 w-8 items-center justify-center rounded-xl transition-transform hover:scale-110"
                style={{ backgroundColor: c.value }}
              >
                {color === c.value && (
                  <span className="h-2.5 w-2.5 rounded-full bg-white" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#0F3226]/60">
            Icon
          </label>
          <div className="flex gap-2.5">
            {ICONS.map((ic) => {
              const IconComp = ic.component;
              const isActive = icon === ic.value;
              return (
                <button
                  key={ic.value}
                  type="button"
                  title={ic.value}
                  onClick={() => setIcon(ic.value)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm transition-all ${
                    isActive
                      ? "bg-[#0F3226] text-[#FDFCF9] shadow-md"
                      : "border border-[#D6D0C4]/40 text-[#6B7A72] hover:border-[#0F3226]/30 hover:text-[#0F3226]"
                  }`}
                >
                  <IconComp className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium text-[#6B7A72] transition-colors hover:bg-[#0F3226]/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || saving}
            className="flex items-center gap-2 rounded-xl bg-[#0F3226] px-5 py-2 text-sm font-medium text-[#FDFCF9] transition-all hover:bg-[#0A1A14] disabled:opacity-50"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {saving ? "Creating..." : "Create Folder"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
