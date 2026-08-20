import React from 'react';

/**
 * Original cartoon characters drawn as inline SVG.
 *
 * These are deliberately *not* licensed characters — a bank-branded public
 * kiosk cannot use trademarked animation figures — but they are drawn in the
 * same flat, bold, friendly style, and the set spans genders, skin tones,
 * hair types and a few non-human options so every teen finds one they like.
 */

type Hair = 'afro' | 'fade' | 'braids' | 'curly' | 'locs' | 'bob' | 'scarf' | 'cap' | 'bun';
type Accessory = 'glasses' | 'headphones' | 'freckles' | 'earrings' | 'none';
type Kind = 'human' | 'robot' | 'cat' | 'alien';

export interface StickerSpec {
  id: string;
  name: string;
  bg: string;
  kind: Kind;
  skin?: string;
  hair?: Hair;
  hairColor?: string;
  shirt?: string;
  accessory?: Accessory;
}

/**
 * Six characters, balanced across gender presentation and skin tone, plus one
 * non-human for anyone who would rather not pick a person. The renderer below
 * still supports the other hair types (locs, bun, bob, cap) and the robot and
 * alien kinds, so extending this list back out is a one-line change.
 */
export const STICKERS: StickerSpec[] = [
  { id: 'st-zola',  name: 'Zola',  bg: '#FFE3AE', kind: 'human', skin: '#8D5524', hair: 'afro',   hairColor: '#241C1C', shirt: '#AF144B', accessory: 'earrings' },
  { id: 'st-kito',  name: 'Kito',  bg: '#CDE7F5', kind: 'human', skin: '#5C3317', hair: 'fade',   hairColor: '#1F1A1A', shirt: '#0074A6', accessory: 'headphones' },
  { id: 'st-amara', name: 'Amara', bg: '#FBD3E0', kind: 'human', skin: '#A56A3A', hair: 'braids', hairColor: '#2A1F1F', shirt: '#7A3FA8', accessory: 'none' },
  { id: 'st-neo',   name: 'Neo',   bg: '#D5F0DC', kind: 'human', skin: '#C68642', hair: 'curly',  hairColor: '#3B2413', shirt: '#0B7A55', accessory: 'glasses' },
  { id: 'st-sana',  name: 'Sana',  bg: '#E2DCF7', kind: 'human', skin: '#D9A066', hair: 'scarf',  hairColor: '#5B3FA0', shirt: '#3F2E82', accessory: 'none' },
  { id: 'st-pixel', name: 'Pixel', bg: '#FFE0B8', kind: 'cat' },
];

export const getSticker = (id: string) => STICKERS.find((s) => s.id === id);

const INK = '#2D2323';

/* ---------- shared face parts ---------- */

const Eyes: React.FC<{ cy?: number }> = ({ cy = 56 }) => (
  <>
    <circle cx="51" cy={cy} r="3.6" fill={INK} />
    <circle cx="69" cy={cy} r="3.6" fill={INK} />
    <circle cx="52.3" cy={cy - 1.3} r="1.2" fill="#fff" />
    <circle cx="70.3" cy={cy - 1.3} r="1.2" fill="#fff" />
  </>
);

const Smile: React.FC = () => (
  <path d="M52 67 Q60 74.5 68 67" stroke={INK} strokeWidth="2.6" strokeLinecap="round" fill="none" />
);

const Blush: React.FC = () => (
  <>
    <ellipse cx="41" cy="64" rx="4.5" ry="2.8" fill="#F0728F" opacity="0.38" />
    <ellipse cx="79" cy="64" rx="4.5" ry="2.8" fill="#F0728F" opacity="0.38" />
  </>
);

/* ---------- hair ---------- */

/** Drawn behind the face. */
const HairBack: React.FC<{ hair?: Hair; c: string }> = ({ hair, c }) => {
  switch (hair) {
    case 'afro':
      return (
        <>
          <circle cx="60" cy="44" r="34" fill={c} />
          <circle cx="29" cy="40" r="14" fill={c} />
          <circle cx="91" cy="40" r="14" fill={c} />
          <circle cx="42" cy="21" r="13" fill={c} />
          <circle cx="78" cy="21" r="13" fill={c} />
        </>
      );
    case 'braids':
      return (
        <>
          <ellipse cx="60" cy="46" rx="29" ry="24" fill={c} />
          <rect x="25" y="52" width="9" height="42" rx="4.5" fill={c} />
          <rect x="86" y="52" width="9" height="42" rx="4.5" fill={c} />
          <circle cx="29.5" cy="97" r="4" fill="#F0A500" />
          <circle cx="90.5" cy="97" r="4" fill="#F0A500" />
        </>
      );
    case 'locs':
      return (
        <>
          <ellipse cx="60" cy="46" rx="32" ry="26" fill={c} />
          {[
            [23, 34], [32, 44], [79, 44], [88, 34],
          ].map(([x, h], i) => (
            <rect key={i} x={x} y="44" width="9" height={h} rx="4.5" fill={c} />
          ))}
        </>
      );
    case 'bob':
      return (
        <>
          <ellipse cx="60" cy="50" rx="32" ry="30" fill={c} />
          <rect x="25" y="46" width="15" height="42" rx="7.5" fill={c} />
          <rect x="80" y="46" width="15" height="42" rx="7.5" fill={c} />
        </>
      );
    case 'scarf':
      return (
        <>
          <ellipse cx="60" cy="56" rx="34" ry="34" fill={c} />
          <path d="M26 84 Q60 100 94 84 L94 120 L26 120 Z" fill={c} />
        </>
      );
    case 'bun':
      return (
        <>
          <circle cx="60" cy="22" r="11" fill={c} />
          <ellipse cx="60" cy="48" rx="28" ry="24" fill={c} />
        </>
      );
    case 'curly':
      return (
        <>
          <circle cx="43" cy="36" r="13" fill={c} />
          <circle cx="60" cy="29" r="14" fill={c} />
          <circle cx="77" cy="36" r="13" fill={c} />
        </>
      );
    case 'fade':
      return <ellipse cx="60" cy="46" rx="27.5" ry="23" fill={c} />;
    case 'cap':
      return <ellipse cx="60" cy="48" rx="27" ry="22" fill={c} />;
    default:
      return null;
  }
};

/** Drawn over the face. */
const HairFront: React.FC<{ hair?: Hair; c: string }> = ({ hair, c }) => {
  if (hair === 'cap') {
    return (
      <>
        <path d="M33 46 Q33 24 60 24 Q87 24 87 46 Z" fill="#AF144B" />
        <path d="M85 46 Q106 47 104 54 Q93 53 85 52 Z" fill="#8E1040" />
        <circle cx="60" cy="26" r="3.5" fill="#FFD2D2" />
      </>
    );
  }
  if (hair === 'bob') {
    return <path d="M31 56 Q31 26 60 26 Q89 26 89 56 Q60 44 31 56 Z" fill={c} />;
  }
  if (hair === 'scarf') {
    // Face opening sits inside the scarf.
    return null;
  }
  return null;
};

/* ---------- accessories ---------- */

const Accessories: React.FC<{ accessory?: Accessory }> = ({ accessory }) => {
  switch (accessory) {
    case 'glasses':
      return (
        <>
          <circle cx="51" cy="56" r="8.5" stroke={INK} strokeWidth="2.2" fill="none" />
          <circle cx="69" cy="56" r="8.5" stroke={INK} strokeWidth="2.2" fill="none" />
          <path d="M59.5 56 H60.5" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
        </>
      );
    case 'headphones':
      return (
        <>
          <path d="M31 58 Q31 24 60 24 Q89 24 89 58" stroke="#2D2323" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <rect x="24" y="52" width="13" height="20" rx="6.5" fill="#FA551E" />
          <rect x="83" y="52" width="13" height="20" rx="6.5" fill="#FA551E" />
        </>
      );
    case 'freckles':
      return (
        <>
          {[[45, 62], [50, 64], [70, 64], [75, 62]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.3" fill="#B5764A" opacity="0.75" />
          ))}
        </>
      );
    case 'earrings':
      return (
        <>
          <circle cx="33" cy="65" r="3.4" fill="#F0A500" />
          <circle cx="87" cy="65" r="3.4" fill="#F0A500" />
        </>
      );
    default:
      return null;
  }
};

/* ---------- the sticker ---------- */

export const Sticker: React.FC<{ spec: StickerSpec; className?: string }> = ({ spec, className }) => {
  const { bg, kind, skin = '#C68642', hair, hairColor = '#241C1C', shirt = '#AF144B', accessory } = spec;

  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={spec.name}>
      <circle cx="60" cy="60" r="60" fill={bg} />

      {kind === 'human' && (
        <>
          {/* shoulders */}
          <path d="M22 120 Q22 90 60 90 Q98 90 98 120 Z" fill={shirt} />
          <HairBack hair={hair} c={hairColor} />
          {/* ears sit under a scarf, so skip them there */}
          {hair !== 'scarf' && (
            <>
              <circle cx="34" cy="59" r="5.5" fill={skin} />
              <circle cx="86" cy="59" r="5.5" fill={skin} />
            </>
          )}
          <ellipse
            cx="60"
            cy={hair === 'scarf' ? 58 : 56}
            rx={hair === 'scarf' ? 22 : 26}
            ry={hair === 'scarf' ? 25 : 28}
            fill={skin}
          />
          <HairFront hair={hair} c={hairColor} />
          <Eyes cy={hair === 'scarf' ? 58 : 56} />
          <Blush />
          <Smile />
          <Accessories accessory={accessory} />
        </>
      )}

      {kind === 'robot' && (
        <>
          <path d="M24 120 Q24 92 60 92 Q96 92 96 120 Z" fill="#0074A6" />
          <line x1="60" y1="34" x2="60" y2="20" stroke="#6B7683" strokeWidth="4" strokeLinecap="round" />
          <circle cx="60" cy="16" r="6" fill="#FA551E" />
          <rect x="32" y="32" width="56" height="52" rx="16" fill="#C9CED6" />
          <rect x="38" y="38" width="44" height="40" rx="12" fill="#EDF1F5" />
          <rect x="45" y="50" width="10" height="12" rx="4" fill={INK} />
          <rect x="65" y="50" width="10" height="12" rx="4" fill={INK} />
          <rect x="50" y="68" width="20" height="4.5" rx="2.25" fill={INK} />
          <circle cx="28" cy="58" r="6" fill="#9AA5B1" />
          <circle cx="92" cy="58" r="6" fill="#9AA5B1" />
        </>
      )}

      {kind === 'cat' && (
        <>
          <path d="M38 30 L34 8 L56 22 Z" fill="#E8892F" />
          <path d="M82 30 L86 8 L64 22 Z" fill="#E8892F" />
          <path d="M41 27 L39.5 16 L50 23 Z" fill="#F8B4C0" />
          <path d="M79 27 L80.5 16 L70 23 Z" fill="#F8B4C0" />
          <circle cx="60" cy="60" r="31" fill="#F09A3E" />
          <path d="M46 36 Q60 30 74 36" stroke="#E8892F" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="49" cy="56" r="4.2" fill={INK} />
          <circle cx="71" cy="56" r="4.2" fill={INK} />
          <circle cx="50.4" cy="54.5" r="1.4" fill="#fff" />
          <circle cx="72.4" cy="54.5" r="1.4" fill="#fff" />
          <path d="M56.5 66 L63.5 66 L60 70 Z" fill="#D9536F" />
          <path d="M60 70 Q55 76 50 72 M60 70 Q65 76 70 72" stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M26 60 H40 M26 68 H40 M80 60 H94 M80 68 H94" stroke="#C9762A" strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {kind === 'alien' && (
        <>
          <path d="M24 120 Q24 92 60 92 Q96 92 96 120 Z" fill="#3F2E82" />
          <path d="M42 30 Q38 14 30 10" stroke="#8B5CF6" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M78 30 Q82 14 90 10" stroke="#8B5CF6" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="29" cy="9" r="5.5" fill="#0B7A55" />
          <circle cx="91" cy="9" r="5.5" fill="#0B7A55" />
          <ellipse cx="60" cy="58" rx="28" ry="31" fill="#A78BFA" />
          <ellipse cx="49" cy="56" rx="8" ry="10" fill={INK} />
          <ellipse cx="71" cy="56" rx="8" ry="10" fill={INK} />
          <circle cx="51.5" cy="52" r="2.6" fill="#fff" />
          <circle cx="73.5" cy="52" r="2.6" fill="#fff" />
          <path d="M53 75 Q60 81 67 75" stroke={INK} strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <ellipse cx="38" cy="68" rx="4.5" ry="2.8" fill="#7C3AED" opacity="0.45" />
          <ellipse cx="82" cy="68" rx="4.5" ry="2.8" fill="#7C3AED" opacity="0.45" />
        </>
      )}
    </svg>
  );
};
