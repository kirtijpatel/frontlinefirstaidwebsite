"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function InstructorLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/instructor-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to unlock this page.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to unlock this page.");
      setSubmitting(false);
    }
  }

  return <section className="container instructor-login-section section">
    <div className="instructor-login-copy">
      <span className="eyebrow">Private access</span>
      <h2>For Frontline instructors.</h2>
      <p>Enter the shared instructor password to access teaching materials, session guidance, and team resources.</p>
    </div>
    <form className="training-form instructor-login-form" onSubmit={submit} autoComplete="off">
      <label htmlFor="instructor-password">Instructor password
        <input
          id="instructor-password"
          name="instructor-access-code"
          type="text"
          className="masked-access-code"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          data-1p-ignore
          data-lpignore="true"
          data-bwignore="true"
          required
          autoFocus
        />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button" type="submit" disabled={submitting}>{submitting ? "Unlocking…" : <>Enter resources <span>→</span></>}</button>
    </form>
  </section>;
}

export function InstructorLogout() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  async function logout() {
    setSubmitting(true);
    await fetch("/api/instructor-access", { method: "DELETE" });
    router.refresh();
  }
  return <button className="text-link instructor-logout" type="button" onClick={logout} disabled={submitting}>
    {submitting ? "Signing out…" : "Lock instructor resources →"}
  </button>;
}
