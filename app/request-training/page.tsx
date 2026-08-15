"use client";

import { FormEvent, useState } from "react";
import { PageHero } from "@/components/page-parts";

export default function RequestTraining() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, formType: "training", topics: formData.getAll("topic") }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to send your request.");
      form.reset();
      setStatus("sent");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to send your request.");
      setStatus("error");
    }
  }

  return <>
    <PageHero
      eyebrow="Bring us to your group"
      title="Request Training / Contact"
      text="Tell us a little about your audience and goals, or contact our student team with a question. We’ll follow up to help with your request."
    />
    <section className="container form-layout section">
      <aside>
        <h2>What to expect</h2>
        <ol>
          <li><b>Share your needs</b><span>Tell us about your group, timing, and topics.</span></li>
          <li><b>Plan together</b><span>We’ll confirm availability and workshop details.</span></li>
          <li><b>Learn hands-on</b><span>Our instructors bring the session to life.</span></li>
        </ol>
        <div className="contact-box"><span>Questions first?</span><a href="mailto:uvafrontlinefirstaid@gmail.com">uvafrontlinefirstaid@gmail.com</a></div>
      </aside>
      {status === "sent" ? <div className="success">
        <span>✓</span>
        <h2>Thanks for reaching out.</h2>
        <p>Your request has been sent to the Frontline Firstaid team. We’ll follow up as soon as possible.</p>
        <button className="text-link" onClick={() => setStatus("idle")}>Send another request →</button>
      </div> : <form className="training-form" onSubmit={submit}>
        <div className="field-row">
          <label>First name<input required name="firstName" placeholder="Jane" /></label>
          <label>Last name<input required name="lastName" placeholder="Doe" /></label>
        </div>
        <label>Email address<input required type="email" name="email" placeholder="jane@example.org" /></label>
        <label>Organization or group<input required name="organization" placeholder="Organization name" /></label>
        <div className="field-row">
          <label>Estimated group size<select name="size" defaultValue=""><option value="" disabled>Select one</option><option>Under 10</option><option>10–25</option><option>26–50</option><option>More than 50</option></select></label>
          <label>Preferred timeframe<input name="timeframe" placeholder="e.g. October 2026" /></label>
        </div>
        <fieldset>
          <legend>What are you interested in?</legend>
          <div className="checks">
            <label><input type="checkbox" name="topic" value="CPR" /> CPR fundamentals</label>
            <label><input type="checkbox" name="topic" value="First aid" /> First aid essentials</label>
            <label><input type="checkbox" name="topic" value="Custom" /> Custom workshop</label>
          </div>
        </fieldset>
        <label>Anything else we should know?<textarea name="message" rows={5} placeholder="Tell us about your audience, goals, or accessibility needs." /></label>
        <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        {status === "error" && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-dark" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : <>Submit request <span>→</span></>}</button>
        <small>Your request will be sent to uvafrontlinefirstaid@gmail.com.</small>
      </form>}
    </section>
  </>;
}
