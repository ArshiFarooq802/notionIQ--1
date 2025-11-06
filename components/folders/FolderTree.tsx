"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Folder, ChevronRight, ChevronDown, MoreVertical, Edit2, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface FolderItemProps {
  folder: any;
  selectedFolderId: string | null;
  onSelectFolder: (id: string) => void;
  level: number;
}

function SortableFolderItem({ folder, selectedFolderId, onSelectFolder, level }: FolderItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(folder.name);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: folder.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renameFolder = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch(`/api/folders/${folder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to rename folder");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      setIsEditing(false);
    },
  });

  const deleteFolder = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/folders/${folder.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete folder");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  const handleRename = () => {
    if (newName.trim() && newName !== folder.name) {
      renameFolder.mutate(newName);
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
          selectedFolderId === folder.id ? "bg-blue-100" : ""
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-0.5"
        >
          {folder.children?.length > 0 ? (
            isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          ) : (
            <span className="w-4" />
          )}
        </button>

        <div className="flex items-center gap-2 flex-1" {...listeners} {...attributes}>
          <Folder size={16} className="text-blue-600" />

          {isEditing ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyPress={(e) => e.key === "Enter" && handleRename()}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              autoFocus
            />
          ) : (
            <span
              className="flex-1 text-sm"
              onClick={() => {
                onSelectFolder(folder.id);
                router.push(`/folders/${folder.id}`);
              }}
            >
              {folder.name}
            </span>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-300 rounded"
          >
            <MoreVertical size={14} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-sm"
              >
                <Edit2 size={14} />
                Rename
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this folder and all its contents?")) {
                    deleteFolder.mutate();
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

      {isExpanded && folder.children?.map((child: any) => (
        <SortableFolderItem
          key={child.id}
          folder={child}
          selectedFolderId={selectedFolderId}
          onSelectFolder={onSelectFolder}
          level={level + 1}
        />
      ))}
    </div>
  );
}

export function FolderTree({
  folders,
  selectedFolderId,
  onSelectFolder,
}: {
  folders: any[];
  selectedFolderId: string | null;
  onSelectFolder: (id: string) => void;
}) {
  const [items, setItems] = useState(folders);
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      await fetch("/api/folders/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folderId: active.id,
          newOrder: newIndex,
        }),
      });

      queryClient.invalidateQueries({ queryKey: ["folders"] });
    }
  };

  const rootFolders = folders.filter((f) => !f.parentId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={rootFolders} strategy={verticalListSortingStrategy}>
        {rootFolders.map((folder) => (
          <SortableFolderItem
            key={folder.id}
            folder={folder}
            selectedFolderId={selectedFolderId}
            onSelectFolder={onSelectFolder}
            level={0}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
