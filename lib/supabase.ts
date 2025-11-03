import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadFile(file: File, path: string) {
  try {
    const { data, error } = await supabase.storage
      .from("files")
      .upload(path, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("files").getPublicUrl(path);

    return { url: publicUrl, path: data.path };
  } catch (error) {
    console.error("File upload error:", error);
    throw new Error("Failed to upload file");
  }
}

export async function deleteFile(path: string) {
  try {
    const { error } = await supabase.storage.from("files").remove([path]);
    if (error) throw error;
  } catch (error) {
    console.error("File deletion error:", error);
    throw new Error("Failed to delete file");
  }
}

export async function downloadFile(path: string) {
  try {
    const { data, error } = await supabase.storage.from("files").download(path);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("File download error:", error);
    throw new Error("Failed to download file");
  }
}
