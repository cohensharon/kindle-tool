import nodemailer from "nodemailer";

export interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
  attachmentPath: string;
}

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromEmail: string;
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const config = getSmtpConfig();
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  await transporter.sendMail({
    from: config.fromEmail,
    to: input.to,
    subject: input.subject,
    text: input.text,
    attachments: [
      {
        path: input.attachmentPath,
      },
    ],
  });
}

function getSmtpConfig(): SmtpConfig {
  const missingVariables = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "FROM_EMAIL",
  ].filter((name) => !process.env[name]);

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing SMTP configuration: ${missingVariables.join(", ")}. Add these values to your environment or .env file.`,
    );
  }

  const port = Number(process.env.SMTP_PORT);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("Invalid SMTP configuration: SMTP_PORT must be a positive number.");
  }

  return {
    host: process.env.SMTP_HOST as string,
    port,
    user: process.env.SMTP_USER as string,
    pass: process.env.SMTP_PASS as string,
    fromEmail: process.env.FROM_EMAIL as string,
  };
}
