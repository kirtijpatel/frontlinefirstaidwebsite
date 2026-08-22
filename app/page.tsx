import Image from "next/image";
import Link from "next/link";
import { Cta } from "@/components/page-parts";
import { fetchSharedSheetRows, headerIndex, rowIsVisible } from "@/lib/shared-sheet";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const offerings = [
  { icon: "heart", title: "Hands-only CPR", text: "Learn to recognize cardiac arrest, call for help, and deliver effective hands-only CPR." },
  { icon: "plus", title: "First Aid", text: "Build confidence responding to common injuries and urgent situations until help arrives." },
  { icon: "pill", title: "REVIVE Opioid Overdose", text: "Thanks to community partners, we are able to help set up REVIVE trainings to help recognize and manage opioid overdoses." },
  { icon: "bandage", title: "Stop the Bleed", text: "Thanks to community partners, we are able to help set up Stop the Bleed trainings to help recognize and manage life-threatening bleeding." },
];

type SiteStat = {
  label: string;
  value: number;
};

async function getSiteStats(): Promise<SiteStat[]> {
  const sheetRows = await fetchSharedSheetRows({ sheet: "Site Data" });
  if (!sheetRows?.length) return [];

  const [headers, ...rows] = sheetRows;
  const visibleIndex = headerIndex(headers, "visible");
  const metricIndex = headerIndex(headers, "metric", "label");
  const namedValueIndex = headerIndex(headers, "value", "count", "number");
  const labelColumn = metricIndex >= 0 ? metricIndex : 0;
  const valueColumn = namedValueIndex >= 0 ? namedValueIndex : 1;

  return rows.flatMap((row) => {
    if (!rowIsVisible(row, visibleIndex)) return [];

    const label = (row[labelColumn] || "").trim().replace(/:\s*$/, "");
    const numberMatch = (row[valueColumn] || "").match(/[\d][\d,]*/);
    if (!label || !numberMatch) return [];

    const value = Number(numberMatch[0].replaceAll(",", ""));
    return Number.isSafeInteger(value) && value >= 0 ? [{ label, value }] : [];
  }).slice(0, 2);
}

export default async function Home() {
  const siteStats = await getSiteStats();

  return <>
    <section className="hero">
      <Image className="hero-image" src="/images/frontline-hero-general-v1.png" alt="First aid supplies and a CPR training manikin in a calm instructional setting" fill priority unoptimized sizes="100vw" />
      <div className="hero-overlay" />
      <div className="hero-content container"><span className="eyebrow light">Student-led · Community-focused</span><h1>Skills that matter.<br /><em>Confidence that lasts.</em></h1><p>UVA medical students bringing practical CPR and first aid education to Charlottesville and beyond.</p>{siteStats.length > 0 && <div className="hero-stats">{siteStats.map((stat) => {
        const isAedStat = stat.label.toLowerCase().includes("aed");
        const isPeopleTrainedStat = stat.label.toLowerCase().includes("people") && stat.label.toLowerCase().includes("trained");
        return <div className="hero-stat" key={stat.label}><strong>{stat.value.toLocaleString("en-US")}</strong><span>{stat.label}</span><small>Since 2025</small>{isPeopleTrainedStat && <small className="hero-stat-partnership">In order to keep our CPR trainings free, we only offer non-certification hands-only CPR.</small>}{isAedStat && <small className="hero-stat-partnership">Thanks to our partnership with the <a href="https://www.compressandshock.org/" target="_blank" rel="noreferrer">Compress &amp; Shock Foundation</a>.</small>}</div>;
      })}</div>}<div className="hero-actions"><Link className="button" href="/request-training">Request Training <span>→</span></Link><Link className="text-link light" href="/about">Learn more about us <span>↗</span></Link></div></div>
      <div className="scroll-note">Scroll to explore <span>↓</span></div>
    </section>

    <section className="intro container section"><div><span className="eyebrow">Why Frontline Firstaid</span><h2>Emergency skills should feel <em>within reach.</em></h2></div><div><p className="lead">We make lifesaving education approachable, practical, and rooted in the needs of our community.</p><p>Our student instructors translate clinical knowledge into hands-on skills people can use when every second counts.</p><Link className="text-link" href="/about">Learn more about us <span>→</span></Link></div></section>

    <section className="offerings section"><div className="container"><span className="eyebrow offerings-eyebrow">What we teach</span><div className="cards">{offerings.map((item, i) => <article className="service-card" key={item.title}><span className="card-number">0{i + 1}</span><span className={`service-icon service-icon-${item.icon}`} aria-hidden="true" /><h3>{item.title}</h3><p>{item.text}</p>{item.title === "Hands-only CPR" && <p className="service-card-note">In order to keep our CPR trainings free, we only offer non-certification hands-only CPR.</p>}</article>)}</div></div></section>

    <Cta />
  </>;
}
