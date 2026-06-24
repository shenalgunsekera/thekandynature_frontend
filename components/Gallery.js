"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useLang } from "@/lib/i18n";
import Reveal, { Stagger, StaggerItem } from "./Reveal";
import Lightbox from "./Lightbox";
import LeafField from "./LeafField";
import { GALLERY } from "@/data/site";

export default function Gallery() {
  const { t } = useLang();
  const items = GALLERY.map((g) => ({ ...g, caption: t.gallery.captions[g.slug] || g.caption || "" }));
  const [index, setIndex] = useState(-1);

  const open = useCallback((i) => setIndex(i), []);
  const close = useCallback(() => setIndex(-1), []);
  const prev = useCallback(() => setIndex((i) => (i + items.length - 1) % items.length), [items.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length]);

  return (
    <section className="section" id="gallery">
      <LeafField variant="section" count={9} seed={21} />
      <div className="container">
        <Reveal className="center">
          <span className="eyebrow">{t.gallery.eyebrow}</span>
          <h2 className="h-lg">{t.gallery.title}</h2>
          <p className="lead">{t.gallery.lead}</p>
        </Reveal>

        <Stagger className="gallery" gap={0.06}>
          {items.map((g, i) => (
            <StaggerItem key={g.slug} className={`gallery__item ${g.size || ""}`}>
              <button
                type="button"
                onClick={() => open(i)}
                aria-label={g.caption}
                style={{ all: "unset", cursor: "pointer", display: "block", width: "100%", height: "100%" }}
              >
                <Image
                  src={`/gallery/${g.slug}.webp`}
                  alt={g.alt}
                  fill
                  sizes="(max-width: 560px) 50vw, (max-width: 900px) 50vw, 25vw"
                  style={{ objectFit: "cover" }}
                />
                <span className="gallery__cap">{g.caption}</span>
              </button>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {index >= 0 && (
        <Lightbox items={items} index={index} onClose={close} onPrev={prev} onNext={next} />
      )}
    </section>
  );
}
