import Image from "next/image";
import { PageHero } from "@/components/page-parts";
import { fetchSharedSheetRows, headerIndex, rowIsVisible } from "@/lib/shared-sheet";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const videos = [
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
] as const;

const fallbackPhotos = Array.from({ length: 7 }, (_, index) => ({
  src: `/images/gallery/training-${String(index + 1).padStart(2, "0")}.jpg?v=2`,
  alt: `Frontline Firstaid community training photo ${index + 1}`,
  description: "",
}));

type GalleryPhoto = {
  src: string;
  alt: string;
  description: string;
};

function safeImageSource(value: string) {
  const source = value.trim();
  if (source.startsWith("/")) return source;

  try {
    const url = new URL(source);
    if (url.protocol !== "https:") return "";

    const driveFile = url.hostname === "drive.google.com" && url.pathname.match(/\/file\/d\/([^/]+)/);
    if (driveFile) return `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveFile[1])}&sz=w1600`;

    return url.toString();
  } catch {
    return "";
  }
}

async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const sheetRows = await fetchSharedSheetRows({ sheet: "Gallery" });
  if (!sheetRows?.length) return fallbackPhotos;

  const [headers, ...rows] = sheetRows;
  const visibleIndex = headerIndex(headers, "visible");
  const photoIndex = headerIndex(headers, "photo url", "photo", "image url", "image");
  const descriptionIndex = headerIndex(headers, "description", "caption");
  const altIndex = headerIndex(headers, "alt text", "alt");
  if (photoIndex < 0) return fallbackPhotos;

  const photos = rows.flatMap((row, index) => {
    const src = safeImageSource(row[photoIndex] || "");
    if (!rowIsVisible(row, visibleIndex) || !src) return [];

    const description = descriptionIndex < 0 ? "" : (row[descriptionIndex] || "").trim();
    const alt = altIndex < 0 ? "" : (row[altIndex] || "").trim();
    return [{
      src,
      description,
      alt: alt || description || `Frontline Firstaid community training photo ${index + 1}`,
    }];
  });

  return photos.length ? photos : fallbackPhotos;
}

export const metadata = { title: "Gallery", alternates: { canonical: "/gallery" } };
export default async function Gallery() {
  const photos = await getGalleryPhotos();

  return <><PageHero eyebrow="In the community" title="Learning looks better hands-on." text="A glimpse at the workshops, partnerships, and people that bring our mission to life." />
    <section className="container section gallery-videos"><div className="section-heading"><div><span className="eyebrow">Video stories</span><h2>Frontline in the news.</h2></div><p>Watch conversations and features about our work without leaving this page.</p></div><div className="video-grid">{videos.map((video) => <figure className="video-card" key={video.src}><div className="video-frame">{video.type === "youtube" ? <iframe src={video.src} title={video.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> : <video controls preload="metadata" poster={video.poster}><source src={video.src} type="video/mp4" />Your browser does not support embedded video.</video>}</div><figcaption><strong>{video.title}</strong><span>{video.caption}</span></figcaption></figure>)}</div></section>
    <section className="container section gallery-photos"><div className="section-heading"><div><span className="eyebrow">Photo gallery</span><h2>Learning in action.</h2></div><p>Photos from our workshops and community partnerships.</p></div><div className="gallery-grid">{photos.map((photo, index) => <figure key={`${photo.src}-${index}`} className={`gallery-item item-${index + 1}`}><Image src={photo.src} alt={photo.alt} fill unoptimized sizes="(max-width: 700px) 100vw, 50vw" />{photo.description && <figcaption><span>{photo.description}</span></figcaption>}</figure>)}</div></section></>;
}
