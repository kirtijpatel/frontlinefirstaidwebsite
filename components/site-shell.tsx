"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  ["/", "Home"], ["/about", "About Us"], ["/instructor-resources", "Instructor Resources"],
  ["/gallery", "Gallery"],
] as const;

const partners = [
  ["https://www.compressandshock.org/", "Compress and Shock"],
  ["https://www.stopthebleedofficial.com/", "Stop the Bleed"],
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
  const previousPath = useRef(path);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
    const leftInstructorResources = previousPath.current === "/instructor-resources" && path !== "/instructor-resources";
    previousPath.current = path;

    if (leftInstructorResources) {
      void fetch("/api/instructor-access", {
        method: "DELETE",
        keepalive: true,
        cache: "no-store",
      });
    }
  }, [path]);

  return <header className={path === "/" ? "site-header home-header" : "site-header"}>
    <div className="nav-wrap">
      <Brand />
      <button className="nav-menu-toggle" type="button" aria-expanded={navOpen} aria-controls="main-navigation" onClick={() => setNavOpen((open) => !open)}>
        <span aria-hidden="true" />
        <span className="sr-only">{navOpen ? "Close navigation menu" : "Open navigation menu"}</span>
      </button>
      <nav id="main-navigation" className={`nav-links ${navOpen ? "nav-links-open" : ""}`} aria-label="Main navigation">
        {links.map(([href, label]) => <Link key={href} className={path === href ? "active" : ""} href={href} onClick={() => setNavOpen(false)}>{label}</Link>)}
        <div className="nav-dropdown">
          <button className="nav-dropdown-trigger" type="button" aria-haspopup="menu">Partners <span aria-hidden="true">⌄</span></button>
          <div className="partner-dropdown" role="menu">
            {partners.map(([href, label]) => <a href={href} target="_blank" rel="noreferrer" role="menuitem" key={href}>{label}<span aria-hidden="true">↗</span></a>)}
          </div>
        </div>
        <a className="instagram" href="https://www.instagram.com/uvafrontlinefirstaid/" target="_blank" rel="noreferrer" aria-label="Frontline Firstaid on Instagram">
          <Image className="instagram-logo" src="/images/instagram-logo-transparent.png" alt="" width={28} height={28} unoptimized />
        </a>
        <Link className="button button-small" href="/request-training">Request Training</Link>
      </nav>
    </div>
  </header>;
}

export function Footer() {
  return <footer className="footer">
    <div className="footer-grid container">
      <div><Brand /><p>Skills that matter. Confidence that lasts.</p></div>
      <div><h3>Explore</h3><Link href="/about">About us</Link><Link href="/instructor-resources">Instructor resources</Link><Link href="/gallery">Gallery</Link></div>
      <div><h3>Stay connected</h3><p>Follow our work and upcoming community events.</p><a className="social-link" href="https://www.instagram.com/uvafrontlinefirstaid/" target="_blank" rel="noreferrer">◎ Instagram ↗</a></div>
    </div>
    <div className="footer-bottom container"><span>© {new Date().getFullYear()} Frontline Firstaid</span><span>Independent student organization at UVA</span></div>
  </footer>;
}
