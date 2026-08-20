import { TraitId } from './traits';
import { InterestId } from './interests';

/**
 * The Career Match-Up ask set.
 *
 * Written to be read out loud by a 13-year-old and answered in about four
 * seconds. Nothing here asks what somebody is "good at" — every ask is a
 * situation, and the answer is just what they would actually do.
 */

export interface AskOption {
  id: string;
  /** The answer itself, in their words. */
  label: string;
  /** Optional second line — used where an answer needs a beat of explaining. */
  sub?: string;
  emoji: string;
  /** Points into the seven future types. */
  weights: Partial<Record<TraitId, number>>;
  /** Flashed back at them the instant they tap. Keep it short and warm. */
  reaction: string;
}

export interface Ask {
  id: string;
  /** Big label, e.g. "ASK 01". */
  index: string;
  /** The name of the round — this is the game-show energy. */
  title: string;
  /** The situation. */
  prompt: string;
  /** Small line under the prompt where the situation needs setting up. */
  setup?: string;
  options: AskOption[];
  color: string;
  tint: string;
  /**
   * pairs — four answers, two columns of wide cards.
   * power — Ask 03's five one-word pick-ups, dealt as a row of cards.
   * list  — five full-sentence answers, stacked like a dialogue menu.
   */
  layout: 'pairs' | 'power' | 'list';
  xp: number;
}

export const ASKS: Ask[] = [
  {
    id: 'ask-big-idea',
    index: 'ASK 01',
    title: 'The Big Idea',
    // The idea is deliberately never named. "An app" reads as a tech round and
    // quietly tells a musician or a footballer that this game is not for them —
    // on the very first screen, which is the one that decides whether they play.
    // Leaving it blank lets every teen picture their own idea and answer honestly.
    prompt: '11pm. The group chat lights up. Someone has an idea.',
    setup: "What's your first message back?",
    color: '#AF144B',
    tint: '#FBEAF0',
    layout: 'pairs',
    xp: 120,
    options: [
      {
        id: 'a',
        label: "“I'm in. Let's actually do it.”",
        emoji: '🚀',
        weights: { lead: 3, build: 1 },
        reaction: 'Straight in. No hesitation. 🚀',
      },
      {
        id: 'b',
        label: '“Wait — how would that even work?”',
        emoji: '🧠',
        weights: { solve: 3, build: 1 },
        reaction: 'You need to see the engine. 🧠',
      },
      {
        id: 'c',
        label: '“I know exactly who we should tell.”',
        emoji: '📢',
        weights: { connect: 3, lead: 1 },
        reaction: 'You already know who needs to hear it. 📢',
      },
      {
        id: 'd',
        label: '“Okay but hear me out — we could make it way bigger.”',
        emoji: '✨',
        weights: { create: 3, curious: 1 },
        reaction: 'Never leaves an idea alone. ✨',
      },
    ],
  },

  {
    id: 'ask-saturday',
    index: 'ASK 02',
    title: 'The Perfect Saturday',
    prompt: 'You suddenly have a completely free Saturday.',
    setup: 'What sounds most like you?',
    color: '#FA551E',
    tint: '#FEE9E1',
    layout: 'pairs',
    xp: 120,
    options: [
      {
        id: 'a',
        label: 'Making, drawing, designing or creating something',
        emoji: '🎨',
        weights: { create: 3 },
        reaction: 'Of course you are making something. 🎨',
      },
      {
        id: 'b',
        label: "Trying something you've never done before",
        emoji: '🧭',
        weights: { curious: 3, lead: 1 },
        reaction: 'Zero fear of the unknown. 🧭',
      },
      {
        id: 'c',
        label: 'Hanging out, performing, talking or making content',
        emoji: '🎤',
        weights: { connect: 3, create: 1 },
        reaction: 'People person, confirmed. 🎤',
      },
      {
        id: 'd',
        label: 'Building, fixing, coding or figuring something out',
        emoji: '🔧',
        weights: { build: 3, solve: 1 },
        reaction: 'Hands on. Always. 🔧',
      },
    ],
  },

  {
    id: 'ask-power',
    index: 'ASK 03',
    title: 'Pick Your Power',
    prompt: 'If you could instantly unlock ONE skill, what would you choose?',
    color: '#0074A6',
    tint: '#E3F1F8',
    layout: 'power',
    xp: 160,
    options: [
      {
        id: 'a',
        label: 'CREATE',
        sub: 'Turn ideas into something amazing.',
        emoji: '✨',
        weights: { create: 4 },
        reaction: 'CREATE unlocked. ✨',
      },
      {
        id: 'b',
        label: 'SOLVE',
        sub: 'Figure out problems nobody else can.',
        emoji: '🧩',
        weights: { solve: 4 },
        reaction: 'SOLVE unlocked. 🧩',
      },
      {
        id: 'c',
        label: 'LEAD',
        sub: 'Get people moving towards an idea.',
        emoji: '📣',
        weights: { lead: 4 },
        reaction: 'LEAD unlocked. 📣',
      },
      {
        id: 'd',
        label: 'CONNECT',
        sub: 'Understand people and bring them together.',
        emoji: '🫶',
        weights: { connect: 4 },
        reaction: 'CONNECT unlocked. 🫶',
      },
      {
        id: 'e',
        label: 'BUILD',
        sub: 'Turn an idea into something real.',
        emoji: '🛠️',
        weights: { build: 4 },
        reaction: 'BUILD unlocked. 🛠️',
      },
    ],
  },

  {
    id: 'ask-group-project',
    index: 'ASK 04',
    title: 'The Group Project',
    prompt: 'Your group project is due tomorrow. And nobody has started.',
    setup: 'What are you most likely to do?',
    color: '#7A3FA8',
    tint: '#F0E9F8',
    layout: 'list',
    xp: 140,
    options: [
      {
        id: 'a',
        label: 'Take charge and organise everyone',
        emoji: '📋',
        weights: { lead: 3, connect: 1 },
        reaction: 'Somebody had to. And it was you. 📋',
      },
      {
        id: 'b',
        label: 'Come up with the idea that saves the project',
        emoji: '💡',
        weights: { create: 3, solve: 1 },
        reaction: 'Clutch idea merchant. 💡',
      },
      {
        id: 'c',
        label: 'Make the presentation look incredible',
        emoji: '🖼️',
        weights: { create: 2, connect: 2 },
        reaction: 'Presentation is half the marks anyway. 🖼️',
      },
      {
        id: 'd',
        label: 'Figure out how to actually get everything done',
        emoji: '⚙️',
        weights: { solve: 2, build: 3 },
        reaction: 'The one who does the actual work. ⚙️',
      },
      {
        id: 'e',
        label: 'Make sure everyone is included and working together',
        emoji: '🤝',
        weights: { connect: 3, impact: 2 },
        reaction: 'Nobody gets left behind with you. 🤝',
      },
    ],
  },

  {
    id: 'ask-what-would-you-build',
    index: 'ASK 05',
    title: 'What Would You Rather Create?',
    prompt: 'You get one week, a team and unlimited resources.',
    setup: 'What are you building?',
    color: '#0B7A55',
    tint: '#E5F4EE',
    layout: 'list',
    xp: 140,
    options: [
      {
        id: 'a',
        label: 'A game everyone wants to play',
        emoji: '🎮',
        weights: { create: 3, build: 2 },
        reaction: 'Straight to the fun. 🎮',
      },
      {
        id: 'b',
        label: 'A business that makes money',
        emoji: '💼',
        weights: { lead: 3, solve: 1 },
        reaction: 'Money moves. 💼',
      },
      {
        id: 'c',
        label: 'Something that solves a real-world problem',
        emoji: '🌍',
        weights: { impact: 3, solve: 2 },
        reaction: 'Bigger than you. 🌍',
      },
      {
        id: 'd',
        label: 'Something that makes people think, laugh or feel',
        emoji: '🎬',
        weights: { create: 2, connect: 3 },
        reaction: 'You want a reaction. 🎬',
      },
      {
        id: 'e',
        label: 'Something that makes life easier',
        emoji: '🛠️',
        weights: { build: 3, solve: 2 },
        reaction: 'Useful beats flashy. 🛠️',
      },
    ],
  },

  {
    id: 'ask-interest-mix',
    index: 'ASK 06',
    title: 'Your Interest Mix',
    prompt: "Pick TWO things you'd actually enjoy exploring.",
    setup: 'The mix matters more than the pick. Trust us.',
    color: '#D6246E',
    tint: '#FCE7EF',
    layout: 'list',
    xp: 200,
    options: [], // Handled by its own screen — see INTERESTS.
  },

  {
    id: 'ask-future-flex',
    index: 'ASK 07',
    title: 'The Future Flex',
    prompt: "It's 10 years from now. What would make you say “yeah, I love what I do”?",
    color: '#B8860B',
    tint: '#FBF1DC',
    layout: 'list',
    xp: 180,
    options: [
      {
        id: 'a',
        label: 'I get to create things',
        emoji: '🎨',
        weights: { create: 4 },
        reaction: 'A life spent making things. 🎨',
      },
      {
        id: 'b',
        label: "I'm solving interesting problems",
        emoji: '🧩',
        weights: { solve: 4 },
        reaction: 'Never bored again. 🧩',
      },
      {
        id: 'c',
        label: "I'm building something of my own",
        emoji: '🏗️',
        weights: { lead: 3, build: 2 },
        reaction: 'Founder energy. 🏗️',
      },
      {
        id: 'd',
        label: "I'm making a difference to people",
        emoji: '💛',
        weights: { impact: 4, connect: 2 },
        reaction: 'That is the whole point. 💛',
      },
      {
        id: 'e',
        label: 'No two days are the same',
        emoji: '🧭',
        weights: { curious: 4 },
        reaction: 'Routine is the enemy. 🧭',
      },
    ],
  },
];

/** Ask 06 is the interest mix — it renders its own board instead of options. */
export const INTEREST_ASK_INDEX = ASKS.findIndex((a) => a.id === 'ask-interest-mix');

export const TOTAL_ASKS = ASKS.length;

export type AnswerMap = Record<string, string>;
export type InterestPick = InterestId[];
