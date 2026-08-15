import Image from "next/image";
import { PageHero } from "@/components/page-parts";

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

const photos = Array.from({ length: 7 }, (_, index) => ({
  src: `/images/gallery/training-${String(index + 1).padStart(2, "0")}.jpg?v=2`,
  alt: `Frontline Firstaid community training photo ${index + 1}`,
}));

export const metadata = { title: "Gallery" };
export default function Gallery() {
  return <><PageHero eyebrow="In the community" title="Learning looks better hands-on." text="A glimpse at the workshops, partnerships, and people that bring our mission to life." />
    <section className="container section gallery-videos"><div className="section-heading"><div><span className="eyebrow">Video stories</span><h2>Frontline in the news.</h2></div><p>Watch conversations and features about our work without leaving this page.</p></div><div className="video-grid">{videos.map((video) => <figure className="video-card" key={video.src}><div className="video-frame">{video.type === "youtube" ? <iframe src={video.src} title={video.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> : <video controls preload="metadata" poster={video.poster}><source src={video.src} type="video/mp4" />Your browser does not support embedded video.</video>}</div><figcaption><strong>{video.title}</strong><span>{video.caption}</span></figcaption></figure>)}</div></section>
    <section className="container section gallery-photos"><div className="section-heading"><div><span className="eyebrow">Photo gallery</span><h2>Learning in action.</h2></div><p>Photos from our workshops and community partnerships.</p></div><div className="gallery-grid">{photos.map((photo, index) => <figure key={photo.src} className={`gallery-item item-${index + 1}`}><Image src={photo.src} alt={photo.alt} fill unoptimized sizes="(max-width: 700px) 100vw, 50vw" /></figure>)}</div></section></>;
}
