#!/usr/bin/env node

import "dotenv/config";
import { createInterface, type Interface as ReadlineInterface } from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import { validateArticleUrl } from "../lib/validateArticleUrls.js";
import { looksLikeEmail } from "./utils/validation.js";
import { sendArticleToKindle } from "./pipeline/sendArticleToKindle.js";
import type { SendArticleResult } from "./types/article.js";
import { log } from "./utils/log.js";

type Prompt = (question: string) => Promise<string>;

function createPrompt(readline: ReadlineInterface): Prompt {
  const lines = readline[Symbol.asyncIterator]();

  return async (question: string): Promise<string> => {
    output.write(question);
    const answer = await lines.next();

    if (answer.done) {
      throw new Error("Input ended before the CLI flow completed.");
    }

    return answer.value;
  };
}

async function collectArticleUrls(
  prompt: Prompt,
): Promise<string[]> {
  const urls: string[] = [];

  while (true) {
    const question =
      urls.length === 0
        ? 'Paste an article URL, or type "done":\n> '
        : 'Paste another article URL, or type "done":\n> ';
    const answer = (await prompt(question)).trim();

    if (answer.toLowerCase() === "done") {
      if (urls.length === 0) {
        log.error("Please enter at least one article URL before continuing.");
        continue;
      }

      return urls;
    }

    const validationResult = validateArticleUrl(answer);

    if (!validationResult.valid) {
      log.error(validationResult.error);
      continue;
    }

    urls.push(validationResult.url);
  }
}

async function collectKindleEmail(
  prompt: Prompt,
): Promise<string> {
  while (true) {
    const email = (await prompt("Enter Kindle email address:\n> ")).trim();

    if (looksLikeEmail(email)) {
      return email;
    }

    log.error("Please enter a valid email address.");
  }
}

async function processArticles(
  urls: string[],
  kindleEmail: string,
): Promise<void> {
  log.info(`Processing ${urls.length} article(s)...`);
  const results: SendArticleResult[] = [];

  for (const [index, url] of urls.entries()) {
    log.info(`[${index + 1}/${urls.length}] Processing ${url}`);

    try {
      const result = await sendArticleToKindle({ url, kindleEmail });
      results.push(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      results.push({
        success: false,
        url,
        error: message,
      });
    }
  }

  printArticleReport(results);
}

function printArticleReport(results: SendArticleResult[]): void {
  log.info("Report:");

  for (const [index, result] of results.entries()) {
    const position = `[${index + 1}/${results.length}]`;

    if (result.success) {
      log.success(`${position} Sent to Kindle: ${result.title} (${result.url})`);
    } else {
      log.error(`${position} Failed: ${result.error} (${result.url})`);
    }
  }

  const successfulCount = results.filter((result) => result.success).length;
  const failedCount = results.length - successfulCount;

  const summary = `Done. Successful: ${successfulCount} Failed: ${failedCount}`;

  if (failedCount > 0) {
    log.warn(summary);
  } else {
    log.success(summary);
  }
}

async function main(): Promise<void> {
  const readline = createInterface({ input, output });

  try {
    const prompt = createPrompt(readline);
    const urls = await collectArticleUrls(prompt);
    const kindleEmail = await collectKindleEmail(prompt);

    await processArticles(urls, kindleEmail);
  } finally {
    readline.close();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  log.error(message);
  process.exitCode = 1;
});
