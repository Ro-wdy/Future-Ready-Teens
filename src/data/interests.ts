/**
 * Ask 06 — the interest mix.
 *
 * Teens pick two. The point is not the pick, it is the *pair*: SPORT on its
 * own says "footballer", but SPORT × TECH says sports data, wearables and
 * performance science — fields most of them have never heard of. Every one of
 * the 45 possible pairs has its own name and its own field list below, so
 * nobody gets a generic answer.
 */

export type InterestId =
  | 'tech'
  | 'sport'
  | 'music'
  | 'art'
  | 'business'
  | 'science'
  | 'people'
  | 'media'
  | 'travel'
  | 'nature';

export interface Interest {
  id: InterestId;
  label: string;
  emoji: string;
  color: string;
  /** Concrete examples, so "SCIENCE" does not just mean school science. */
  hint: string;
}

export const INTERESTS: Interest[] = [
  { id: 'tech',     label: 'TECH',          emoji: '💻', color: '#0074A6', hint: 'apps, gadgets, code, AI' },
  { id: 'sport',    label: 'SPORT',         emoji: '⚽', color: '#0B7A55', hint: 'training, teams, competing' },
  { id: 'music',    label: 'MUSIC',         emoji: '🎧', color: '#7A3FA8', hint: 'making it, mixing it, living in it' },
  { id: 'art',      label: 'ART & DESIGN',  emoji: '🎨', color: '#AF144B', hint: 'drawing, fashion, spaces, style' },
  { id: 'business', label: 'BUSINESS',      emoji: '💼', color: '#B8860B', hint: 'money, hustles, brands' },
  { id: 'science',  label: 'SCIENCE',       emoji: '🔬', color: '#0E7490', hint: 'how the body, the lab and the universe work' },
  { id: 'people',   label: 'PEOPLE',        emoji: '🫶', color: '#D6246E', hint: 'helping, teaching, understanding' },
  { id: 'media',    label: 'MEDIA',         emoji: '🎬', color: '#FA551E', hint: 'film, content, news, socials' },
  { id: 'travel',   label: 'TRAVEL',        emoji: '✈️', color: '#4457B5', hint: 'places, planes, moving things' },
  { id: 'nature',   label: 'NATURE',        emoji: '🌿', color: '#3E7C29', hint: 'animals, climate, land, food' },
];

export const getInterest = (id: InterestId) => INTERESTS.find((i) => i.id === id);

export interface InterestCombo {
  /** The name of the unexpected middle ground between the two. */
  name: string;
  /** Real fields a teen could actually walk into. */
  fields: string[];
}

/** Pairs are keyed in INTERESTS order, so lookups sort before joining. */
const COMBOS: Record<string, InterestCombo> = {
  'tech+sport':      { name: 'Sports Technology',        fields: ['Sports Data Analytics', 'Performance Science', 'Wearable Tech', 'Esports & Game Development'] },
  'tech+music':      { name: 'Sound Technology',         fields: ['Music Production', 'Audio Engineering', 'Streaming Platforms', 'Music AI'] },
  'tech+art':        { name: 'Digital Design',           fields: ['UX & Product Design', 'Motion Graphics', 'Game Art', 'Creative Coding'] },
  'tech+business':   { name: 'FinTech & Startups',       fields: ['Mobile Money', 'Product Management', 'Data Analytics', 'Venture Building'] },
  'tech+science':    { name: 'Deep Tech',                fields: ['AI & Machine Learning', 'Bioinformatics', 'Robotics', 'Research Engineering'] },
  'tech+people':     { name: 'Human-Centred Tech',       fields: ['UX Research', 'EdTech', 'Digital Health', 'Community Platforms'] },
  'tech+media':      { name: 'Creator Tech',             fields: ['Content Platforms', 'AR & VR', 'Creator Tools', 'Streaming Engineering'] },
  'tech+travel':     { name: 'Mobility Tech',            fields: ['Aviation Systems', 'Logistics Technology', 'Travel Platforms', 'Drone Operations'] },
  'tech+nature':     { name: 'Climate Tech',             fields: ['Renewable Energy Systems', 'Environmental Data', 'AgriTech', 'Smart Cities'] },

  'sport+music':     { name: 'Live Energy',              fields: ['Event Production', 'Sports Entertainment', 'Performance Coaching', 'Brand Partnerships'] },
  'sport+art':       { name: 'Sport Design',             fields: ['Kit & Product Design', 'Sports Branding', 'Stadium Design', 'Sports Photography'] },
  'sport+business':  { name: 'Sports Business',          fields: ['Athlete Management', 'Sponsorship & Marketing', 'Club Operations', 'Sports Finance'] },
  'sport+science':   { name: 'Sports Science',           fields: ['Physiotherapy', 'Biomechanics', 'Sports Nutrition', 'Performance Analysis'] },
  'sport+people':    { name: 'Coaching & Wellbeing',     fields: ['Coaching', 'Sports Psychology', 'Community Sport', 'Physical Education'] },
  'sport+media':     { name: 'Sports Media',             fields: ['Sports Broadcasting', 'Commentary', 'Sports Journalism', 'Content Creation'] },
  'sport+travel':    { name: 'Global Sport',             fields: ['Team Logistics', 'Sports Tourism', 'Adventure Guiding', 'International Events'] },
  'sport+nature':    { name: 'Outdoor Performance',      fields: ['Adventure Sports', 'Conservation Guiding', 'Outdoor Education', 'Endurance Coaching'] },

  'music+art':       { name: 'Creative Studio',          fields: ['Music Video Direction', 'Album & Brand Design', 'Stage Visuals', 'Creative Direction'] },
  'music+business':  { name: 'The Music Industry',       fields: ['Artist Management', 'Labels & Rights', 'Live Events', 'Music Marketing'] },
  'music+science':   { name: 'Audio Science',            fields: ['Acoustics', 'Sound Engineering', 'Music Therapy', 'Audio Software'] },
  'music+people':    { name: 'Music & Community',        fields: ['Music Therapy', 'Music Education', 'Youth Programmes', 'Choir & Band Direction'] },
  'music+media':     { name: 'Sound for Screen',         fields: ['Film Scoring', 'Podcast Production', 'Radio', 'Sound Design'] },
  'music+travel':    { name: 'Touring Life',             fields: ['Tour Management', 'Festival Production', 'Live Sound', 'Cultural Exchange'] },
  'music+nature':    { name: 'Sound & Place',            fields: ['Field Recording', 'Eco-Festival Production', 'Cultural Heritage', 'Nature Documentaries'] },

  'art+business':    { name: 'Creative Business',        fields: ['Brand Strategy', 'Advertising', 'Design Studios', 'Creative Entrepreneurship'] },
  'art+science':     { name: 'Science Visualisation',    fields: ['Medical Illustration', 'Data Visualisation', 'Product Design', 'Architecture'] },
  'art+people':      { name: 'Design for People',        fields: ['UX Design', 'Art Therapy', 'Community Art', 'Design Education'] },
  'art+media':       { name: 'Visual Storytelling',      fields: ['Film & Animation', 'Photography', 'Editorial Design', 'Content Direction'] },
  'art+travel':      { name: 'Culture & Craft',          fields: ['Travel Photography', 'Exhibition Design', 'Cultural Curation', 'Hospitality Design'] },
  'art+nature':      { name: 'Sustainable Design',       fields: ['Eco Architecture', 'Sustainable Fashion', 'Landscape Design', 'Circular Product Design'] },

  'business+science':{ name: 'Science Ventures',         fields: ['HealthTech', 'Pharma & Biotech', 'R&D Management', 'Innovation Consulting'] },
  'business+people': { name: 'People & Growth',          fields: ['Human Resources', 'Sales & Partnerships', 'Social Enterprise', 'Consulting'] },
  'business+media':  { name: 'Brand & Marketing',        fields: ['Digital Marketing', 'Media Strategy', 'The Creator Economy', 'Public Relations'] },
  'business+travel': { name: 'Global Trade',             fields: ['Logistics & Supply Chain', 'Hospitality Management', 'Import & Export', 'Tourism Business'] },
  'business+nature': { name: 'The Green Economy',        fields: ['Carbon Markets', 'Sustainable Finance', 'AgriBusiness', 'Impact Investing'] },

  'people+science':  { name: 'Health & Care',            fields: ['Medicine', 'Nursing', 'Public Health', 'Psychology'] },
  'media+science':   { name: 'Science Communication',    fields: ['Science Journalism', 'Documentary Production', 'Museums & Exhibits', 'EdTech Content'] },
  'science+travel':  { name: 'Field Science',            fields: ['Marine Biology', 'Geology & Mining', 'Aerospace', 'Expedition Research'] },
  'science+nature':  { name: 'Environmental Science',    fields: ['Conservation Science', 'Climate Research', 'Wildlife Biology', 'Soil & Water Science'] },

  'media+people':    { name: 'Voice & Influence',        fields: ['Presenting & Broadcasting', 'Journalism', 'Public Relations', 'The Creator Economy'] },
  'people+travel':   { name: 'Culture & Hospitality',    fields: ['Tour Leading', 'Guest Experience', 'Diplomacy', 'International Development'] },
  'people+nature':   { name: 'Community & Environment',  fields: ['Conservation Outreach', 'Eco-Tourism', 'Rural Development', 'Environmental Law'] },

  'media+travel':    { name: 'Travel Media',             fields: ['Travel Documentary', 'Photojournalism', 'Destination Content', 'Drone Cinematography'] },
  'media+nature':    { name: 'Nature Media',             fields: ['Wildlife Filmmaking', 'Environmental Journalism', 'Conservation Campaigns', 'Nature Photography'] },

  'travel+nature':   { name: 'Wild Places',              fields: ['Safari & Eco-Tourism', 'Conservation Management', 'Geography & Mapping', 'Adventure Travel'] },
};

/**
 * Combos are stored under one key per pair; look either way round.
 * Falls back to a generic mash-up so a missing key can never blank the screen.
 */
export function getCombo(a: InterestId, b: InterestId): InterestCombo {
  const found = COMBOS[`${a}+${b}`] ?? COMBOS[`${b}+${a}`];
  if (found) return found;

  const first = getInterest(a);
  const second = getInterest(b);
  return {
    name: `${first?.label ?? a} × ${second?.label ?? b}`,
    fields: ['Careers that sit between the two', 'Ask an Absa mentor on the floor'],
  };
}
