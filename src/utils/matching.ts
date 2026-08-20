import { ASKS, AnswerMap } from '../data/asks';
import { InterestId, getInterest } from '../data/interests';
import { CAREERS_DATA } from '../data/gameData';
import { SKILL_TRAITS, TRAITS, TRAIT_ORDER, TraitId } from '../data/traits';
import { CareerMatch } from '../types';

export interface TraitScore {
  id: TraitId;
  raw: number;
  /** 0–100, relative to the strongest trait, for the bars on the result screen. */
  pct: number;
}

export interface ScoredCareer {
  career: CareerMatch;
  compatibility: number;
  /** Which of their answers this career is leaning on — shown as "why". */
  matchedTraits: TraitId[];
  matchedInterests: InterestId[];
}

/** Add up every answer's weights into a score per future type. */
export function scoreTraits(answers: AnswerMap): TraitScore[] {
  const raw: Record<TraitId, number> = {
    create: 0, solve: 0, lead: 0, connect: 0, build: 0, curious: 0, impact: 0,
  };

  ASKS.forEach((ask) => {
    const chosen = answers[ask.id];
    if (!chosen) return;
    const option = ask.options.find((o) => o.id === chosen);
    if (!option) return;
    (Object.entries(option.weights) as [TraitId, number][]).forEach(([trait, points]) => {
      raw[trait] += points;
    });
  });

  const max = Math.max(1, ...TRAIT_ORDER.map((t) => raw[t]));

  return TRAIT_ORDER
    .map((id) => ({ id, raw: raw[id], pct: Math.round((raw[id] / max) * 100) }))
    // Ties break on TRAIT_ORDER, which keeps a result stable if somebody
    // taps Back and re-picks the same answer.
    .sort((a, b) => b.raw - a.raw);
}

/**
 * The badge: the strongest type, crossed with the runner-up.
 * The pair is what makes it feel personal — seven types alone would have every
 * second teen at the event holding the same card.
 */
export function getFutureType(traits: TraitScore[]) {
  const primary = TRAITS[traits[0].id];
  const secondary = TRAITS[traits[1].id];
  return {
    primary,
    secondary,
    /** e.g. "CREATOR × BUILDER" */
    badge: `${primary.short} × ${secondary.short}`,
  };
}

/**
 * Careers are ranked on two things: how well the skills they need line up with
 * the future types the teen scored, and whether the career lives in one of the
 * two worlds they picked in Ask 06. Interests are weighted heavily on purpose —
 * a Solver who picked SPORT should get sports analytics, not cyber security.
 */
export function rankCareers(traits: TraitScore[], interests: InterestId[]): ScoredCareer[] {
  const traitPct = new Map<TraitId, number>(traits.map((t) => [t.id, t.pct / 100]));

  return CAREERS_DATA
    .map((career) => {
      const careerTraits = new Set<TraitId>();
      career.requiredSkillIds.forEach((skillId) => {
        (SKILL_TRAITS[skillId] ?? []).forEach((t) => careerTraits.add(t));
      });

      const traitList = [...careerTraits];
      const traitFit = traitList.length
        ? traitList.reduce((sum, t) => sum + (traitPct.get(t) ?? 0), 0) / traitList.length
        : 0;

      const tags = career.interestTags ?? [];
      const matchedInterests = interests.filter((i) => tags.includes(i));
      // Both interests landing on one career is the jackpot and should feel like it.
      const interestFit = matchedInterests.length >= 2 ? 1 : matchedInterests.length === 1 ? 0.62 : 0;

      const score = traitFit * 0.55 + interestFit * 0.45;

      return {
        career,
        compatibility: Math.min(99, Math.max(52, Math.round(52 + score * 47))),
        matchedTraits: traitList
          .filter((t) => (traitPct.get(t) ?? 0) >= 0.5)
          .sort((a, b) => (traitPct.get(b) ?? 0) - (traitPct.get(a) ?? 0)),
        matchedInterests,
      };
    })
    .sort((a, b) => b.compatibility - a.compatibility || b.career.growthScore - a.career.growthScore);
}

/** Plain-language "why this came up", built from their own answers. */
export function explainMatch(scored: ScoredCareer): string {
  const traitBits = scored.matchedTraits.slice(0, 2).map((t) => TRAITS[t].short.toLowerCase());
  const interestBits = scored.matchedInterests.map((i) => getInterest(i)?.label ?? i);

  if (traitBits.length && interestBits.length) {
    return `You answer like a ${traitBits.join(' and a ')}, and you picked ${interestBits.join(' + ')}.`;
  }
  if (traitBits.length) return `You answer like a ${traitBits.join(' and a ')}.`;
  if (interestBits.length) return `This one sits inside ${interestBits.join(' + ')}.`;
  return 'A left-field one worth a look.';
}
