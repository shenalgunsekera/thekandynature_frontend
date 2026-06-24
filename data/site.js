// Single source of truth for site content.

export const SITE = {
  name: "The Heights Retreat",
  tagline: "A small green homestay in the Kandy hills",
  location: "Doolwala Road, Kandy",
  address: "Doolwala Road, Kandy, Sri Lanka",
  mapsQuery: "Doolwala Road, Kandy, Sri Lanka",
  phone: "077 786 8576",
  phone2: "077 317 7917",
  // wa.me format: country code + number, no spaces or leading 0
  whatsapp: "94777868576",
  email: "hello@thenaturekandy.lk",
};

// size drives the mosaic: "big" (2x2), "wide" (2x1), "tall" (1x2), "" (1x1).
// Captions live in lib/content.js (translated); alt text stays here.
export const GALLERY = [
  { slug: "pool-twilight",    size: "big",  alt: "The pool at twilight, fairy lights reflected in still water beneath the tree mural" },
  { slug: "room-green",       size: "tall", alt: "Cosy bedroom with forest-green walls, red drapes and trailing ivy" },
  { slug: "dining-nook",      size: "tall", alt: "Dining corner with a green glass-block wall, a potted plant and a checked tablecloth" },
  { slug: "pool-fairy-night", size: "wide", alt: "Pool draped in fairy lights at night with the painted tree wall glowing behind" },
  { slug: "lounge-1",         size: "",     alt: "Open lounge with a deep sectional sofa and warm hanging lanterns" },
  { slug: "pool-day",         size: "tall", alt: "Turquoise lap pool framed by coconut palms on a cloudy afternoon" },
  { slug: "mural",            size: "",     alt: "Hand-painted white tree mural on a black wall lit by warm garden lights" },
  { slug: "pool-night",       size: "tall", alt: "Pool at blue hour beside a dining pavilion strung with warm lights" },
  { slug: "room-jungle",      size: "wide", alt: "Bedroom with red drapes opening to a green jungle view and a small balcony" },
  { slug: "lounge-3",         size: "",     alt: "Sitting room with an L-shaped sofa, scatter cushions and warm pendant lights" },
  { slug: "room-pink",        size: "wide", alt: "Bedroom with bright pink drapes, green walls and trailing ivy by a wall light" },
  { slug: "dining",           size: "tall", alt: "Covered dining deck under woven globe lanterns with wooden benches" },
  { slug: "lounge-2",         size: "",     alt: "Living lounge with sectional sofas around a low wooden table" },
  { slug: "pool-dusk",        size: "wide", alt: "Swimming pool glowing with fairy lights at dusk beneath a painted tree" },
];

export const AMENITIES = [
  {
    title: "Freshwater Pool",
    badge: "Free with booking",
    badgeTone: "good",
    icon: "pool",
    body: "A long pool with lights strung around it and palms behind. It's free with your stay, so swim at six in the morning or at midnight, whenever suits you.",
  },
  {
    title: "Badminton Court",
    badge: "Included",
    badgeTone: "good",
    icon: "racket",
    body: "An open court out back. We keep rackets and a shuttle around, so grab a game once it cools down in the evening.",
  },
  {
    title: "Shared Kitchen",
    badge: "Small extra charge",
    badgeTone: "info",
    icon: "kitchen",
    body: "There's a full kitchen if you'd rather cook your own food. Just ask when you book; it's a small extra. Handy if you're staying a while.",
  },
  {
    title: "Fairy-lit Dining Deck",
    badge: "Every evening",
    badgeTone: "plain",
    icon: "lantern",
    body: "A covered deck under the round woven lanterns. It's where most evenings end up, over dinner or a slow game of cards.",
  },
  {
    title: "Gardens & Murals",
    badge: "All around you",
    badgeTone: "plain",
    icon: "leaf",
    body: "Tree murals, ferns in pots, and lights pointed up into the leaves. There's something green wherever you turn.",
  },
  {
    title: "Leafy Rooms",
    badge: "Calm & quiet",
    badgeTone: "plain",
    icon: "bed",
    body: "Green walls, soft light, a bit of ivy by the window. They stay cool and quiet, which is what you want after a day out walking.",
  },
];

export const STEPS = [
  { n: "01", title: "Send your dates", body: "Let us know when you'd like to come and how many people. That's all we need to start." },
  { n: "02", title: "We get back to you", body: "We'll tell you what's free, which room suits, and sort out any extras like the kitchen." },
  { n: "03", title: "Turn up", body: "Drop your bags and the pool and garden are yours for the stay." },
];
