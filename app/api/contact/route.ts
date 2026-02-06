import {NextResponse} from "next/server";
import config from "../../../config.server";
import {sendEmail} from "../../../libs/postmark";

type ContactPayload = {
  email?: string;
  message?: string;
  page?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 4000;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ContactPayload | null;
  if (!body) {
    return NextResponse.json({error: "Invalid request body"}, {status: 400});
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const message = (body.message ?? "").trim();
  const page = (body.page ?? "").trim();

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({error: "Please enter a valid email address"}, {status: 400});
  }

  if (message.length < MIN_MESSAGE_LENGTH) {
    return NextResponse.json(
      {error: `Message must be at least ${MIN_MESSAGE_LENGTH} characters`},
      {status: 400}
    );
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      {error: `Message must be shorter than ${MAX_MESSAGE_LENGTH} characters`},
      {status: 400}
    );
  }

  const recipient = config.supportEmail || "support@dotspan.life";
  const appName = config.appName || "DotSpan";
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");
  const safePage = escapeHtml(page || "unknown");
  const safeEmail = escapeHtml(email);

  try {
    await sendEmail({
      to: recipient,
      replyTo: email,
      subject: `${appName} contact message`,
      text: `From: ${email}\nPage: ${page || "unknown"}\n\n${message}`,
      html: [
        `<p><strong>From:</strong> ${safeEmail}</p>`,
        `<p><strong>Page:</strong> ${safePage}</p>`,
        `<p><strong>Message:</strong></p>`,
        `<p>${safeMessage}</p>`
      ].join("")
    });

    return NextResponse.json({ok: true});
  } catch (error) {
    const messageText = error instanceof Error ? error.message : "Failed to send message";
    return NextResponse.json({error: messageText}, {status: 500});
  }
}
