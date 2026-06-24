"use client";

import { useLang } from "@/lib/i18n";
import Reveal, { Stagger, StaggerItem } from "./Reveal";
import LeafField from "./LeafField";
import { ICONS } from "./icons";

export default function Amenities() {
  const { t } = useLang();
  return (
    <section className="section" id="amenities">
      <LeafField variant="section" count={10} seed={11} />
      <div className="container">
        <Reveal className="center">
          <span className="eyebrow">{t.amenities.eyebrow}</span>
          <h2 className="h-lg">{t.amenities.title}</h2>
          <p className="lead">{t.amenities.lead}</p>
        </Reveal>

        <Stagger className="amen-grid">
          {t.amenities.items.map((a) => {
            const Icon = ICONS[a.icon];
            return (
              <StaggerItem className="amen-card" key={a.title}>
                <div className="amen-card__icon">{Icon ? <Icon size={26} /> : null}</div>
                <span className={`badge badge--${a.badgeTone}`}>{a.badge}</span>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
