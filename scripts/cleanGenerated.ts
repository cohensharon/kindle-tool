import { readdir, rm } from "node:fs/promises";
import path from "node:path";

const generatedDirectory = path.resolve("generated");

async function cleanGeneratedEpubs(): Promise<void> {
  let entries: string[];

  try {
    entries = await readdir(generatedDirectory);
  } catch (error) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      console.log("No generated directory found. Nothing to clean.");
      return;
    }

    throw error;
  }

  const epubFiles = entries.filter(
    (entry) => path.extname(entry).toLowerCase() === ".epub",
  );

  await Promise.all(
    epubFiles.map((fileName) =>
      rm(path.join(generatedDirectory, fileName), { force: true }),
    ),
  );

  console.log(`Deleted ${epubFiles.length} EPUB file(s) from generated/.`);
}

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

cleanGeneratedEpubs().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`Failed to clean generated EPUBs: ${message}`);
  process.exitCode = 1;
});
