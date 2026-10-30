import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { google } from "googleapis";
import { Resend } from "resend";

type AppointmentPayload = {
  service: string;
  date: string;
  time: string;
  fullName: string;
  phone: string;
  email: string;
  instagram?: string;
  notes?: string;
};

function parseRecipients(value: string | undefined, fallback: string) {
  const source = value && value.trim().length > 0 ? value : fallback;
  return source
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function parseTimeSlotTo24h(time: string) {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    return { hours: 12, minutes: 0 };
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (meridiem === "PM" && hours !== 12) {
    hours += 12;
  }

  if (meridiem === "AM" && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
}

function buildStartAndEnd(date: string, time: string, durationMinutes: number) {
  const [year, month, day] = date.split("-").map(Number);
  const { hours, minutes } = parseTimeSlotTo24h(time);
  const start = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
  const end = new Date(start.getTime() + durationMinutes * 60_000);

  return { start, end };
}

function toLocalDateTimeString(date: Date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

function buildLocalDateTimeRange(date: string, time: string, durationMinutes: number) {
  const [year, month, day] = date.split("-").map(Number);
  const { hours, minutes } = parseTimeSlotTo24h(time);

  // Keep the selected wall-clock time and let Google interpret it with BOOKING_TIMEZONE.
  const start = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
  const end = new Date(start.getTime() + durationMinutes * 60_000);

  return {
    startDateTime: toLocalDateTimeString(start),
    endDateTime: toLocalDateTimeString(end),
  };
}

function toIcsDate(date: Date) {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

function escapeIcs(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function buildCalendarInvite(
  payload: AppointmentPayload,
  durationMinutes: number,
  options?: { uid?: string; method?: "REQUEST" | "PUBLISH" }
) {
  const uid = options?.uid || `${Date.now()}-${Math.random().toString(36).slice(2)}@looksbyslim.com`;
  const method = options?.method || "REQUEST";
  const now = new Date();
  const { start, end } = buildStartAndEnd(payload.date, payload.time, durationMinutes);

  const summary = `Looks By Slim Appointment - ${payload.fullName}`;
  const description = [
    `Service: ${payload.service}`,
    `Client: ${payload.fullName}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email}`,
    `Instagram: ${payload.instagram || "N/A"}`,
    `Notes: ${payload.notes || "N/A"}`,
  ].join("\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Looks By Slim//Booking//EN",
    "CALSCALE:GREGORIAN",
    `METHOD:${method}`,
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toIcsDate(now)}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcs(summary)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    "LOCATION:Looks By Slim",
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function buildAppointmentDescription(payload: AppointmentPayload) {
  return [
    `Service: ${payload.service}`,
    `Client: ${payload.fullName}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email}`,
    `Instagram: ${payload.instagram || "N/A"}`,
    `Notes: ${payload.notes || "N/A"}`,
  ].join("\n");
}

function toDateKey(dateValue: Date) {
  return `${dateValue.getUTCFullYear()}-${pad(dateValue.getUTCMonth() + 1)}-${pad(dateValue.getUTCDate())}`;
}

async function createGoogleCalendarEvent(payload: AppointmentPayload) {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const durationMinutes = Number(process.env.BOOKING_DURATION_MINUTES || "120");

  if (!clientEmail || !privateKey || !calendarId) {
    throw new Error("Missing GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, or GOOGLE_CALENDAR_ID");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  const calendar = google.calendar({ version: "v3", auth });
  const timeZone = process.env.BOOKING_TIMEZONE || "America/New_York";
  const { startDateTime, endDateTime } = buildLocalDateTimeRange(payload.date, payload.time, durationMinutes);

  await calendar.events.insert({
    calendarId,
    sendUpdates: "none",
    requestBody: {
      summary: `Looks By Slim Appointment - ${payload.fullName}`,
      description: buildAppointmentDescription(payload),
      location: "Looks By Slim",
      start: {
        dateTime: startDateTime,
        timeZone,
      },
      end: {
        dateTime: endDateTime,
        timeZone,
      },
      reminders: {
        useDefault: true,
      },
    },
  });
}

async function sendBookingEmails(payload: AppointmentPayload) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Looks By Slim <info@looksbyslim.com>";
  const slimEmail = process.env.EMAIL_TO_SLIM || "info@looksbyslim.com";
  const bookingNotificationRecipients = parseRecipients(
    process.env.BOOKING_NOTIFICATION_EMAILS,
    slimEmail
  );
  const durationMinutes = Number(process.env.BOOKING_DURATION_MINUTES || "120");
  const depositAmount = process.env.DEPOSIT_AMOUNT || "$50";
  const stripeDepositLink = process.env.STRIPE_DEPOSIT_LINK;

  if (!resendApiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const resend = new Resend(resendApiKey);
  const invite = buildCalendarInvite(payload, durationMinutes);
  const appointmentSummary = `${payload.date} at ${payload.time}`;
  const paymentHtml = stripeDepositLink
    ? `<p><a href="${stripeDepositLink}" style="display:inline-block;background:#e6c28b;color:#000;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600;">Pay Deposit</a></p>`
    : "";

  const sendEmails = async (sender: string) => {
    const clientResult = await resend.emails.send({
      from: sender,
      to: payload.email,
      subject: "Appointment request received - deposit required",
      html: `
        <h2>Appointment Request Received</h2>
        <p>Hi ${payload.fullName},</p>
        <p>Thank you for booking with Looks By Slim. We received your request and will confirm shortly.</p>
        <p><strong>A ${depositAmount} non-refundable deposit is required to secure your appointment.</strong></p>
        <p><strong>Service:</strong> ${payload.service}<br />
        <strong>Date & Time:</strong> ${appointmentSummary}</p>
        ${paymentHtml}
        <p>If you have any questions, reply to this email and we'll help right away.</p>
        <p>We attached a calendar invite you can save to your calendar.</p>
      `,
      replyTo: slimEmail,
      attachments: [
        {
          filename: "looksbyslim-appointment.ics",
          content: Buffer.from(invite).toString("base64"),
          contentType: "text/calendar; charset=utf-8; method=REQUEST",
        },
      ],
    });

    const ownerResults = await Promise.all(
      bookingNotificationRecipients.map((recipient) =>
        resend.emails.send({
          from: sender,
          to: recipient,
          subject: `New Booking Request: ${payload.fullName} (${payload.service})`,
          html: `
            <h2>New Appointment Request</h2>
            <p><strong>Deposit Status:</strong> Pending (${depositAmount})</p>
            <p><strong>Client:</strong> ${payload.fullName}</p>
            <p><strong>Phone:</strong> ${payload.phone}</p>
            <p><strong>Email:</strong> ${payload.email}</p>
            <p><strong>Service:</strong> ${payload.service}</p>
            <p><strong>Date:</strong> ${payload.date}</p>
            <p><strong>Time:</strong> ${payload.time}</p>
            <p><strong>Instagram:</strong> ${payload.instagram || "N/A"}</p>
            <p><strong>Notes:</strong> ${payload.notes || "N/A"}</p>
          `,
          replyTo: payload.email,
          attachments: [
            {
              filename: "new-booking.ics",
              content: Buffer.from(invite).toString("base64"),
              contentType: "text/calendar; charset=utf-8; method=REQUEST",
            },
          ],
        })
      )
    );

    return { clientResult, ownerResults };
  };

  const collectOwnerErrors = (ownerResults: Array<{ error?: { message?: string } | null }>) => {
    return ownerResults
      .map((result, index) => {
        const errorMessage = result.error?.message;
        if (!errorMessage) return null;
        return `${bookingNotificationRecipients[index]}: ${errorMessage}`;
      })
      .filter((entry): entry is string => Boolean(entry));
  };

  let { clientResult: clientEmailResult, ownerResults } = await sendEmails(from);
  let ownerErrors = collectOwnerErrors(ownerResults as Array<{ error?: { message?: string } | null }>);

  const domainNotVerified = [clientEmailResult.error?.message, ...ownerErrors]
    .filter((message): message is string => Boolean(message))
    .some((message) => message.toLowerCase().includes("domain is not verified"));

  if (domainNotVerified) {
    ({ clientResult: clientEmailResult, ownerResults } = await sendEmails("onboarding@resend.dev"));
    ownerErrors = collectOwnerErrors(ownerResults as Array<{ error?: { message?: string } | null }>);
  }

  if (clientEmailResult.error) {
    const clientError = `client: ${clientEmailResult.error.message}`;
    const ownerErrorDetails = ownerErrors.length > 0 ? `owner: ${ownerErrors.join(" | ")}` : null;
    const details = [clientError, ownerErrorDetails].filter(Boolean).join(" | ");
    throw new Error(`Resend delivery failed - ${details}`);
  }

  if (ownerErrors.length > 0) {
    const testingModeError = ownerErrors
      .some((message) => message.toLowerCase().includes("you can only send testing emails to your own email address"));

    if (testingModeError) {
      console.warn("Owner booking notification skipped due to Resend testing mode restriction.");
      return;
    }

    throw new Error(`Resend owner notification failed - ${ownerErrors.join(" | ")}`);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as AppointmentPayload;

    if (!body?.date || !body?.time || !body?.service || !body?.fullName || !body?.email || !body?.phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required appointment fields",
        },
        { status: 400 }
      );
    }

    const requestedDate = new Date(body.date);

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date: requestedDate,
        time: body.time,
      },
      select: {
        id: true,
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        {
          success: false,
          message: "This date and time is already booked. Please choose another slot.",
        },
        { status: 409 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        service: body.service,
        date: requestedDate,
        time: body.time,
        fullName: body.fullName,
        phone: body.phone,
        email: body.email,
        instagram: body.instagram,
        notes: body.notes,
      },
    });

    const integrations = {
      email: "pending",
      calendarInvite: "pending",
      calendarServer: "pending",
    };

    try {
      await sendBookingEmails(body);
      integrations.email = "sent";
      integrations.calendarInvite = "sent";
    } catch (integrationError) {
      console.error("Booking email/invite failed:", integrationError);
      integrations.email = "failed";
      integrations.calendarInvite = "failed";
    }

    try {
      await createGoogleCalendarEvent(body);
      integrations.calendarServer = "sent";
    } catch (calendarError) {
      console.error("Google Calendar event failed:", calendarError);
      integrations.calendarServer = "failed";
    }

    return NextResponse.json(
      {
        success: true,
        appointment,
        integrations,
      },
      { status: 201 }
    );

  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "This date and time is already booked. Please choose another slot.",
        },
        { status: 409 }
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create appointment",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      select: {
        date: true,
        time: true,
      },
    });

    const bookedSlotsByDate: Record<string, string[]> = {};

    for (const appointment of appointments) {
      const dateKey = toDateKey(appointment.date);
      if (!bookedSlotsByDate[dateKey]) {
        bookedSlotsByDate[dateKey] = [];
      }

      if (!bookedSlotsByDate[dateKey].includes(appointment.time)) {
        bookedSlotsByDate[dateKey].push(appointment.time);
      }
    }

    return NextResponse.json(
      {
        success: true,
        bookedSlotsByDate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load appointment availability",
      },
      { status: 500 }
    );
  }
}