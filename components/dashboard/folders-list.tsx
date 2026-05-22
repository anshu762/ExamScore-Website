"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderKanban, Plus, FileText, Hash } from "lucide-react";

interface FolderData {
  id: string;
  name: string;
  color: string;
  icon: string;
  _count: { items: number };
}

export function FoldersList({ folders }: { folders: FolderData[] }) {
  if (folders.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="py-16 text-center">
          <FolderKanban className="mx-auto h-8 w-8 text-text-muted mb-3" />
          <p className="text-text-muted">No folders yet</p>
          <p className="mt-1 text-xs text-text-muted">
            Create folders to organize your study materials
          </p>
          <Button variant="primary" size="sm" className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Create Folder
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {folders.map((folder) => (
        <Link key={folder.id} href={`/dashboard/folders/${folder.id}`}>
          <Card className="h-full border-border transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${folder.color}15` }}
                >
                  <FolderKanban
                    className="h-5 w-5"
                    style={{ color: folder.color }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">
                    {folder.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Hash className="h-3 w-3 text-text-muted" />
                    <span className="text-xs text-text-muted">
                      {folder._count.items} items
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
