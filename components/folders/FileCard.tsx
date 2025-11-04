"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  FileText,
  Image,
  Download,
  MessageSquare,
  Brain,
  MoreVertical,
  Trash2,
} from "lucide-react";

export function FileCard({ file }: { file: any }) {
  const [showMenu, setShowMenu] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const getFileIcon = () => {
    if (file.type.startsWith("image/")) return <Image size={32} className="text-blue-500" />;
    if (file.type === "application/pdf") return <FileText size={32} className="text-red-500" />;
    return <FileText size={32} className="text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const deleteFile = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/files/${file.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete file");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });

  const handleDownload = async () => {
    const res = await fetch(`/api/files/${file.id}/download`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.originalName;
    a.click();
  };

  const handleSummarize = async () => {
    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId: file.id }),
    });
    const data = await res.json();
    router.push(`/chat/${data.conversationId}`);
  };

  const handleCreateQuiz = async () => {
    const res = await fetch("/api/quiz/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId: file.id }),
    });
    const data = await res.json();
    router.push(`/quiz/${data.quizId}`);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        {getFileIcon()}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <MoreVertical size={16} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
              <button
                onClick={() => {
                  if (confirm("Delete this file?")) {
                    deleteFile.mutate();
                  }
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-red-600 text-sm"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="font-medium text-sm mb-2 truncate">{file.originalName}</h3>
      
      <div className="text-xs text-gray-500 space-y-1 mb-4">
        <p>Size: {formatFileSize(file.size)}</p>
        {file.pages && <p>Pages: {file.pages}</p>}
        <p>Type: {file.type.split("/")[1].toUpperCase()}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleDownload}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs"
        >
          <Download size={14} />
          Download
        </button>
        <button
          onClick={handleSummarize}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs"
        >
          <MessageSquare size={14} />
          Summarize
        </button>
        <button
          onClick={handleCreateQuiz}
          className="flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs"
        >
          <Brain size={14} />
          Quiz
        </button>
      </div>
    </div>
  );
}
