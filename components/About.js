"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLang } from "@/lib/i18n";
import Reveal from "./Reveal";
import LeafField from "./LeafField";
import { Tick } from "./icons";

export default function About() {
  const { t } = useLang();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section className="section section--alt" id="about" ref={ref}>
      <LeafField variant="section" count={9} seed={3} />
      <div className="container about__grid">
        <Reveal dir="right">
          <span className="eyebrow">{t.about.eyebrow}</span>
          <h2 className="h-lg">{t.about.title}</h2>
          <p className="lead">{t.about.lead}</p>
          <p className="muted">{t.about.muted}</p>
          <ul className="feature-list">
            {t.about.points.map((p, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <span className="tick"><Tick size={13} /></span>
                <span>{p}</span>
              </motion.li>
            ))}
          </ul>
        </Reveal>

        <Reveal dir="left" delay={0.1}>
          <div className="about__media">
            <motion.div style={{ y: imgY, position: "absolute", inset: "-8% 0" }}>
              <Image
                src="/gallery/pool-night.webp"
                alt="The pool at blue hour beside the fairy-lit dining pavilion at The Heights Retreat"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </motion.div>
            <span className="tag">{t.about.tag}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
