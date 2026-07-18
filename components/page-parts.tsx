import Link from "next/link";

export function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <section className="page-hero"><div className="container narrow"><span className="eyebrow light">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div></section>;
}

export function Cta() {
  return <section className="cta container"><div><span className="eyebrow light">Bring training to your group</span><h2>Prepared people build safer communities.</h2></div><Link className="button button-light" href="/request-training">Request a session <span>→</span></Link></section>;
}
