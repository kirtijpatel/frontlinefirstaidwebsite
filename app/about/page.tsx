import { Cta, PageHero } from "@/components/page-parts";

export const metadata = { title: "About Us" };
export default function About() {
  return <><PageHero eyebrow="Our story" title="Care starts before help arrives." text="Frontline Firstaid equips everyday people with the knowledge and confidence to act in an emergency." />
    <section className="container split section"><div><span className="eyebrow">Who we are</span><h2>Medical students with a shared purpose.</h2></div><div className="prose"><p className="lead">We are a student-run organization at the University of Virginia School of Medicine serving the Charlottesville community through practical health education.</p><p>We believe lifesaving skills belong to everyone. By making CPR and first aid training approachable, our instructors help remove the fear and uncertainty that can keep bystanders from stepping forward.</p><p>Every workshop centers hands-on practice, clear explanations, and respect for each learner’s starting point.</p></div></section>
    <Cta /></>;
}
