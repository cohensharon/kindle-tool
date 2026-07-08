import nodemailer from "nodemailer";
import { looksLikeEmail } from "../src/utils/validation.js";

export interface SendToKindleEmailInput {
  kindleEmail: string;
  subject: string;
  text: string;
  epubPath: string;
}

export type SendToKindleEmailResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromEmail: string;
}

const requiredSmtpVariables = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "FROM_EMAIL",
] as const;

export async function sendToKindleEmail(
  input: SendToKindleEmailInput,
): Promise<void> {
  const result = await trySendToKindleEmail(input);

  if (!result.success) {
    throw new Error(result.error);
  }
}

export async function trySendToKindleEmail(
  input: SendToKindleEmailInput,
): Promise<SendToKindleEmailResult> {
  if (!looksLikeEmail(input.kindleEmail)) {
    return {
      success: false,
      error: "Please enter a valid Kindle email address.",
    };
  }

  const configResult = getSmtpConfigResult();

  if (!configResult.success) {
    return configResult;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: configResult.config.host,
      port: configResult.config.port,
      secure: configResult.config.port === 465,
      auth: {
        user: configResult.config.user,
        pass: configResult.config.pass,
      },
    });

    await transporter.sendMail({
      from: configResult.config.fromEmail,
      to: input.kindleEmail,
      subject: input.subject,
      text: input.text,
      attachments: [
        {
          path: input.epubPath,
        },
      ],
    });

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to send email: ${message}`,
    };
  }
}

type SmtpConfigResult =
  | {
      success: true;
      config: SmtpConfig;
    }
  | {
      success: false;
      error: string;
    };

function getSmtpConfigResult(): SmtpConfigResult {
  const missingVariables = requiredSmtpVariables.filter(
    (name) => !process.env[name],
  );

  if (missingVariables.length > 0) {
    return {
      success: false,
      error: `Missing SMTP configuration: ${missingVariables.join(", ")}. Add these values to your environment or .env file.`,
    };
  }

  const port = Number(process.env.SMTP_PORT);

  if (!Number.isInteger(port) || port <= 0) {
    return {
      success: false,
      error: "Invalid SMTP configuration: SMTP_PORT must be a positive number.",
    };
  }

  return {
    success: true,
    config: {
      host: process.env.SMTP_HOST as string,
      port,
      user: process.env.SMTP_USER as string,
      pass: process.env.SMTP_PASS as string,
      fromEmail: process.env.FROM_EMAIL as string,
    },
  };
}
