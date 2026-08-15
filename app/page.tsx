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
      <Image className="hero-image" src="/images/frontline-hero-general-v1.png" alt="First aid supplies and a CPR training manikin in a calm instructional setting" fill priority unoptimized sizes="100vw" />
      <div className="hero-overlay" />
      <div className="hero-content container"><span className="eyebrow light">Student-led · Community-focused</span><h1>Skills that matter.<br /><em>Confidence that lasts.</em></h1><p>UVA medical students bringing practical CPR and first aid education to Charlottesville and beyond.</p><div className="hero-actions"><Link className="button" href="/request-training">Request Training / Contact <span>→</span></Link><Link className="text-link light" href="/about">Discover our mission <span>↗</span></Link></div></div>
      <div className="scroll-note">Scroll to explore <span>↓</span></div>
    </section>

    <section className="intro container section"><div><span className="eyebrow">Why Frontline Firstaid</span><h2>Emergency skills should feel <em>within reach.</em></h2></div><div><p className="lead">We make lifesaving education approachable, practical, and rooted in the needs of our community.</p><p>Our student instructors translate clinical knowledge into hands-on skills people can use when every second counts.</p><Link className="text-link" href="/about">More about our work <span>→</span></Link></div></section>

    <section className="offerings section"><div className="container"><div className="section-heading"><div><span className="eyebrow">What we teach</span><h2>Learn by doing.</h2></div><p>Clear instruction, realistic practice, and a welcoming space for every experience level.</p></div><div className="cards">{offerings.map((item, i) => <article className="service-card" key={item.title}><span className="card-number">0{i + 1}</span><span className="service-icon">{item.icon}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div></section>

    <Cta />
  </>;
}
