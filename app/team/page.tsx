import { PageHero } from "@/components/page-parts";

export const metadata = { title: "Our Team" };
const people = ["Executive Director", "Training Director", "Community Outreach", "Operations Lead", "Curriculum Lead", "Partnerships Lead"];
export default function Team() {
  return <><PageHero eyebrow="Meet the team" title="Students who teach, serve, and lead." text="Our team brings together future physicians who believe community education is an essential part of care." /><section className="container section"><div className="team-grid">{people.map((role, i) => <article className="person" key={role}><div className={`person-photo tone-${i + 1}`}><span>{String(i + 1).padStart(2, "0")}</span></div><h3>Team member</h3><p>{role}</p></article>)}</div><p className="placeholder-note">Team names and portraits are ready to be added when available.</p></section></>;
}
