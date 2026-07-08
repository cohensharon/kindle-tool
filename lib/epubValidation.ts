import type { Stats } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";

const minimumEpubSizeBytes = 1 * 1024;

export interface GeneratedEpubValidationResult {
  success: true;
  filePath: string;
  fileSizeBytes: number;
}

export async function validateGeneratedEpub(
  filePath: string,
): Promise<GeneratedEpubValidationResult> {
  let fileStats: Stats;

  try {
    fileStats = await stat(filePath);
  } catch (error) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      throw new Error(`Generated EPUB validation failed: file does not exist at ${filePath}.`);
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(
      `Generated EPUB validation failed: could not read ${filePath}: ${message}`,
    );
  }

  if (!fileStats.isFile()) {
    throw new Error(`Generated EPUB validation failed: ${filePath} is not a file.`);
  }

  if (path.extname(filePath).toLowerCase() !== ".epub") {
    throw new Error(`Generated EPUB validation failed: ${filePath} is not an .epub file.`);
  }

  if (fileStats.size <= minimumEpubSizeBytes) {
    throw new Error(
      `Generated EPUB validation failed: expected file size greater than 5KB, got ${fileStats.size} bytes.`,
    );
  }

  return {
    success: true,
    filePath,
    fileSizeBytes: fileStats.size,
  };
}

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
