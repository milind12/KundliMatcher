import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { parseBiodataText } from "./biodataParser";

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MAX_PDF_PAGES = 4;

export type ExtractionProgress = (message: string) => void;

function validateFile(file: File): "image" | "pdf" {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Choose a biodata file smaller than 15 MB.");
  }

  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    return "pdf";
  }
  if (file.type.startsWith("image/")) return "image";

  throw new Error("Choose a PDF, JPG, PNG or other image file.");
}

async function createOcrWorker(onProgress: ExtractionProgress) {
  const { createWorker } = await import("tesseract.js");
  return createWorker("eng", undefined, {
    logger: ({ status, progress }) => {
      if (status === "recognizing text") {
        onProgress(`Reading biodata ${Math.round(progress * 100)}%`);
      }
    }
  });
}

async function extractImage(file: File, onProgress: ExtractionProgress): Promise<string> {
  onProgress("Preparing private on-device OCR");
  const worker = await createOcrWorker(onProgress);

  try {
    const result = await worker.recognize(file);
    return result.data.text;
  } finally {
    await worker.terminate();
  }
}

function textItemsToLines(items: Array<unknown>): string {
  const rows: Array<{ y: number; items: Array<{ x: number; text: string }> }> = [];

  for (const item of items) {
    if (!item || typeof item !== "object" || !("str" in item) || !("transform" in item)) {
      continue;
    }

    const textItem = item as { str: string; transform: number[] };
    const text = textItem.str.trim();
    if (!text) continue;

    const x = textItem.transform[4] ?? 0;
    const y = textItem.transform[5] ?? 0;
    let row = rows.find((candidate) => Math.abs(candidate.y - y) <= 3);
    if (!row) {
      row = { y, items: [] };
      rows.push(row);
    }
    row.items.push({ x, text });
  }

  return rows
    .sort((a, b) => b.y - a.y)
    .map((row) =>
      row.items
        .sort((a, b) => a.x - b.x)
        .map((item) => item.text)
        .join(" ")
    )
    .join("\n");
}

async function extractPdf(file: File, onProgress: ExtractionProgress): Promise<string> {
  onProgress("Reading PDF text");
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  const pdf = await loadingTask.promise;
  const pageCount = Math.min(pdf.numPages, MAX_PDF_PAGES);
  const pages = [];

  try {
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(textItemsToLines(content.items));
    }

    const selectableText = pages.join("\n\n").trim();
    const parsed = parseBiodataText(selectableText);
    const detectedFields = [parsed.date, parsed.time, parsed.place].filter(Boolean).length;
    if (detectedFields >= 2 || selectableText.length >= 150) return selectableText;

    onProgress("PDF is scanned; preparing private OCR");
    const worker = await createOcrWorker(onProgress);
    const recognizedPages: string[] = [];

    try {
      for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
        onProgress(`Reading scanned page ${pageNumber} of ${pageCount}`);
        const page = await pdf.getPage(pageNumber);
        const baseViewport = page.getViewport({ scale: 1 });
        const scale = Math.min(2, 2200 / Math.max(baseViewport.width, baseViewport.height));
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvas, viewport }).promise;
        const result = await worker.recognize(canvas);
        recognizedPages.push(result.data.text);
      }
    } finally {
      await worker.terminate();
    }

    return [selectableText, ...recognizedPages].filter(Boolean).join("\n\n");
  } finally {
    await loadingTask.destroy();
  }
}

export async function extractBiodataText(
  file: File,
  onProgress: ExtractionProgress
): Promise<string> {
  const type = validateFile(file);
  const text =
    type === "pdf" ? await extractPdf(file, onProgress) : await extractImage(file, onProgress);

  if (!text.trim()) {
    throw new Error("No readable text was found in this biodata.");
  }
  return text;
}
