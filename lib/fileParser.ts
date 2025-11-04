import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import sharp from "sharp";

export async function parseFile(file: Buffer, fileType: string) {
  try {
    if (fileType === "application/pdf") {
      const data = await pdfParse(file);
      return {
        text: data.text,
        pages: data.numpages,
      };
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer: file });
      return {
        text: result.value,
        pages: null,
      };
    } else if (fileType.startsWith("image/")) {
      const metadata = await sharp(file).metadata();
      return {
        text: `Image file: ${metadata.width}x${metadata.height}`,
        pages: 1,
      };
    }

    return {
      text: "",
      pages: null,
    };
  } catch (error) {
    console.error("File parsing error:", error);
    return {
      text: "",
      pages: null,
    };
  }
}
