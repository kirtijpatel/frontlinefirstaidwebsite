import { cookies } from "next/headers";
import { PageHero } from "@/components/page-parts";
import { INSTRUCTOR_COOKIE, hasInstructorAccess } from "@/lib/instructor-auth";
import { InstructorLogin, InstructorLogout } from "./instructor-login";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1xDiJfz5DeIBDxEOl9CXzebAlouU3yA2bMp5f0jizAqU/export?format=csv&gid=0";

type Resource = {
  title: string;
  description: string;
  link: string;
};

function parseCsv(csv: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    if (character === '"') {
      if (quoted && csv[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && csv[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  row.push(field);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
}

function safeDocumentLink(value: string) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

async function getResources(): Promise<Resource[] | null> {
  try {
    const response = await fetch(SHEET_CSV_URL, { cache: "no-store" });
    if (!response.ok) return null;

    const [headers, ...rows] = parseCsv(await response.text());
    const columns = headers.map((header) => header.trim().toLowerCase());
    const visibleIndex = columns.indexOf("visible");
    const titleIndex = columns.indexOf("title");
    const descriptionIndex = columns.indexOf("description");
    const linkIndex = columns.indexOf("link");
    if (titleIndex < 0 || linkIndex < 0) return null;

    return rows.flatMap((row) => {
      const visible = visibleIndex < 0 || ["yes", "true", "1"].includes((row[visibleIndex] || "").trim().toLowerCase());
      const title = (row[titleIndex] || "").trim();
      if (!visible || !title) return [];
      return [{
        title,
        description: descriptionIndex < 0 ? "" : (row[descriptionIndex] || "").trim(),
        link: safeDocumentLink(row[linkIndex] || ""),
      }];
    });
  } catch {
    return null;
  }
}

function resourceType(link: string) {
  if (link.includes("/spreadsheets/")) return "Spreadsheet";
  if (link.includes("/presentation/")) return "Presentation";
  if (link.includes("/document/")) return "Document";
  return "Google resource";
}

export default async function InstructorResources() {
  const cookieStore = await cookies();
  const unlocked = await hasInstructorAccess(cookieStore.get(INSTRUCTOR_COOKIE)?.value);
  const resources = unlocked ? await getResources() : null;

  return <>
    <PageHero eyebrow="Instructor portal" title="Instructor Resources" text={unlocked ? "Teaching materials and practical guidance for Frontline Firstaid instructors." : "A private resource library for members of the Frontline Firstaid instructor team."} />
    {unlocked ? <section className="container instructor-resources section">
      <div className="section-heading">
        <div><span className="eyebrow">Resource library</span><h2>Everything you need to lead a session.</h2></div>
        <InstructorLogout />
      </div>
      {resources === null ? <div className="resource-message"><strong>Resources are temporarily unavailable.</strong><p>Please refresh the page in a moment or contact the team if the problem continues.</p></div>
        : resources.length === 0 ? <div className="resource-message"><strong>No resources are currently listed.</strong><p>Add a visible row to the instructor resource spreadsheet and it will appear here automatically.</p></div>
        : <div className="resource-grid">{resources.map((resource, index) => {
          const content = <><span>{String(index + 1).padStart(2, "0")}</span><h3>{resource.title}</h3>{resource.description && <p>{resource.description}</p>}<small>{resource.link ? `${resourceType(resource.link)} · Open ↗` : "Link coming soon"}</small></>;
          return resource.link
            ? <a className="resource-card" href={resource.link} target="_blank" rel="noreferrer" key={`${resource.title}-${index}`}>{content}</a>
            : <article className="resource-card resource-card-disabled" key={`${resource.title}-${index}`}>{content}</article>;
        })}</div>}
      <div className="resource-help"><strong>Need something added?</strong><p>Email the team at <a href="mailto:uvafrontlinefirstaid@gmail.com">uvafrontlinefirstaid@gmail.com</a>.</p></div>
    </section> : <InstructorLogin />}
  </>;
}
