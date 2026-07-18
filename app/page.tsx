import Image from "next/image";
import Link from "next/link";
import { Cta } from "@/components/page-parts";

const offerings = [
  { icon: "♥", title: "CPR fundamentals", text: "Learn to recognize cardiac arrest, call for help, and deliver effective hands-only CPR." },
  { icon: "+", title: "First aid essentials", text: "Build confidence responding to common injuries and urgent situations until help arrives." },
  { icon: "⚕", title: "Community workshops", text: "Accessible, hands-on sessions designed around the needs of your school, team, or organization." },
];

export default function Home() {
  return <>
    <section className="hero">
      <Image className="hero-image" src="/images/frontline-training-hero-v2.png" alt="A student instructor teaching CPR to community members" fill priority sizes="100vw" />
      <div className="hero-overlay" />
      <div className="hero-content container"><span className="eyebrow light">Student-led · Community-focused</span><h1>Skills that matter.<br /><em>Confidence that lasts.</em></h1><p>UVA medical students bringing practical CPR and first aid education to Charlottesville and beyond.</p><div className="hero-actions"><Link className="button" href="/request-training">Request training <span>→</span></Link><Link className="text-link light" href="/about">Discover our mission <span>↗</span></Link></div></div>
      <div className="scroll-note">Scroll to explore <span>↓</span></div>
    </section>

    <section className="intro container section"><div><span className="eyebrow">Why Frontline Firstaid</span><h2>Emergency skills should feel <em>within reach.</em></h2></div><div><p className="lead">We make lifesaving education approachable, practical, and rooted in the needs of our community.</p><p>Our student instructors translate clinical knowledge into hands-on skills people can use when every second counts.</p><Link className="text-link" href="/about">More about our work <span>→</span></Link></div></section>

    <section className="offerings section"><div className="container"><div className="section-heading"><div><span className="eyebrow">What we teach</span><h2>Learn by doing.</h2></div><p>Clear instruction, realistic practice, and a welcoming space for every experience level.</p></div><div className="cards">{offerings.map((item, i) => <article className="service-card" key={item.title}><span className="card-number">0{i + 1}</span><span className="service-icon">{item.icon}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div></section>

    <section className="impact section container"><div className="impact-image"><Image src="/images/frontline-training-hero-v2.png" alt="Hands-on CPR workshop" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><div className="impact-copy"><span className="eyebrow">Made for the community</span><h2>Training that meets people where they are.</h2><p>From student organizations to neighborhood groups, we tailor sessions to the people in the room—keeping the learning useful, interactive, and memorable.</p><div className="stats"><div><strong>Hands-on</strong><span>Skills-based learning</span></div><div><strong>Accessible</strong><span>Community-first approach</span></div></div><Link className="button button-dark" href="/gallery">See us in action <span>→</span></Link></div></section>
    <Cta />
  </>;
}
