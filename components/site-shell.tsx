"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["/", "Home"], ["/about", "About Us"], ["/contact", "Contact Us"],
  ["/gallery", "Gallery"], ["/partners", "Partners"],
] as const;

export function Brand() {
  return <Link className="brand" href="/" aria-label="Frontline Firstaid home">
    <span className="brand-mark"><span>+</span></span>
    <span><strong>Frontline</strong><small>FIRSTAID</small></span>
  </Link>;
}

export function Header() {
  const path = usePathname();
  return <header className={path === "/" ? "site-header home-header" : "site-header"}>
    <div className="nav-wrap">
      <Brand />
      <nav className="nav-links" aria-label="Main navigation">
        {links.map(([href, label]) => <Link key={href} className={path === href ? "active" : ""} href={href}>{label}</Link>)}
        <a className="instagram" href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">◎</a>
        <Link className="button button-small" href="/request-training">Request training</Link>
      </nav>
    </div>
  </header>;
}

export function Footer() {
  return <footer className="footer">
    <div className="footer-grid container">
      <div><Brand /><p>Practical skills. Confident communities.<br />Student-led at the University of Virginia.</p></div>
      <div><h3>Explore</h3><Link href="/about">About us</Link><Link href="/contact">Contact us</Link><Link href="/gallery">Gallery</Link></div>
      <div><h3>Get involved</h3><Link href="/request-training">Request training</Link><Link href="/partners">Partner with us</Link><a href="mailto:uvafrontlinefirstaid@gmail.com">Email our team</a></div>
      <div><h3>Stay connected</h3><p>Follow our work and upcoming community events.</p><a className="social-link" href="https://www.instagram.com/" target="_blank" rel="noreferrer">◎ Instagram ↗</a></div>
    </div>
    <div className="footer-bottom container"><span>© {new Date().getFullYear()} Frontline Firstaid</span><span>Independent student organization at UVA</span></div>
  </footer>;
}
