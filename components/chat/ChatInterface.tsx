"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Download } from "lucide-react";
import { MarkdownContent } from "@/components/MarkdownContent";
import { useRouter } from "next/navigation";
import { exportConversationToPDF, downloadPDF } from "@/lib/exportPDF";

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

export function ChatInterface({ userId, conversationId }: { userId: string; conversationId?: string }) {
  const [input, setInput] = useState("");
  const [currentConvId, setCurrentConvId] = useState(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", currentConvId],
    queryFn: async () => {
      if (!currentConvId) return [];
      const res = await fetch(`/api/messages?conversationId=${currentConvId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    enabled: !!currentConvId,
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, conversationId: currentConvId }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: (data) => {
      if (!currentConvId) {
        setCurrentConvId(data.conversationId);
        router.push(`/chat/${data.conversationId}`);
      }
      queryClient.invalidateQueries({ queryKey: ["messages", currentConvId || data.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendMessage.isPending) return;
    sendMessage.mutate(input);
    setInput("");
  };

  const handleExportPDF = async () => {
    if (messages.length === 0) return;
    const pdf = await exportConversationToPDF("Chat Conversation", messages);
    downloadPDF(pdf, `conversation-${currentConvId || Date.now()}.pdf`);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Chat</h2>
        <button
          onClick={handleExportPDF}
          disabled={messages.length === 0}
          className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          title="Export as PDF"
        >
          <Download size={20} className="text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-2xl mb-2">Start a conversation</p>
              <p className="text-sm">Type a message below to begin</p>
            </div>
          </div>
        ) : (
          messages.map((message: Message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-3xl ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-2xl px-4 py-3"
                    : "bg-gray-100 text-gray-800 rounded-2xl px-4 py-3"
                }`}
              >
                {message.role === "user" ? (
                  <p>{message.content}</p>
                ) : (
                  <MarkdownContent content={message.content} />
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={sendMessage.isPending}
          />
          <button
            type="submit"
            disabled={!input.trim() || sendMessage.isPending}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
