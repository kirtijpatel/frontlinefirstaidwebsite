import { cookies } from "next/headers";
import { PageHero } from "@/components/page-parts";
import { INSTRUCTOR_COOKIE, hasInstructorAccess } from "@/lib/instructor-auth";
import { fetchSharedSheetRows, headerIndex, rowIsVisible } from "@/lib/shared-sheet";
import { InstructorLogin, InstructorLogout } from "./instructor-login";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = {
  title: "Instructor Resources",
  alternates: { canonical: "/instructor-resources" },
  robots: { index: false, follow: false },
};

type Resource = {
  title: string;
  description: string;
  link: string;
};

function safeDocumentLink(value: string) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

async function getResources(): Promise<Resource[] | null> {
  const sheetRows = await fetchSharedSheetRows({ gid: "0" });
  if (!sheetRows?.length) return null;

  const [headers, ...rows] = sheetRows;
  const visibleIndex = headerIndex(headers, "visible");
  const titleIndex = headerIndex(headers, "title");
  const descriptionIndex = headerIndex(headers, "description");
  const linkIndex = headerIndex(headers, "link");
  if (titleIndex < 0 || linkIndex < 0) return null;

  return rows.flatMap((row) => {
    const title = (row[titleIndex] || "").trim();
    if (!rowIsVisible(row, visibleIndex) || !title) return [];
    return [{
      title,
      description: descriptionIndex < 0 ? "" : (row[descriptionIndex] || "").trim(),
      link: safeDocumentLink(row[linkIndex] || ""),
    }];
  });
}

function resourceType(link: string) {
  if (link.includes("/spreadsheets/")) return "Spreadsheet";
  if (link.includes("/presentation/")) return "Presentation";
  if (link.includes("/document/")) return "Document";
  return "Google resource";
}

function resourceThumbnail(link: string) {
  const match = link.match(/\/d\/([^/?#]+)/);
  return match ? `https://drive.google.com/thumbnail?id=${encodeURIComponent(match[1])}&sz=w800` : "";
}

export default async function InstructorResources() {
  const cookieStore = await cookies();
  const unlocked = await hasInstructorAccess(cookieStore.get(INSTRUCTOR_COOKIE)?.value);
  const resources = unlocked ? await getResources() : null;

  return <>
    <PageHero eyebrow="Instructor portal" title="Instructor Resources" text={unlocked ? "Teaching materials and practical guidance for Frontline Firstaid instructors." : "A private resource library for members of the Frontline Firstaid instructor team."} />
    {unlocked ? <section className="container instructor-resources section">
      <aside className="emergency-contacts" aria-labelledby="emergency-contacts-title">
        <div className="emergency-contacts-heading">
          <span className="eyebrow">Emergency contacts</span>
          <h2 id="emergency-contacts-title">Need immediate support?</h2>
          <p>Tap a phone number to call.</p>
        </div>
        <div className="emergency-contact-list">
          <a href="tel:+15719822177"><span>Rebecca Stewart</span><strong>571-982-2177</strong></a>
          <a href="tel:+19037182158"><span>Harshit Polavarapu</span><strong>903-718-2158</strong></a>
          <a href="tel:+17035814140"><span>Tom Pridmore</span><strong>703-581-4140</strong></a>
        </div>
      </aside>
      <div className="section-heading">
        <div><span className="eyebrow">Resource library</span><h2>Everything you need to lead a session.</h2></div>
        <InstructorLogout />
      </div>
      {resources === null ? <div className="resource-message"><strong>Resources are temporarily unavailable.</strong><p>Please refresh the page in a moment or contact the team if the problem continues.</p></div>
        : resources.length === 0 ? <div className="resource-message"><strong>No resources are currently listed.</strong><p>Add a visible row to the instructor resource spreadsheet and it will appear here automatically.</p></div>
        : <div className="resource-grid">{resources.map((resource, index) => {
          const type = resourceType(resource.link);
          const thumbnail = resourceThumbnail(resource.link);
          const content = <>
            <div className="resource-card-copy"><span>{String(index + 1).padStart(2, "0")}</span><h3>{resource.title}</h3>{resource.description && <p>{resource.description}</p>}<small>{resource.link ? `${type} · Open ↗` : "Link coming soon"}</small></div>
            <div className="resource-preview">{thumbnail ? <img src={thumbnail} alt={`Preview of ${resource.title}`} loading="lazy" referrerPolicy="no-referrer" /> : <span>{type}</span>}</div>
          </>;
          return resource.link
            ? <a className="resource-card" href={resource.link} target="_blank" rel="noreferrer" key={`${resource.title}-${index}`}>{content}</a>
            : <article className="resource-card resource-card-disabled" key={`${resource.title}-${index}`}>{content}</article>;
        })}</div>}
      <div className="resource-help"><strong>Need something added?</strong><p>Email the team at <a href="mailto:uvafrontlinefirstaid@gmail.com">uvafrontlinefirstaid@gmail.com</a>.</p></div>
    </section> : <InstructorLogin />}
  </>;
}
