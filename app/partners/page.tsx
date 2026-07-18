import Link from "next/link";
import { PageHero } from "@/components/page-parts";

export const metadata = { title: "Partners" };
const partners = ["Community Health", "Local Schools", "Student Organizations", "Neighborhood Groups"];
export default function Partners() {
  return <><PageHero eyebrow="Better together" title="Partnerships extend our reach." text="We collaborate with organizations that share our commitment to healthier, safer, more prepared communities." /><section className="container section"><div className="partner-grid">{partners.map((name, i) => <article key={name}><div className="partner-mark">{String(i + 1).padStart(2, "0")}</div><h3>{name}</h3><p>Partner description and logo can be added here.</p></article>)}</div></section><section className="partner-invite"><div className="container split"><div><span className="eyebrow light">Work with us</span><h2>Have a community we can serve together?</h2></div><div><p>We welcome partnerships with schools, nonprofits, student groups, and community organizations.</p><Link className="button" href="/request-training">Start a conversation →</Link></div></div></section></>;
}
