"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";

export function FileUpload({ folderId }: { folderId: string }) {
  const queryClient = useQueryClient();

  const uploadFile = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderId", folderId);

      const res = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload file");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", folderId] });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      uploadFile.mutate(file);
    });
  }, [folderId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-gray-400"
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto mb-4 text-gray-400" size={48} />
      {uploadFile.isPending ? (
        <p className="text-gray-600">Uploading...</p>
      ) : isDragActive ? (
        <p className="text-blue-600">Drop files here...</p>
      ) : (
        <div>
          <p className="text-gray-600 mb-2">
            Drag and drop files here, or click to select
          </p>
          <p className="text-sm text-gray-500">
            Supports: JPG, PNG, PDF, DOCX
          </p>
        </div>
      )}
    </div>
  );
}
