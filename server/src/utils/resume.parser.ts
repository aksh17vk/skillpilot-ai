import fs from "fs";
import path from "path";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

function cleanText(text: string): string {
  return text
    .replace(/\r/g, " ")
    .replace(/\n+/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .trim();
}

export async function extractResumeText(
  filePath: string
): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  // PDF parsing
  if (ext === ".pdf") {
    const buffer = fs.readFileSync(filePath);
    const uint8Array = new Uint8Array(buffer);
    const data = await new PDFParse(uint8Array).getText();

    if (!data.text || data.text.trim().length < 20) {
      throw new Error(
        "Unable to extract text from PDF. Please upload a text-based PDF."
      );
    }

    return cleanText(data.text);
  }

  // DOCX parsing
  if (ext === ".docx") {
    const result = await mammoth.extractRawText({
      path: filePath,
    });

    if (!result.value || result.value.trim().length < 20) {
      throw new Error(
        "Unable to extract text from DOCX file."
      );
    }

    return cleanText(result.value);
  }

  throw new Error(
    "Unsupported file type. Upload PDF or DOCX only."
  );
}