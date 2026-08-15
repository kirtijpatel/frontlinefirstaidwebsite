"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  ["/", "Home"], ["/about", "About Us"], ["/instructor-resources", "Instructor Resources"],
  ["/gallery", "Gallery"], ["/partners", "Partners"],
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
        <a className="instagram" href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
          <span className="instagram-logo" aria-hidden="true" />
        </a>
        <Link className="button button-small" href="/request-training">Request training</Link>
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
