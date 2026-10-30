import { NextResponse } from "next/server";
import { Resend } from "resend";

type InquiryPayload = {
  fullName: string;
  email: string;
  instagram?: string;
  message: string;
};

function parseRecipients(value: string | undefined, fallback: string) {
  const source = value && value.trim().length > 0 ? value : fallback;
  return source
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendInquiryEmails(payload: InquiryPayload) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Looks By Slim <info@looksbyslim.com>";
  const slimEmail = process.env.EMAIL_TO_SLIM || "info@looksbyslim.com";
  const inquiryNotificationRecipients = parseRecipients(
    process.env.INQUIRY_NOTIFICATION_EMAILS,
    slimEmail
  );

  if (!resendApiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const resend = new Resend(resendApiKey);
  const safeName = escapeHtml(payload.fullName);
  const safeEmail = escapeHtml(payload.email);
  const safeInstagram = escapeHtml(payload.instagram || "N/A");
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, "<br />");

  const sendEmails = async (sender: string) => {
    const ownerResults = await Promise.all(
      inquiryNotificationRecipients.map((recipient) =>
        resend.emails.send({
          from: sender,
          to: recipient,
          subject: `New Inquiry: ${payload.fullName}`,
          html: `
            <h2>New Inquiry</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Instagram:</strong> ${safeInstagram}</p>
            <p><strong>Message:</strong></p>
            <p>${safeMessage}</p>
          `,
          replyTo: payload.email,
        })
      )
    );

    const clientResult = await resend.emails.send({
      from: sender,
      to: payload.email,
      subject: "We received your inquiry - Looks By Slim",
      html: `
        <h2>Inquiry Received</h2>
        <p>Hi ${safeName},</p>
        <p>Thank you for reaching out to Looks By Slim. We received your inquiry and will reply as soon as possible.</p>
        <p><strong>Your message:</strong></p>
        <p>${safeMessage}</p>
      `,
      replyTo: slimEmail,
    });

    return { ownerResults, clientResult };
  };

  const collectOwnerErrors = (ownerResults: Array<{ error?: { message?: string } | null }>) => {
    return ownerResults
      .map((result, index) => {
        const errorMessage = result.error?.message;
        if (!errorMessage) return null;
        return `${inquiryNotificationRecipients[index]}: ${errorMessage}`;
      })
      .filter((entry): entry is string => Boolean(entry));
  };

  let { ownerResults, clientResult: clientEmailResult } = await sendEmails(from);
  let ownerErrors = collectOwnerErrors(ownerResults as Array<{ error?: { message?: string } | null }>);

  const domainNotVerified = [...ownerErrors, clientEmailResult.error?.message]
    .filter((entry): entry is string => Boolean(entry))
    .some((entry) => entry.toLowerCase().includes("domain is not verified"));

  if (domainNotVerified) {
    ({ ownerResults, clientResult: clientEmailResult } = await sendEmails("onboarding@resend.dev"));
    ownerErrors = collectOwnerErrors(ownerResults as Array<{ error?: { message?: string } | null }>);
  }

  if (ownerErrors.length > 0) {
    throw new Error(`Owner inquiry notification failed - ${ownerErrors.join(" | ")}`);
  }

  if (clientEmailResult.error) {
    const testingModeError = clientEmailResult.error.message
      .toLowerCase()
      .includes("you can only send testing emails to your own email address");

    if (testingModeError) {
      console.warn("Inquiry confirmation skipped due to Resend testing mode restriction.");
      return;
    }

    throw new Error(`Inquiry confirmation failed - ${clientEmailResult.error.message}`);
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as InquiryPayload;

    const fullName = body.fullName?.trim() || "";
    const email = body.email?.trim() || "";
    const instagram = body.instagram?.trim() || "";
    const message = body.message?.trim() || "";

    if (!fullName || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name, email, and message are required.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    await sendInquiryEmails({
      fullName,
      email,
      instagram,
      message,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Inquiry submission failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to send inquiry right now. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}
