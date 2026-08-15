import { Cta, PageHero } from "@/components/page-parts";

export const metadata = { title: "About Us" };
export default function About() {
  return <><PageHero eyebrow="Who we are" title="Care starts before help arrives." text="We are a group of UVA medical students who believe that where you live shouldn’t determine whether you survive a medical emergency. Our goal is to equip communities across Charlottesville with the knowledge and skills to act during a medical emergency before first responders arrive." />
    <section className="container split section"><div><span className="eyebrow">Our mission</span><h2>Prepared bystanders can change the outcome.</h2></div><div className="prose"><p className="lead">Immediate bystander CPR can double or triple a person’s chance of survival after cardiac arrest.</p><p>Every minute CPR is delayed, the chance of survival decreases by about 10%. The actions taken before first responders arrive can make a lifesaving difference.</p><p>Our goal is to remove the lack of confidence and fear of causing harm that can keep people from stepping forward. We empower anyone facing a medical emergency with the knowledge and skills to take action.</p></div></section>
    <Cta /></>;
}
