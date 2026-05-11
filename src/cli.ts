#!/usr/bin/env node

import { createInterface, type Interface as ReadlineInterface } from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import {
  getArticleUrlValidationError,
  looksLikeEmail,
} from "./utils/validation.js";

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
        console.log("Please enter at least one article URL before continuing.");
        continue;
      }

      return urls;
    }

    const validationError = getArticleUrlValidationError(answer);

    if (validationError !== null) {
      console.log(validationError);
      continue;
    }

    urls.push(answer);
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

    console.log("Please enter a valid email address.");
  }
}

async function main(): Promise<void> {
  const readline = createInterface({ input, output });

  try {
    const prompt = createPrompt(readline);
    const urls = await collectArticleUrls(prompt);
    const kindleEmail = await collectKindleEmail(prompt);

    console.log("\nURLs:");
    for (const url of urls) {
      console.log(`- ${url}`);
    }

    console.log("\nKindle email:");
    console.log(kindleEmail);
  } finally {
    readline.close();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
