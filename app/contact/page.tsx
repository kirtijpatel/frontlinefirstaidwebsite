"use client";

import { FormEvent, useState } from "react";
import { PageHero } from "@/components/page-parts";

type FormStatus = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Unable to send your message.");
      form.reset();
      setStatus("sent");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to send your message.");
      setStatus("error");
    }
  }

  return <>
    <PageHero eyebrow="Get in touch" title="We’d love to hear from you." text="Have a question, partnership idea, or want to learn more about Frontline Firstaid? Send our student team a message." />
    <section className="container form-layout contact-layout section">
      <aside>
        <span className="eyebrow">Contact Frontline</span>
        <h2>Start a conversation.</h2>
        <p>For general questions, community partnerships, or organization inquiries, use the form and our team will respond as soon as possible.</p>
        <div className="contact-box contact-email"><span>Email us directly</span><a href="mailto:uvafrontlinefirstaid@gmail.com">uvafrontlinefirstaid@gmail.com</a></div>
        <p className="response-note">For a CPR or first aid workshop, please use our Request Training page so we can collect the details needed to plan your session.</p>
      </aside>

      {status === "sent" ? <div className="success" role="status">
        <span>✓</span><h2>Message sent.</h2><p>Thank you for contacting Frontline Firstaid. Your message has been delivered to our student team.</p>
        <button className="text-link" onClick={() => setStatus("idle")}>Send another message →</button>
      </div> : <form className="training-form" onSubmit={submit}>
        <div className="field-row">
          <label>First name<input required name="firstName" autoComplete="given-name" maxLength={80} placeholder="Jane" /></label>
          <label>Last name<input required name="lastName" autoComplete="family-name" maxLength={80} placeholder="Doe" /></label>
        </div>
        <label>Email address<input required type="email" name="email" autoComplete="email" maxLength={254} placeholder="jane@example.org" /></label>
        <label>Organization or group <span className="optional">Optional</span><input name="organization" maxLength={160} placeholder="Organization name" /></label>
        <label>Subject<select required name="subject" defaultValue=""><option value="" disabled>Select a topic</option><option>General question</option><option>Community partnership</option><option>Volunteer interest</option><option>Media inquiry</option><option>Other</option></select></label>
        <label>Message<textarea required name="message" rows={7} maxLength={5000} placeholder="How can we help?" /></label>
        <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        {status === "error" && <p className="form-error" role="alert">{error}</p>}
        <button className="button" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : <>Send message <span>→</span></>}</button>
        <small>Your message will be sent to uvafrontlinefirstaid@gmail.com.</small>
      </form>}
    </section>
  </>;
}
