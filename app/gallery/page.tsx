import Image from "next/image";
import { PageHero } from "@/components/page-parts";

export const metadata = { title: "Gallery" };
export default function Gallery() {
  return <><PageHero eyebrow="In the community" title="Learning looks better hands-on." text="A glimpse at the workshops, partnerships, and people that bring our mission to life." /><section className="container section"><div className="gallery-grid">{Array.from({ length: 6 }).map((_, i) => <figure key={i} className={`gallery-item item-${i + 1}`}><Image src="/images/firstaid-training-hero.png" alt="Frontline Firstaid training session placeholder" fill sizes="(max-width: 700px) 100vw, 50vw" /><figcaption><span>Community training</span><small>Charlottesville, VA</small></figcaption></figure>)}</div><p className="placeholder-note">Replace these crops with your organization’s workshop photos.</p></section></>;
}
