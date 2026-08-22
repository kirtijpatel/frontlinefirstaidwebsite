import Image from "next/image";
import { PageHero } from "@/components/page-parts";
import { fetchSharedSheetRows, headerIndex, rowIsVisible } from "@/lib/shared-sheet";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type VideoStory = {
  title: string;
  caption: string;
  type: "youtube" | "video" | "link";
  src: string;
  poster?: string;
};

type GalleryPhoto = {
  src: string;
  alt: string;
  header: string;
  description: string;
};

type PhotoGroup = {
  header: string;
  photos: GalleryPhoto[];
};

const fallbackVideos: VideoStory[] = [
  {
    title: "Frontline First Aid video feature",
    caption: "Watch this feature from our community work.",
    type: "youtube",
    src: "https://www.youtube-nocookie.com/embed/d6VmFRPY1FE",
  },
  {
    title: "Frontline First Aid in the community",
    caption: "A closer look at our mission and outreach.",
    type: "youtube",
    src: "https://www.youtube-nocookie.com/embed/ZG7M-tzFVCI",
  },
  {
    title: "Community Conversation: Channing Williams with Front Line First Aid",
    caption: "29News · November 26, 2025",
    type: "video",
    src: "https://d1l66zlxaqpl1u.cloudfront.net/wp-gray/20251126/69277096c179ee5d94241c7e/file_1920x1080-5400-v4/file_1280x720-2000-v3_1.mp4",
    poster: "https://gray-wvir-prod.gtv-cdn.com/resizer/v2/https%3A%2F%2Fdo0bihdskp9dy.cloudfront.net%2F11-26-2025%2Ft_7b517ab779a9491ba61a02d1eb4b07d7_name_file_1280x720_2000_v3_1_.jpg?auth=28c5f98bba2020b47c87a51b364e42bb7ab7270d9f8f0c3da4465fffceb8f700&width=1920&height=1080&smart=true",
  },
];

const fallbackPhotos = Array.from({ length: 7 }, (_, index) => ({
  src: `/images/gallery/training-${String(index + 1).padStart(2, "0")}.jpg?v=2`,
  alt: `Frontline Firstaid community training photo ${index + 1}`,
  header: "Community trainings",
  description: "",
}));

function safeWebUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function safeImageSource(value: string) {
  const source = value.trim();
  if (source.startsWith("/")) return source;

  const safeUrl = safeWebUrl(source);
  if (!safeUrl) return "";

  const url = new URL(safeUrl);
  const driveFile = url.hostname === "drive.google.com" && url.pathname.match(/\/file\/d\/([^/]+)/);
  return driveFile
    ? `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveFile[1])}&sz=w1600`
    : url.toString();
}

function youtubeEmbedUrl(value: string) {
  try {
    const url = new URL(value);
    let videoId = "";
    if (url.hostname === "youtu.be") videoId = url.pathname.split("/").filter(Boolean)[0] || "";
    if (url.hostname.endsWith("youtube.com")) {
      videoId = url.searchParams.get("v") || url.pathname.match(/\/(?:embed|shorts)\/([^/]+)/)?.[1] || "";
    }
    return videoId ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}` : "";
  } catch {
    return "";
  }
}

function videoStory(urlValue: string, description: string): VideoStory | null {
  const url = safeWebUrl(urlValue);
  if (!url) return null;

  const youtubeUrl = youtubeEmbedUrl(url);
  if (youtubeUrl) return { title: description || "Frontline First Aid video story", caption: "Video story", type: "youtube", src: youtubeUrl };

  if (url.includes("community-conversation-channing-williams-with-front-line-first-aid-11-26-25")) {
    return {
      title: description || "Community Conversation: Channing Williams with Front Line First Aid",
      caption: "29News video feature",
      type: "video",
      src: fallbackVideos[2].src,
      poster: fallbackVideos[2].poster,
    };
  }

  if (/\.mp4(?:$|\?)/i.test(url)) return { title: description || "Frontline First Aid video story", caption: "Video story", type: "video", src: url };
  return { title: description || "Frontline First Aid video story", caption: "Opens on the publisher’s website", type: "link", src: url };
}

function sectionTable(rows: string[][], startIndex: number, endIndex = rows.length) {
  if (startIndex < 0) return null;
  const sectionRows = rows.slice(startIndex + 1, endIndex).filter((row) => row.some((cell) => cell.trim()));
  if (!sectionRows.length) return null;
  const [headers, ...data] = sectionRows;
  return { headers, data };
}

function groupPhotos(photos: GalleryPhoto[]): PhotoGroup[] {
  const groups = new Map<string, GalleryPhoto[]>();
  for (const photo of photos) {
    const header = photo.header || "Community trainings";
    groups.set(header, [...(groups.get(header) || []), photo]);
  }
  return Array.from(groups, ([header, groupedPhotos]) => ({ header, photos: groupedPhotos }));
}

async function getGalleryContent() {
  const sheetRows = await fetchSharedSheetRows({ sheet: "Gallary" })
    || await fetchSharedSheetRows({ sheet: "Gallery" });
  if (!sheetRows?.length) return { videos: fallbackVideos, photoGroups: groupPhotos(fallbackPhotos) };

  const videoStart = sheetRows.findIndex((row) => (row[0] || "").trim().toLowerCase() === "video stories");
  const photoStart = sheetRows.findIndex((row) => ["photo gallary", "photo gallery"].includes((row[0] || "").trim().toLowerCase()));

  const videoSection = sectionTable(sheetRows, videoStart, photoStart > videoStart ? photoStart : sheetRows.length);
  const videos = videoSection ? (() => {
    const visibleIndex = headerIndex(videoSection.headers, "visible");
    const urlIndex = headerIndex(videoSection.headers, "url", "video url", "link");
    const descriptionIndex = headerIndex(videoSection.headers, "description", "caption", "title");
    if (urlIndex < 0) return [];
    return videoSection.data.flatMap((row) => {
      if (!rowIsVisible(row, visibleIndex)) return [];
      const story = videoStory(row[urlIndex] || "", descriptionIndex < 0 ? "" : (row[descriptionIndex] || "").trim());
      return story ? [story] : [];
    });
  })() : [];

  const photoSection = sectionTable(sheetRows, photoStart);
  const photos = photoSection ? (() => {
    const visibleIndex = headerIndex(photoSection.headers, "visible");
    const urlIndex = headerIndex(photoSection.headers, "url", "photo url", "image url", "photo", "image");
    const headerColumnIndex = headerIndex(photoSection.headers, "header", "group", "training");
    const descriptionIndex = headerIndex(photoSection.headers, "description", "caption");
    const altIndex = headerIndex(photoSection.headers, "alt text", "alt");
    if (urlIndex < 0) return [];
    return photoSection.data.flatMap((row, index) => {
      const src = safeImageSource(row[urlIndex] || "");
      if (!rowIsVisible(row, visibleIndex) || !src) return [];
      const header = headerColumnIndex < 0 ? "" : (row[headerColumnIndex] || "").trim();
      const description = descriptionIndex < 0 ? "" : (row[descriptionIndex] || "").trim();
      const alt = altIndex < 0 ? "" : (row[altIndex] || "").trim();
      return [{
        src,
        header,
        description,
        alt: alt || description || `${header || "Frontline Firstaid"} training photo ${index + 1}`,
      }];
    });
  })() : [];

  return {
    videos: videos.length ? videos : fallbackVideos,
    photoGroups: groupPhotos(photos.length ? photos : fallbackPhotos),
  };
}

export const metadata = { title: "Gallery", alternates: { canonical: "/gallery" } };

export default async function Gallery() {
  const { videos, photoGroups } = await getGalleryContent();

  return <>
    <PageHero eyebrow="In the community" title="Learning looks better hands-on." text="A glimpse at the workshops, partnerships, and people that bring our mission to life." />
    <section className="container section gallery-videos">
      <div className="section-heading"><div><span className="eyebrow">Video stories</span><h2>Frontline in the news.</h2></div><p>Watch conversations and features about our work without leaving this page.</p></div>
      <div className="video-grid">{videos.map((video, index) => <figure className={`video-card ${videos.length % 2 === 1 && index === videos.length - 1 ? "video-card-featured" : ""}`} key={`${video.src}-${index}`}>
        <div className="video-frame">{video.type === "youtube"
          ? <iframe src={video.src} title={video.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
          : video.type === "video"
            ? <video controls preload="metadata" poster={video.poster}><source src={video.src} type="video/mp4" />Your browser does not support embedded video.</video>
            : <a className="video-external-link" href={video.src} target="_blank" rel="noreferrer"><span>Watch video ↗</span><small>Opens in a new tab</small></a>}
        </div>
        <figcaption><strong>{video.title}</strong><span>{video.caption}</span></figcaption>
      </figure>)}</div>
    </section>
    <section className="container section gallery-photos">
      <div className="section-heading"><div><span className="eyebrow">Photo gallery</span><h2>Learning in action.</h2></div><p>Photos from our workshops and community partnerships.</p></div>
      <div className="gallery-groups">{photoGroups.map((group, groupIndex) => <section className="gallery-group" key={`${group.header}-${groupIndex}`} aria-labelledby={`gallery-group-${groupIndex}`}>
        <h3 className="gallery-group-title" id={`gallery-group-${groupIndex}`}><span>Training</span>{group.header}</h3>
        <div className={`gallery-grid ${group.photos.length === 1 ? "gallery-grid-single" : ""}`}>{group.photos.map((photo, index) => {
          const featured = group.photos.length >= 4 && (index === 0 || index === 3);
          return <figure key={`${photo.src}-${index}`} className={`gallery-item ${featured ? "gallery-item-featured" : ""}`} tabIndex={photo.description ? 0 : undefined}>
            <Image src={photo.src} alt={photo.alt} fill unoptimized sizes="(max-width: 700px) 100vw, 50vw" />
            {photo.description && <figcaption><span>{photo.description}</span></figcaption>}
          </figure>;
        })}</div>
      </section>)}</div>
    </section>
  </>;
}
