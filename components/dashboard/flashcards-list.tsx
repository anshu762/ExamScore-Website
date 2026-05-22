"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface FlashcardData {
  id: string;
  front: string;
  back: string;
  source: string;
  createdAt: Date;
  subject: { name: string };
  board: { name: string };
}

export function FlashcardsList({
  flashcards,
}: {
  flashcards: FlashcardData[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (flashcards.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="py-16 text-center">
          <p className="text-text-muted">No flashcards yet</p>
          <Button variant="primary" size="sm" className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Create Flashcard
          </Button>
        </CardContent>
      </Card>
    );
  }

  const current = flashcards[currentIndex];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-muted">
          {currentIndex + 1} of {flashcards.length}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setFlipped(!flipped)}
        >
          <RotateCcw className="h-3 w-3" />
          Flip
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id + (flipped ? "-back" : "-front")}
          initial={{ opacity: 0, rotateY: flipped ? -90 : 90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: flipped ? 90 : -90 }}
          transition={{ duration: 0.3 }}
          onClick={() => setFlipped(!flipped)}
          className="cursor-pointer"
        >
          <Card className="min-h-[300px] border-border">
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center">
                {flipped ? (
                  <div className="space-y-4">
                    <Badge variant="accent" className="mb-2">
                      Answer
                    </Badge>
                    <p className="text-lg leading-relaxed text-foreground">
                      {current.back}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Badge variant="secondary" className="mb-2">
                      Question
                    </Badge>
                    <p className="text-lg font-medium text-foreground">
                      {current.front}
                    </p>
                  </div>
                )}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {current.board.name}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {current.subject.name}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCurrentIndex((i) => Math.max(0, i - 1));
            setFlipped(false);
          }}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCurrentIndex((i) => Math.min(flashcards.length - 1, i + 1));
            setFlipped(false);
          }}
          disabled={currentIndex === flashcards.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
