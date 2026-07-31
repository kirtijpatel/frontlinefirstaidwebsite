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

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const firstName = clean(data.firstName, 80);
    const lastName = clean(data.lastName, 80);
    const email = clean(data.email, 254);
    const organization = clean(data.organization, 160);
    const subject = clean(data.subject, 100);
    const message = clean(data.message, 5000);
    const honeypot = clean(data.website, 200);

    if (honeypot) return NextResponse.json({ ok: true });
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;
    if (!apiKey || !fromEmail) {
      return NextResponse.json({ error: "Email delivery is not configured yet. Please email us directly." }, { status: 503 });
    }

    const name = `${firstName} ${lastName}`;
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: fromEmail,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `[Frontline Firstaid] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nOrganization: ${organization || "Not provided"}\nSubject: ${subject}\n\n${message}`,
        html: `<h2>New Frontline Firstaid website message</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Organization:</strong> ${escapeHtml(organization || "Not provided")}</p><p><strong>Subject:</strong> ${escapeHtml(subject)}</p><hr><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
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
