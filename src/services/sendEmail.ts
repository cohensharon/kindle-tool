import {
  sendToKindleEmail,
  trySendToKindleEmail,
} from "../../lib/sendToKindleEmail.js";
import type {
  SendToKindleEmailInput,
  SendToKindleEmailResult,
} from "../../lib/sendToKindleEmail.js";

export interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
  attachmentPath: string;
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  return sendToKindleEmail({
    kindleEmail: input.to,
    subject: input.subject,
    text: input.text,
    epubPath: input.attachmentPath,
  });
}

export { sendToKindleEmail, trySendToKindleEmail };
export type { SendToKindleEmailInput, SendToKindleEmailResult };
