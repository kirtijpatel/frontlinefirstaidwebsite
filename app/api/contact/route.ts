import { NextResponse } from "next/server";

const TO_EMAIL = "uvafrontlinefirstaid@gmail.com";

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character] || character);
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const formType = clean(data.formType, 30);
    const firstName = clean(data.firstName, 80);
    const lastName = clean(data.lastName, 80);
    const email = clean(data.email, 254);
    const organization = clean(data.organization, 160);
    const message = clean(data.message, 5000);
    const honeypot = clean(data.website, 200);

    if (honeypot) return NextResponse.json({ ok: true });
    if (!firstName || !lastName || !email || !validEmail(email)) {
      return NextResponse.json({ error: "Please provide your name and a valid email address." }, { status: 400 });
    }

    let emailSubject: string;
    let emailText: string;
    let emailHtml: string;
    const name = `${firstName} ${lastName}`;

    if (formType === "training") {
      const size = clean(data.size, 80);
      const timeframe = clean(data.timeframe, 120);
      const topics = Array.isArray(data.topics)
        ? data.topics.map((topic: unknown) => clean(topic, 80)).filter(Boolean).slice(0, 10)
        : [];

      if (!organization) {
        return NextResponse.json({ error: "Please provide your organization or group." }, { status: 400 });
      }

      emailSubject = `[Frontline Firstaid] Training request from ${organization}`;
      emailText = `New training request\n\nName: ${name}\nEmail: ${email}\nOrganization: ${organization}\nGroup size: ${size || "Not provided"}\nPreferred timeframe: ${timeframe || "Not provided"}\nTopics: ${topics.join(", ") || "Not provided"}\n\nAdditional details:\n${message || "None provided"}`;
      emailHtml = `<h2>New Frontline Firstaid training request</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Organization:</strong> ${escapeHtml(organization)}</p><p><strong>Group size:</strong> ${escapeHtml(size || "Not provided")}</p><p><strong>Preferred timeframe:</strong> ${escapeHtml(timeframe || "Not provided")}</p><p><strong>Topics:</strong> ${escapeHtml(topics.join(", ") || "Not provided")}</p><hr><p><strong>Additional details:</strong><br>${escapeHtml(message || "None provided").replace(/\n/g, "<br>")}</p>`;
    } else {
      const subject = clean(data.subject, 100);
      if (!subject || !message) {
        return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
      }

      emailSubject = `[Frontline Firstaid] ${subject}`;
      emailText = `Name: ${name}\nEmail: ${email}\nOrganization: ${organization || "Not provided"}\nSubject: ${subject}\n\n${message}`;
      emailHtml = `<h2>New Frontline Firstaid website message</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Organization:</strong> ${escapeHtml(organization || "Not provided")}</p><p><strong>Subject:</strong> ${escapeHtml(subject)}</p><hr><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`;
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;
    if (!apiKey || !fromEmail) {
      return NextResponse.json({ error: "Email delivery is not configured yet. Please email us directly at uvafrontlinefirstaid@gmail.com." }, { status: 503 });
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: fromEmail,
        to: [TO_EMAIL],
        reply_to: email,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      console.error("Contact email provider error", emailResponse.status);
      return NextResponse.json({ error: "Your message could not be sent. Please try again or email us directly." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
