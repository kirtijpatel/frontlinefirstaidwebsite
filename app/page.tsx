import Image from "next/image";
import Link from "next/link";
import { Cta } from "@/components/page-parts";
import { fetchSharedSheetRows, headerIndex, rowIsVisible } from "@/lib/shared-sheet";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const offerings = [
  { icon: "♥", title: "Hands-only CPR", text: "Learn to recognize cardiac arrest, call for help, and deliver effective hands-only CPR." },
  { icon: "+", title: "First Aid", text: "Build confidence responding to common injuries and urgent situations until help arrives." },
  { icon: "R", title: "REVIVE Opioid Overdose", text: "Thanks to community partners, we are able to help set up REVIVE trainings to help recognize and manage opioid overdoses." },
  { icon: "S", title: "Stop the Bleed", text: "Thanks to community partners, we are able to help set up Stop the Bleed trainings to help recognize and manage life-threatening bleeding." },
];

async function getPeopleTrained() {
  const sheetRows = await fetchSharedSheetRows({ sheet: "Site Stats" });
  if (!sheetRows?.length) return null;

  const [headers, ...rows] = sheetRows;
  const visibleIndex = headerIndex(headers, "visible");
  const metricIndex = headerIndex(headers, "metric", "label");
  const valueIndex = headerIndex(headers, "value", "count", "number");
  if (metricIndex < 0 || valueIndex < 0) return null;

  const peopleTrainedRow = rows.find((row) => {
    const metric = (row[metricIndex] || "").trim().toLowerCase();
    return rowIsVisible(row, visibleIndex) && ["people trained", "people-trained", "people_trained"].includes(metric);
  });
  if (!peopleTrainedRow) return null;

  const numberMatch = (peopleTrainedRow[valueIndex] || "").match(/[\d][\d,]*/);
  if (!numberMatch) return null;

  const count = Number(numberMatch[0].replaceAll(",", ""));
  return Number.isSafeInteger(count) && count >= 0 ? count : null;
}

export default async function Home() {
  const peopleTrained = await getPeopleTrained();

  return <>
    <section className="hero">
      <Image className="hero-image" src="/images/frontline-hero-general-v1.png" alt="First aid supplies and a CPR training manikin in a calm instructional setting" fill priority unoptimized sizes="100vw" />
      <div className="hero-overlay" />
      <div className="hero-content container"><span className="eyebrow light">Student-led · Community-focused</span><h1>Skills that matter.<br /><em>Confidence that lasts.</em></h1><p>UVA medical students bringing practical CPR and first aid education to Charlottesville and beyond.</p><div className="hero-actions"><Link className="button" href="/request-training">Request Training <span>→</span></Link><Link className="text-link light" href="/about">Learn more about us <span>↗</span></Link></div></div>
      <div className="scroll-note">Scroll to explore <span>↓</span></div>
    </section>

    <section className="intro container section"><div><span className="eyebrow">Why Frontline Firstaid</span><h2>Emergency skills should feel <em>within reach.</em></h2></div><div><p className="lead">We make lifesaving education approachable, practical, and rooted in the needs of our community.</p><p>Our student instructors translate clinical knowledge into hands-on skills people can use when every second counts.</p><Link className="text-link" href="/about">Learn more about us <span>→</span></Link></div></section>

    {peopleTrained !== null && <section className="community-impact"><div className="container community-impact-inner"><div><span className="eyebrow light">Our community impact</span><h2>Practical skills.<br /><em>Real reach.</em></h2></div><div className="training-counter" aria-label={`${peopleTrained.toLocaleString("en-US")} people trained`}><strong>{peopleTrained.toLocaleString("en-US")}</strong><span>People trained</span><small>and counting</small></div></div></section>}

    <section className="offerings section"><div className="container"><span className="eyebrow offerings-eyebrow">What we teach</span><div className="cards">{offerings.map((item, i) => <article className="service-card" key={item.title}><span className="card-number">0{i + 1}</span><span className="service-icon">{item.icon}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div><p className="offerings-note">In order to keep our trainings free, we do not offer certifications.</p></div></section>

    <Cta />
  </>;
}
