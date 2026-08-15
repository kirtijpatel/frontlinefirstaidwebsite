"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  ["/", "Home"], ["/about", "About Us"], ["/instructor-resources", "Instructor Resources"],
  ["/gallery", "Gallery"],
] as const;

const partners = [
  ["https://www.compressandshock.org/", "Compress and Shock"],
  ["https://www.stopthebleedofficial.com/all-products.html?utm_term=cat%20tourniquet&utm_campaign=Stop+The+Bleed+Search+Traffic&utm_source=adwords&utm_medium=ppc&hsa_acc=1576333358&hsa_cam=21988832763&hsa_grp=173357723882&hsa_ad=724607449664&hsa_src=g&hsa_tgt=aud-2410115170044:kwd-317255939661&hsa_kw=cat%20tourniquet&hsa_mt=b&hsa_net=adwords&hsa_ver=3&gad_source=1&gad_campaignid=21988832763&gbraid=0AAAAA-ngInOExChI4gNseF5Kt9kS3PQTy&gclid=Cj0KCQjwnIDUBhDrARIsAJDGwSuvDubHWxBXpotmwpUVKqh2TK5B8_1vnX9ywAIwAbIngL4s_eCUa1kaAldlEALw_wcB", "Stop the Bleed"],
  ["https://regionten.org/", "Region Ten"],
  ["https://www.firstonscene.us/", "First on Scene"],
] as const;

export function Brand() {
  return <Link className="brand" href="/" aria-label="Frontline Firstaid home">
    <Image
      className="brand-logo"
      src="/images/frontline-first-aid-logo.jpeg"
      alt=""
      width={58}
      height={58}
      priority
      unoptimized
    />
    <strong className="brand-name">Frontline First Aid</strong>
  </Link>;
}

export function Header() {
  const path = usePathname();
  return <header className={path === "/" ? "site-header home-header" : "site-header"}>
    <div className="nav-wrap">
      <Brand />
      <nav className="nav-links" aria-label="Main navigation">
        {links.map(([href, label]) => <Link key={href} className={path === href ? "active" : ""} href={href}>{label}</Link>)}
        <div className="nav-dropdown">
          <button className="nav-dropdown-trigger" type="button" aria-haspopup="menu">Partners <span aria-hidden="true">⌄</span></button>
          <div className="partner-dropdown" role="menu">
            {partners.map(([href, label]) => <a href={href} target="_blank" rel="noreferrer" role="menuitem" key={href}>{label}<span aria-hidden="true">↗</span></a>)}
          </div>
        </div>
        <a className="instagram" href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
          <span className="instagram-logo" aria-hidden="true" />
        </a>
        <Link className="button button-small" href="/request-training">Request Training / Contact</Link>
      </nav>
    </div>
  </header>;
}

export function Footer() {
  return <footer className="footer">
    <div className="footer-grid container">
      <div><Brand /><p>Practical skills. Confident communities.<br />Student-led at the University of Virginia.</p></div>
      <div><h3>Explore</h3><Link href="/about">About us</Link><Link href="/instructor-resources">Instructor resources</Link><Link href="/gallery">Gallery</Link></div>
      <div><h3>Stay connected</h3><p>Follow our work and upcoming community events.</p><a className="social-link" href="https://www.instagram.com/" target="_blank" rel="noreferrer">◎ Instagram ↗</a></div>
    </div>
    <div className="footer-bottom container"><span>© {new Date().getFullYear()} Frontline Firstaid</span><span>Independent student organization at UVA</span></div>
  </footer>;
}
