export type SkillCategory = 
  | 'technical' 
  | 'creative' 
  | 'human_social' 
  | 'analytical' 
  | 'green_sustainable' 
  | 'leadership'
  | 'scientific_medical'
  | 'practical_trades';

export type InterestDomain = 
  | 'fintech' 
  | 'ai_robotics' 
  | 'climate_energy' 
  | 'creative_media' 
  | 'biotech_health' 
  | 'social_impact' 
  | 'gaming_metaverse' 
  | 'cyber_trust'
  | 'aviation_engineering'
  | 'law_justice'
  | 'sports_wellness'
  | 'agriculture_food';

export type AbsaPillar = 
  | 'Digital & FinTech' 
  | 'Sustainability & Green Economy' 
  | 'Creative, Media & Arts' 
  | 'Trust, Law & Governance' 
  | 'Health, Biotech & Medicine' 
  | 'Modern Agriculture & Food'
  | 'Aviation, Engineering & Trades'
  | 'Education, Sports & Wellness';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  iconName: string;
  tagline: string;
  description: string;
  exampleActivity: string;
  color: string;
}

export interface InterestItem {
  id: string;
  name: string;
  domain: InterestDomain;
  emoji: string;
  description: string;
  trendingTopics: string[];
}

export interface CareerMatch {
  id: string;
  title: string;
  industry: string;
  absaPillar: AbsaPillar;
  tagline: string;
  matchExplanation: string;
  requiredSkillIds: string[];
  primaryInterestIds: string[];
  futureOutlook: 'Explosive Growth' | 'High Impact' | 'Emerging Frontier' | 'Essential Pillar';
  dailyMission: string;
  hybridQuote: string;
  teenActionSteps: string[];
  salaryTier: string;
  growthScore: number; // 1-100
  subjectsNeeded?: string[];
}

export interface ScenarioQuest {
  id: string;
  title: string;
  tagline: string;
  challengeBrief: string;
  targetIndustry: string;
  absaPillar: AbsaPillar;
  contextLocation: string;
  availableSkillIds: string[];
  correctSkillIds: string[];
  minRequired: number;
  explanation: string;
  unlockedCareerTitle: string;
  impactQuote: string;
  xpReward: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  color: string;
}

export interface TeenPassportData {
  teenName: string;
  teenAvatar: string;
  selectedSkillIds: string[];
  selectedInterestIds: string[];
  workStyle: string;
  targetCareerId?: string;
  generatedDate: string;
  passportId: string;
  totalXp: number;
  level: number;
  completedQuestsCount: number;
  matchesPlayedCount: number;
}
