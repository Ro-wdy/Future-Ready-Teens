/**
 * The seven "future types".
 *
 * Every answer in the ask set pushes points into one or more of these. The
 * winner becomes the headline on the result screen and the runner-up becomes
 * the "×" half of the combo, so two teens who pick differently almost never
 * get the same badge.
 *
 * Teens never see the word "trait" or a score out of ten — they see a name,
 * a colour and a line that sounds like them.
 */
export type TraitId =
  | 'create'
  | 'solve'
  | 'lead'
  | 'connect'
  | 'build'
  | 'curious'
  | 'impact';

export interface Trait {
  id: TraitId;
  /** Short word used in the "CREATOR × BUILDER" badge. */
  short: string;
  /** Full headline, e.g. "The Creator". */
  name: string;
  emoji: string;
  color: string;
  tint: string;
  /** One line, second person, no jargon. */
  line: string;
  /** What this looks like when it is somebody's day job. */
  atWork: string;
  /** Three things they are already good at. */
  goodAt: string[];
}

export const TRAITS: Record<TraitId, Trait> = {
  create: {
    id: 'create',
    short: 'Creator',
    name: 'The Creator',
    emoji: '🎨',
    color: '#AF144B',
    tint: '#FBEAF0',
    line: 'You see the version of things that does not exist yet — and then you go make it.',
    atWork: 'Rooms full of Creators are where films, brands, games, songs and product ideas actually come from.',
    goodAt: ['Making ideas look and feel good', 'Starting from a blank page', 'Spotting what is missing'],
  },
  solve: {
    id: 'solve',
    short: 'Solver',
    name: 'The Solver',
    emoji: '🧩',
    color: '#0074A6',
    tint: '#E3F1F8',
    line: 'You cannot leave a problem alone until you understand exactly why it broke.',
    atWork: 'Solvers get handed the messy thing nobody else can untangle — and get paid well for untangling it.',
    goodAt: ['Finding the pattern everyone missed', 'Asking the question that changes everything', 'Staying calm inside a mess'],
  },
  lead: {
    id: 'lead',
    short: 'Mover',
    name: 'The Mover',
    emoji: '📣',
    color: '#FA551E',
    tint: '#FEE9E1',
    line: 'When nothing is happening, you are the reason something starts happening.',
    atWork: 'Movers end up running teams, launching businesses and making the call when nobody else will.',
    goodAt: ['Getting people moving in one direction', 'Deciding when nobody else will', 'Backing yourself in a room'],
  },
  connect: {
    id: 'connect',
    short: 'Connector',
    name: 'The Connector',
    emoji: '🫶',
    color: '#7A3FA8',
    tint: '#F0E9F8',
    line: 'You read people fast, and people trust you fast. That is rarer than you think.',
    atWork: 'Connectors carry the jobs that machines are worst at — persuading, teaching, healing, hosting, negotiating.',
    goodAt: ['Reading the room', 'Making people feel included', 'Saying the thing everyone was thinking'],
  },
  build: {
    id: 'build',
    short: 'Builder',
    name: 'The Builder',
    emoji: '🔧',
    color: '#0B7A55',
    tint: '#E5F4EE',
    line: 'An idea is not real to you until you can switch it on.',
    atWork: 'Builders write the code, wire the system, fly the plane, run the line — the people who make it actually work.',
    goodAt: ['Turning a plan into a real thing', 'Working with your hands and your head', 'Fixing what other people gave up on'],
  },
  curious: {
    id: 'curious',
    short: 'Explorer',
    name: 'The Explorer',
    emoji: '🧭',
    color: '#B8860B',
    tint: '#FBF1DC',
    line: 'Same thing every day? No thanks. You want the version you have never tried.',
    atWork: 'Explorers thrive in the roles that keep changing — research, travel, new tech, new markets, new fields.',
    goodAt: ['Trying the thing before you are ready', 'Learning fast from scratch', 'Being fine with not knowing yet'],
  },
  impact: {
    id: 'impact',
    short: 'Changemaker',
    name: 'The Changemaker',
    emoji: '🌍',
    color: '#0E7490',
    tint: '#E2F2F6',
    line: 'You want the work to matter to somebody, not just look good on a payslip.',
    atWork: 'Changemakers show up in health, climate, law, education and community work — and increasingly in business too.',
    goodAt: ['Caring about the long game', 'Noticing who gets left out', 'Sticking with the hard thing'],
  },
};

export const TRAIT_ORDER: TraitId[] = ['create', 'solve', 'lead', 'connect', 'build', 'curious', 'impact'];

/**
 * Which of the seven each skill in the career database speaks to. This is the
 * bridge between "how you answered" and "which careers rank" — it means the
 * career data never has to know the ask set exists.
 */
export const SKILL_TRAITS: Record<string, TraitId[]> = {
  'skill-coding': ['build', 'solve'],
  'skill-ai-prompt': ['solve', 'curious'],
  'skill-cyber-trust': ['solve', 'build'],
  'skill-data-sleuth': ['solve', 'curious'],
  'skill-biology-health': ['solve', 'impact'],
  'skill-biochem-research': ['solve', 'curious'],
  'skill-flight-aero': ['build', 'curious'],
  'skill-mechanical-build': ['build', 'solve'],
  'skill-ux-design': ['create', 'connect'],
  'skill-storytelling': ['create', 'connect'],
  'skill-3d-spatial': ['create', 'build'],
  'skill-empathy': ['connect', 'impact'],
  'skill-persuasion': ['connect', 'lead'],
  'skill-legal-logic': ['solve', 'impact'],
  'skill-fin-literacy': ['solve', 'lead'],
  'skill-clean-energy': ['build', 'impact'],
  'skill-climate-agri': ['impact', 'curious'],
  'skill-sports-kinesiology': ['impact', 'connect'],
  'skill-culinary-arts': ['create', 'build'],
  'skill-entrepreneurship': ['lead', 'create'],
};
