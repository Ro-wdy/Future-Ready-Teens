/**
 * Teen personality types — the plain-language replacement for the old
 * "superpowers" skill list. Each one maps onto the existing skill IDs so the
 * career matching engine keeps working unchanged; teens never see the skill
 * names, only the personality that sounds like them.
 */
export interface Personality {
  id: string;
  name: string;
  emoji: string;
  /** How a 13–19 year old would describe themselves. */
  blurb: string;
  /** Feeds career matching. */
  skillIds: string[];
  /** Named back to them on the result screen. */
  strength: string;
  /** The career advice this personality earns. */
  advice: string;
}

export const PERSONALITIES: Personality[] = [
  {
    id: 'p-creator',
    name: 'The Creator',
    emoji: '🎨',
    blurb: "I'm always making things — art, edits, music, videos.",
    skillIds: ['skill-storytelling', 'skill-ux-design', 'skill-3d-spatial'],
    strength: 'turning ideas into things people can see',
    advice: 'Build a portfolio now, not later. Three finished pieces beat thirty half-ideas, and creative courses and clients both ask to see work before anything else.',
  },
  {
    id: 'p-techie',
    name: 'The Techie',
    emoji: '💻',
    blurb: 'Phones, games and apps — I figure them out fast.',
    skillIds: ['skill-coding', 'skill-ai-prompt', 'skill-cyber-trust'],
    strength: 'picking up new technology quickly',
    advice: 'You can start today for free. Build one small thing that works — a bot, a site, a game — and keep Maths and Computer Studies strong, because every tech path leans on them.',
  },
  {
    id: 'p-helper',
    name: 'The Helper',
    emoji: '💛',
    blurb: 'People come to me when they need someone to listen.',
    skillIds: ['skill-empathy', 'skill-biology-health'],
    strength: 'reading people and calming a situation',
    advice: 'Care careers pay off for patient people, and they need real Biology and Chemistry. Volunteer somewhere with people now — it tells you fast whether you love this work.',
  },
  {
    id: 'p-leader',
    name: 'The Leader',
    emoji: '📣',
    blurb: "I organise the group and I'm happy to speak up.",
    skillIds: ['skill-persuasion', 'skill-entrepreneurship', 'skill-fin-literacy'],
    strength: 'getting people moving in the same direction',
    advice: 'Run something small before you run something big — a club, a team, a side hustle. Add Business Studies and Maths and you can lead where the money decisions get made.',
  },
  {
    id: 'p-thinker',
    name: 'The Thinker',
    emoji: '🧩',
    blurb: "Puzzles, patterns and 'but why does that work?'",
    skillIds: ['skill-data-sleuth', 'skill-biochem-research', 'skill-ai-prompt'],
    strength: 'finding the pattern everyone else missed',
    advice: 'Your curiosity is the job. Keep Maths and the sciences strong — research, data and analysis roles are some of the fastest-growing, and they all start there.',
  },
  {
    id: 'p-fixer',
    name: 'The Fixer',
    emoji: '🔧',
    blurb: "If it's broken, I want to take it apart and fix it.",
    skillIds: ['skill-mechanical-build', 'skill-coding', 'skill-clean-energy'],
    strength: 'understanding how things actually work',
    advice: "Hands-on skill is in short supply and pays well — don't let anyone tell you it's a backup plan. Physics and Maths open engineering; a technical course opens work sooner.",
  },
  {
    id: 'p-explorer',
    name: 'The Explorer',
    emoji: '✈️',
    blurb: 'New places, big machines, and how the world moves.',
    skillIds: ['skill-flight-aero', 'skill-mechanical-build'],
    strength: 'going after things most people find intimidating',
    advice: 'Aviation and engineering want Physics, Maths and Geography, plus proof you can stay calm and precise. Look into cadet and apprenticeship routes early — they fill up.',
  },
  {
    id: 'p-performer',
    name: 'The Performer',
    emoji: '🎤',
    blurb: "Stage, camera, crowd — that's where I come alive.",
    skillIds: ['skill-storytelling', 'skill-persuasion'],
    strength: 'holding a room’s attention',
    advice: 'Being watchable is a real skill, and it works far beyond performing — media, marketing, teaching and law all pay for it. Get on camera or on stage weekly and keep the receipts.',
  },
  {
    id: 'p-nature',
    name: 'The Nature Lover',
    emoji: '🌱',
    blurb: 'Animals, plants, climate — outdoors is my place.',
    skillIds: ['skill-climate-agri', 'skill-clean-energy'],
    strength: 'caring about the long game, not just today',
    advice: 'Green careers are where the new jobs are being created. Biology, Geography and Agriculture set you up, and a school garden or clean-up project is genuine early experience.',
  },
  {
    id: 'p-athlete',
    name: 'The Athlete',
    emoji: '⚽',
    blurb: "Training, competing, moving — I don't sit still.",
    skillIds: ['skill-sports-kinesiology', 'skill-empathy'],
    strength: 'discipline and showing up even when it is hard',
    advice: 'There is a whole industry behind every athlete — physio, coaching, sports science, management. Biology and Physical Education keep you in the game long after you stop playing.',
  },
  {
    id: 'p-debater',
    name: 'The Debater',
    emoji: '⚖️',
    blurb: "I'll argue a point until things are fair.",
    skillIds: ['skill-legal-logic', 'skill-persuasion'],
    strength: 'building an argument that actually holds up',
    advice: 'Read widely and join debate — law and policy reward people who can write clearly under pressure. History, Literature and Government are your core subjects.',
  },
  {
    id: 'p-foodie',
    name: 'The Foodie',
    emoji: '🍳',
    blurb: 'I cook, I bake, I feed everyone around me.',
    skillIds: ['skill-culinary-arts', 'skill-climate-agri'],
    strength: 'making something good out of what is in front of you',
    advice: 'Food is science, business and creativity at once. Chemistry, Biology and Home Science open food tech and nutrition; a kitchen job at 16 teaches you the rest.',
  },
];

export const getPersonality = (id: string) => PERSONALITIES.find((p) => p.id === id);
