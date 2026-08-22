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
    <section className="container form-layout form-layout-single section">
      {status === "sent" ? <div className="success">
        <span>✓</span>
        <h2>Thanks for reaching out.</h2>
        <p>Your request has been saved for the Frontline Firstaid team. We’ll follow up as soon as possible.</p>
        <button className="text-link" onClick={() => setStatus("idle")}>Send another request →</button>
      </div> : <form className="training-form" onSubmit={submit}>
        <div className="field-row">
          <label>First name<input required name="firstName" placeholder="Jane" /></label>
          <label>Last name<input required name="lastName" placeholder="Doe" /></label>
        </div>
        <label>Email address<input required type="email" name="email" placeholder="jane@example.org" /></label>
        <label>How can we help?<textarea name="message" rows={8} placeholder={"If you are contacting us about setting up a training, we would love to know:\n\n• Organization/group\n• Estimated group size\n• Preferred timeframe\n• Type of training (CPR, First Aid, Opioid Overdose)"} /></label>
        <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        {status === "error" && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-dark" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : <>Submit request <span>→</span></>}</button>
        <small className="direct-contact">You can also contact us directly by emailing <a href="mailto:uvafrontlinefirstaid@gmail.com">uvafrontlinefirstaid@gmail.com</a>.</small>
      </form>}
    </section>
  </>;
}
