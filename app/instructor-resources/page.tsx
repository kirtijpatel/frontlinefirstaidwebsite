import { cookies } from "next/headers";
import { PageHero } from "@/components/page-parts";
import { INSTRUCTOR_COOKIE, hasInstructorAccess } from "@/lib/instructor-auth";
import { InstructorLogin, InstructorLogout } from "./instructor-login";

export const dynamic = "force-dynamic";

export default async function InstructorResources() {
  const cookieStore = await cookies();
  const unlocked = await hasInstructorAccess(cookieStore.get(INSTRUCTOR_COOKIE)?.value);

  return <>
    <PageHero eyebrow="Instructor portal" title="Instructor Resources" text={unlocked ? "Teaching materials and practical guidance for Frontline Firstaid instructors." : "A private resource library for members of the Frontline Firstaid instructor team."} />
    {unlocked ? <section className="container instructor-resources section">
      <div className="section-heading">
        <div><span className="eyebrow">Resource library</span><h2>Everything you need to lead a session.</h2></div>
        <InstructorLogout />
      </div>
      <div className="resource-grid">
        <article><span>01</span><h3>Training materials</h3><p>Instructor slides, lesson plans, and participant handouts will live here.</p><small>Resources coming soon</small></article>
        <article><span>02</span><h3>Session guidance</h3><p>Preparation checklists and facilitation tips for confident, consistent workshops.</p><small>Resources coming soon</small></article>
        <article><span>03</span><h3>Team coordination</h3><p>Shared information for upcoming trainings, logistics, and instructor communication.</p><small>Resources coming soon</small></article>
      </div>
      <div className="resource-help"><strong>Need something added?</strong><p>Email the team at <a href="mailto:uvafrontlinefirstaid@gmail.com">uvafrontlinefirstaid@gmail.com</a>.</p></div>
    </section> : <InstructorLogin />}
  </>;
}
