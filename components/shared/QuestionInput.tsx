"use client";

import { useRef, useEffect, useCallback } from "react";

interface QuestionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export function QuestionInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "Ask your exam question here...",
  maxLength = 2000,
}: QuestionInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autosize = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
    }
  }, []);

  useEffect(() => {
    autosize();
  }, [value, autosize]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!disabled && value.trim()) {
        onSubmit();
      }
    }
  }

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={4}
        disabled={disabled}
        className="w-full resize-none rounded-xl border border-[#D6D0C4]/50 bg-[#FDFCF9] p-5 font-serif text-base leading-relaxed text-[#0A1A14] shadow-sm outline-none transition-all placeholder:text-[#6B7A72]/40 focus:border-[#0F3226]/60 focus:ring-2 focus:ring-[#0F3226]/10 disabled:cursor-not-allowed disabled:opacity-60"
      />
      <div className="mt-2 flex items-center justify-between px-1">
        <span className="text-xs text-[#6B7A72]/60">
          {value.length}/{maxLength}
        </span>
        <span className="hidden text-xs text-[#6B7A72]/40 md:inline">
          Cmd+Enter to submit
        </span>
      </div>
    </div>
  );
}
