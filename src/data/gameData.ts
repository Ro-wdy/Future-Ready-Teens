import { SkillItem, InterestItem, CareerMatch, ScenarioQuest, AchievementBadge } from '../types';

export const SKILLS_DATA: SkillItem[] = [
  // Technical & Digital
  {
    id: 'skill-coding',
    name: 'Coding & Software',
    category: 'technical',
    iconName: 'Code',
    tagline: 'Build apps, logic, and automated systems.',
    description: 'Writing Python, JavaScript, or C++ to create apps and digital tools.',
    exampleActivity: 'Building a school club web app or automation bot.',
    color: '#0284C7'
  },
  {
    id: 'skill-ai-prompt',
    name: 'AI & Data Craft',
    category: 'technical',
    iconName: 'Bot',
    tagline: 'Harness AI tools and smart neural assistants.',
    description: 'Directing LLMs, fine-tuning workflows, and synthesizing complex information.',
    exampleActivity: 'Building smart study bots and summarizers.',
    color: '#7C3AED'
  },
  {
    id: 'skill-cyber-trust',
    name: 'Cyber Defense',
    category: 'technical',
    iconName: 'ShieldAlert',
    tagline: 'Safeguard digital accounts, networks, and data.',
    description: 'Auditing security, blocking scams, and fortifying digital identity.',
    exampleActivity: 'Auditing school WiFi safety and running phishing awareness.',
    color: '#AF144B'
  },
  {
    id: 'skill-data-sleuth',
    name: 'Data & Analytics',
    category: 'analytical',
    iconName: 'BarChart3',
    tagline: 'Find trends in numbers to drive smart decisions.',
    description: 'Analyzing datasets and creating visual performance charts.',
    exampleActivity: 'Analyzing student exam trends to optimize study schedules.',
    color: '#2563EB'
  },

  // Scientific & Medical
  {
    id: 'skill-biology-health',
    name: 'Clinical Diagnostics & Biology',
    category: 'scientific_medical',
    iconName: 'Activity',
    tagline: 'Understand human anatomy, pathology, and patient care.',
    description: 'Assessing symptoms, biology concepts, and human health protocols.',
    exampleActivity: 'Volunteering with First Aid squads and biology lab research.',
    color: '#E11D48'
  },
  {
    id: 'skill-biochem-research',
    name: 'Biochem & Lab Research',
    category: 'scientific_medical',
    iconName: 'Dna',
    tagline: 'Investigate molecular science, genetics, and pharmaceuticals.',
    description: 'Conducting lab tests, analyzing cell structures, and biochemical pathways.',
    exampleActivity: 'Testing plant extracts for natural antimicrobial properties.',
    color: '#9333EA'
  },

  // Engineering, Aviation & Trades
  {
    id: 'skill-flight-aero',
    name: 'Aeronautics & Navigation',
    category: 'practical_trades',
    iconName: 'Plane',
    tagline: 'Master flight mechanics, meteorology, and airspace navigation.',
    description: 'Understanding aerodynamics, flight instruments, and spatial vector physics.',
    exampleActivity: 'Practicing on flight simulators and studying weather radar.',
    color: '#0284C7'
  },
  {
    id: 'skill-mechanical-build',
    name: 'Mechanical & Hardware Systems',
    category: 'practical_trades',
    iconName: 'Wrench',
    tagline: 'Design, repair, and optimize machinery and robotics.',
    description: 'Hands-on CAD modeling, circuit wiring, and mechanical prototyping.',
    exampleActivity: 'Fixing engine motors and building an automated robotic arm.',
    color: '#D97706'
  },

  // Creative & Design
  {
    id: 'skill-ux-design',
    name: 'UI/UX & Product Design',
    category: 'creative',
    iconName: 'Palette',
    tagline: 'Design intuitive, accessible digital experiences.',
    description: 'Wireframing user journeys, accessibility, and visual mockups.',
    exampleActivity: 'Redesigning a mobile bus-booking screen for elders.',
    color: '#EC4899'
  },
  {
    id: 'skill-storytelling',
    name: 'Media & Filmmaking',
    category: 'creative',
    iconName: 'Film',
    tagline: 'Captivate audiences through video, scriptwriting, and visuals.',
    description: 'Storyboarding, cinematography, and creative multimedia editing.',
    exampleActivity: 'Producing short educational video clips on teen wellness.',
    color: '#F97316'
  },
  {
    id: 'skill-3d-spatial',
    name: '3D Spatial & Architecture',
    category: 'creative',
    iconName: 'Box',
    tagline: 'Create 3D buildings, AR spaces, and immersive worlds.',
    description: 'Architectural drafting, 3D modeling in Blender, and AR layout.',
    exampleActivity: 'Drafting a zero-carbon sustainable teen library.',
    color: '#8B5CF6'
  },

  // Human, Social & Legal
  {
    id: 'skill-empathy',
    name: 'Empathy & Counseling',
    category: 'human_social',
    iconName: 'HeartHandshake',
    tagline: 'Listen actively and support human emotional wellness.',
    description: 'Peer support, compassionate communication, and emotional resilience.',
    exampleActivity: 'Leading high school peer counseling and anti-bullying circles.',
    color: '#E11D48'
  },
  {
    id: 'skill-persuasion',
    name: 'Advocacy & Public Speaking',
    category: 'human_social',
    iconName: 'Mic',
    tagline: 'Present ideas persuasively to champion policies and causes.',
    description: 'Debate, pitch articulation, and inspiring community action.',
    exampleActivity: 'Leading the Model UN or high school debate championship.',
    color: '#D97706'
  },
  {
    id: 'skill-legal-logic',
    name: 'Legal Logic & Justice',
    category: 'analytical',
    iconName: 'Scale',
    tagline: 'Analyze constitutions, human rights, and contractual law.',
    description: 'Legal reasoning, statutory interpretation, and ethics advocacy.',
    exampleActivity: 'Mock trial participation and reviewing community tenant bylaws.',
    color: '#4F46E5'
  },

  // Business, Finance & Green
  {
    id: 'skill-fin-literacy',
    name: 'Finance & Investments',
    category: 'analytical',
    iconName: 'Coins',
    tagline: 'Master budgeting, investing, valuation, and capital allocation.',
    description: 'Financial forecasting, ROI calculations, and banking workflows.',
    exampleActivity: 'Managing cash flow for a student tuck-shop or club.',
    color: '#B45309'
  },
  {
    id: 'skill-clean-energy',
    name: 'Clean Energy & Solar',
    category: 'green_sustainable',
    iconName: 'Zap',
    tagline: 'Harness solar, battery storage, and smart micro-grids.',
    description: 'Designing renewable power installations and energy efficiency plans.',
    exampleActivity: 'Building a solar phone-charging pavilion for sports day.',
    color: '#EAB308'
  },
  {
    id: 'skill-climate-agri',
    name: 'Agri-Science & Ecology',
    category: 'green_sustainable',
    iconName: 'Sprout',
    tagline: 'Grow food sustainably using hydroponics and soil science.',
    description: 'Precision farming, crop resilience, and organic soil ecology.',
    exampleActivity: 'Managing a rooftop hydroponic vegetable garden.',
    color: '#15803D'
  },
  {
    id: 'skill-sports-kinesiology',
    name: 'Sports Science & Athletics',
    category: 'scientific_medical',
    iconName: 'Trophy',
    tagline: 'Optimize human athletic performance and injury recovery.',
    description: 'Biomechanics, physical therapy routines, and athletic conditioning.',
    exampleActivity: 'Conditioning high school track teams and administering sports rehab.',
    color: '#059669'
  },
  {
    id: 'skill-culinary-arts',
    name: 'Culinary Arts & Nutrition',
    category: 'creative',
    iconName: 'Utensils',
    tagline: 'Craft nutritious cuisine and food science innovation.',
    description: 'Flavor pairing, culinary nutrition, and food safety standards.',
    exampleActivity: 'Developing plant-based high-protein snack bars for athletes.',
    color: '#EA580C'
  },
  {
    id: 'skill-entrepreneurship',
    name: 'Venture Leadership & Grit',
    category: 'leadership',
    iconName: 'Rocket',
    tagline: 'Launch projects, lead teams, and turn ideas into ventures.',
    description: 'Lean startup validation, team coordination, and strategic problem-solving.',
    exampleActivity: 'Starting a profitable eco-friendly merchandise brand.',
    color: '#BE123C'
  }
];

export const INTERESTS_DATA: InterestItem[] = [
  {
    id: 'int-health-med',
    name: 'Medicine & Healthcare',
    domain: 'biotech_health',
    emoji: '🩺',
    description: 'Saving lives, surgery, biomedical science, and public health wellness.',
    trendingTopics: ['Robotic Surgery', 'Telemedicine', 'Vaccine Tech', 'Mental Health']
  },
  {
    id: 'int-aviation-eng',
    name: 'Aviation & Engineering',
    domain: 'aviation_engineering',
    emoji: '✈️',
    description: 'Piloting aircraft, aerospace engineering, robotics, and clean electric transport.',
    trendingTopics: ['Commercial Flight', 'Drone Logistics', 'Electric Aircraft', 'EV Systems']
  },
  {
    id: 'int-fintech',
    name: 'FinTech & Banking',
    domain: 'fintech',
    emoji: '💳',
    description: 'Digital currencies, micro-investments, wealth building, and financial freedom.',
    trendingTopics: ['Mobile Wallets', 'Youth Savings', 'Cross-Border Payments', 'Micro-Credit']
  },
  {
    id: 'int-law-justice',
    name: 'Law, Justice & Policy',
    domain: 'law_justice',
    emoji: '⚖️',
    description: 'Human rights, corporate law, diplomacy, justice reform, and civic leadership.',
    trendingTopics: ['Environmental Law', 'Cyber Rights', 'International Trade', 'Diplomacy']
  },
  {
    id: 'int-ai-tech',
    name: 'AI, Code & Robotics',
    domain: 'ai_robotics',
    emoji: '🤖',
    description: 'Autonomous systems, generative AI, software architecture, and cybersecurity.',
    trendingTopics: ['Machine Learning', 'Ethical AI', 'Cloud Computing', 'IoT Systems']
  },
  {
    id: 'int-creative-arts',
    name: 'Film, Design & Media',
    domain: 'creative_media',
    emoji: '🎬',
    description: 'Cinema, music, animation, digital marketing, and visual storytelling.',
    trendingTopics: ['Digital Cinema', 'Afrobeats Production', 'Brand Design', 'Animation']
  },
  {
    id: 'int-green-planet',
    name: 'Climate & Green Energy',
    domain: 'climate_energy',
    emoji: '🌱',
    description: 'Solar microgrids, carbon reduction, circular economy, and conservation.',
    trendingTopics: ['Solar Grids', 'Clean Mobility', 'Recycling Tech', 'Ocean Cleanup']
  },
  {
    id: 'int-agri-food',
    name: 'Smart Agriculture & Food',
    domain: 'agriculture_food',
    emoji: '🌾',
    description: 'Modern farming, food security, culinary arts, and nutrition science.',
    trendingTopics: ['Hydroponics', 'Drone Farming', 'Organic Nutrition', 'Agri-Logistics']
  },
  {
    id: 'int-sports-wellness',
    name: 'Sports & Physical Health',
    domain: 'sports_wellness',
    emoji: '🏃🏽',
    description: 'Athletic coaching, physiotherapy, fitness technology, and sports management.',
    trendingTopics: ['Sports Rehab', 'Athletic Analytics', 'Peak Performance', 'Youth Fitness']
  },
  {
    id: 'int-education-impact',
    name: 'Education & Community',
    domain: 'social_impact',
    emoji: '📚',
    description: 'Inspiring students, youth mentorship, community empowerment, and equal opportunity.',
    trendingTopics: ['EdTech Apps', 'Youth Clubs', 'STEM Outreach', 'Vocational Skills']
  }
];

export const CAREERS_DATA: CareerMatch[] = [
  // 1. Healthcare & Medicine
  {
    id: 'career-doctor-surgeon',
    title: 'Pediatric Surgeon & Medical Doctor',
    industry: 'Healthcare & Clinical Medicine',
    absaPillar: 'Health, Biotech & Medicine',
    tagline: 'Diagnosing illnesses, performing life-saving surgeries, and healing young lives.',
    matchExplanation: 'Combines Clinical Diagnostics + Deep Empathy + Biochem Lab Research for compassionate medical excellence.',
    requiredSkillIds: ['skill-biology-health', 'skill-empathy', 'skill-biochem-research'],
    primaryInterestIds: ['int-health-med', 'int-education-impact'],
    interestTags: ['science', 'people'],
    futureOutlook: 'Essential Pillar',
    dailyMission: 'Leading surgical teams and providing preventive pediatric care to hundreds of families.',
    hybridQuote: '"Medicine is the highest union of rigorous biological science and deep human compassion."',
    teenActionSteps: [
      'Prioritize Biology, Chemistry, Physics, and Mathematics in high school',
      'Volunteer with St. John Ambulance or the Red Cross youth brigade',
      'Shadow local clinic doctors during school holidays'
    ],
    salaryTier: 'High (KSh 250k - 600k+ / mo)',
    growthScore: 98,
    subjectsNeeded: ['Biology', 'Chemistry', 'Physics / Mathematics', 'English']
  },

  // 2. Aviation & Flight
  {
    id: 'career-airline-pilot',
    title: 'Commercial Airline Pilot & Aviation Officer',
    industry: 'Aviation & Global Aerospace',
    absaPillar: 'Aviation, Engineering & Trades',
    tagline: 'Piloting modern airliners across international skies with safety and precision.',
    matchExplanation: 'Blends Aeronautics Navigation + Mechanical Systems + High-Stake Leadership to command multi-million dollar aircraft.',
    requiredSkillIds: ['skill-flight-aero', 'skill-mechanical-build', 'skill-data-sleuth'],
    primaryInterestIds: ['int-aviation-eng', 'int-ai-tech'],
    interestTags: ['travel', 'tech'],
    futureOutlook: 'High Impact',
    dailyMission: 'Safely navigating Boeing/Airbus commercial flights through adverse weather and global flight corridors.',
    hybridQuote: '"A great pilot thinks three steps ahead of the aircraft through physics, discipline, and calm focus."',
    teenActionSteps: [
      'Excel in Physics, Geography, and Pure Mathematics',
      'Log hours on certified desktop flight simulators (X-Plane/MSFS)',
      'Visit aviation open days at Wilson Airport / East African Aviation School'
    ],
    salaryTier: 'High (KSh 300k - 850k+ / mo)',
    growthScore: 95,
    subjectsNeeded: ['Physics', 'Mathematics', 'Geography', 'English']
  },

  // 3. Law & Justice
  {
    id: 'career-human-rights-lawyer',
    title: 'Human Rights & Constitutional Lawyer',
    industry: 'Law, Justice & Public Policy',
    absaPillar: 'Trust, Law & Governance',
    tagline: 'Advocating for community justice, constitutional rights, and corporate ethics.',
    matchExplanation: 'Combines Legal Logic + Persuasive Advocacy + Deep Empathy to represent citizens in high-court litigation.',
    requiredSkillIds: ['skill-legal-logic', 'skill-persuasion', 'skill-empathy'],
    primaryInterestIds: ['int-law-justice', 'int-education-impact'],
    interestTags: ['people', 'media'],
    futureOutlook: 'Essential Pillar',
    dailyMission: 'Drafting legal petitions and defending vulnerable citizens against injustice in constitutional courts.',
    hybridQuote: '"The law is a shield for the defenseless when wielded with sharp logic and unwavering moral courage."',
    teenActionSteps: [
      'Participate actively in High School Debating, Model UN, and History clubs',
      'Study constitutional law fundamentals and human rights charters',
      'Intern or observe hearings at local law firms and magistrates courts'
    ],
    salaryTier: 'High (KSh 200k - 550k+ / mo)',
    growthScore: 92,
    subjectsNeeded: ['History & Government', 'English / Literature', 'CRE / Social Studies', 'Mathematics']
  },

  // 4. Digital & FinTech
  {
    id: 'career-fintech-strategist',
    title: 'FinTech Product & Mobile Money Architect',
    industry: 'Financial Technology & Banking',
    absaPillar: 'Digital & FinTech',
    tagline: 'Designing seamless digital banking tools that expand financial inclusion across Africa.',
    matchExplanation: 'Merges Financial Modeling + UI/UX Design + Coding to create accessible banking apps.',
    requiredSkillIds: ['skill-fin-literacy', 'skill-ux-design', 'skill-coding'],
    primaryInterestIds: ['int-fintech', 'int-ai-tech'],
    interestTags: ['tech', 'business'],
    futureOutlook: 'Explosive Growth',
    dailyMission: 'Architecting zero-fee mobile micro-investment and savings products for first-time youth account holders.',
    hybridQuote: '"We write code to give every young person direct access to wealth-building tools."',
    teenActionSteps: [
      'Learn Python and spreadsheet financial modeling',
      'Study mobile money workflows and Absa digital banking APIs',
      'Build a prototype savings calculator for school clubs'
    ],
    salaryTier: 'High (KSh 220k - 500k+ / mo)',
    growthScore: 97,
    subjectsNeeded: ['Mathematics', 'Computer Studies', 'Business Studies', 'Economics']
  },

  // 5. Engineering & Clean Energy
  {
    id: 'career-renewable-engineer',
    title: 'Renewable Smart-Grid & EV Engineer',
    industry: 'Clean Energy & E-Mobility',
    absaPillar: 'Sustainability & Green Economy',
    tagline: 'Powering hospitals, communities, and electric transport with solar and battery micro-grids.',
    matchExplanation: 'Combines Clean Energy Systems + Mechanical Systems + Data Analytics to engineer zero-emission power.',
    requiredSkillIds: ['skill-clean-energy', 'skill-mechanical-build', 'skill-data-sleuth'],
    primaryInterestIds: ['int-green-planet', 'int-aviation-eng'],
    interestTags: ['nature', 'tech'],
    futureOutlook: 'Explosive Growth',
    dailyMission: 'Deploying autonomous solar micro-grids and fast EV charging stations for rural schools and clinics.',
    hybridQuote: '"Clean electricity transforms darkness into classroom hours and hospital surgeries."',
    teenActionSteps: [
      'Master Physics, Chemistry, and Mathematics',
      'Build small solar-charging circuits with rechargeable battery packs',
      'Follow renewable energy innovations and battery chemistry breakthroughs'
    ],
    salaryTier: 'High (KSh 180k - 420k+ / mo)',
    growthScore: 99,
    subjectsNeeded: ['Physics', 'Mathematics', 'Chemistry', 'Computer Studies']
  },

  // 6. Cybersecurity & Digital Defense
  {
    id: 'career-cyber-guardian',
    title: 'Cyber Security & Digital Trust Guardian',
    industry: 'Cyber Defense & Forensics',
    absaPillar: 'Trust, Law & Governance',
    tagline: 'Protecting millions of bank accounts, cloud servers, and data networks from cyber criminals.',
    matchExplanation: 'Combines Cyber Defense + Coding + Analytical Logic to neutralize digital security threats.',
    requiredSkillIds: ['skill-cyber-trust', 'skill-coding', 'skill-data-sleuth'],
    primaryInterestIds: ['int-ai-tech', 'int-fintech'],
    interestTags: ['tech', 'science'],
    futureOutlook: 'Essential Pillar',
    dailyMission: 'Simulating red-team cyber attacks on core banking APIs to identify and patch vulnerabilities before hackers do.',
    hybridQuote: '"We stand as silent digital sentinels safeguarding personal privacy and national infrastructure."',
    teenActionSteps: [
      'Participate in beginner CTF (Capture the Flag) security challenges',
      'Learn Linux command-line, networking protocols, and Python scripts',
      'Earn entry-level certifications like CompTIA Security+ or Cisco CCNA'
    ],
    salaryTier: 'High (KSh 200k - 520k+ / mo)',
    growthScore: 99,
    subjectsNeeded: ['Computer Studies', 'Mathematics', 'Physics', 'English']
  },

  // 7. Arts, Film & Media
  {
    id: 'career-film-director',
    title: 'Creative Film Director & Multimedia Producer',
    industry: 'Creative Media & Entertainment',
    absaPillar: 'Creative, Media & Arts',
    tagline: 'Directing cinematic African stories, documentaries, and viral global digital content.',
    matchExplanation: 'Fuses Visual Storytelling + UI/UX & Media + Leadership Grit to direct high-budget films and series.',
    requiredSkillIds: ['skill-storytelling', 'skill-ux-design', 'skill-entrepreneurship'],
    primaryInterestIds: ['int-creative-arts', 'int-education-impact'],
    interestTags: ['media', 'art'],
    futureOutlook: 'High Impact',
    dailyMission: 'Directing cast, cinematographers, and sound engineers to produce African stories for Netflix and global cinema.',
    hybridQuote: '"Our stories deserve world-class visuals, authentic African emotion, and unforgettable sound."',
    teenActionSteps: [
      'Write short movie scripts and shoot videos with your smartphone',
      'Learn video editing in DaVinci Resolve or Premiere Pro',
      'Submit short student films to local youth film festivals'
    ],
    salaryTier: 'High (KSh 150k - 450k+ / mo)',
    growthScore: 91,
    subjectsNeeded: ['Literature / English', 'Art & Design', 'Music / Drama', 'History']
  },

  // 8. Agriculture & Food Security
  {
    id: 'career-agritech-specialist',
    title: 'Smart AgriTech Specialist & Hydroponics Farmer',
    industry: 'Modern Agriculture & Food Systems',
    absaPillar: 'Modern Agriculture & Food',
    tagline: 'Merging drone crop sensors, solar pumps, and hydroponics to double African food yields.',
    matchExplanation: 'Combines Agri-Science + Data Analytics + Clean Energy to solve food security sustainably.',
    requiredSkillIds: ['skill-climate-agri', 'skill-data-sleuth', 'skill-clean-energy'],
    primaryInterestIds: ['int-agri-food', 'int-green-planet'],
    interestTags: ['nature', 'tech'],
    futureOutlook: 'High Impact',
    dailyMission: 'Analyzing soil moisture satellite scans to send SMS irrigation tips to 15,000 smallholder farmers.',
    hybridQuote: '"The greatest technological frontier in Africa is our fertile soil, driven by smart data."',
    teenActionSteps: [
      'Study Agriculture, Biology, and Geography',
      'Set up a vertical kitchen hydroponic herb or tomato tower',
      'Learn drone sensor basics and basic weather data analytics'
    ],
    salaryTier: 'High (KSh 160k - 380k+ / mo)',
    growthScore: 94,
    subjectsNeeded: ['Agriculture', 'Biology', 'Geography', 'Mathematics']
  },

  // 9. Sports Science & Physical Therapy
  {
    id: 'career-sports-physio',
    title: 'Sports Physiotherapist & Athletic Performance Coach',
    industry: 'Sports Science & Physical Medicine',
    absaPillar: 'Education, Sports & Wellness',
    tagline: 'Treating athletic injuries, optimizing biomechanics, and coaching elite champions.',
    matchExplanation: 'Blends Sports Kinesiology + Clinical Diagnostics + Deep Empathy to rehabilitate top athletes.',
    requiredSkillIds: ['skill-sports-kinesiology', 'skill-biology-health', 'skill-empathy'],
    primaryInterestIds: ['int-sports-wellness', 'int-health-med'],
    interestTags: ['sport', 'science'],
    futureOutlook: 'High Impact',
    dailyMission: 'Rehabilitating injured national rugby and marathon athletes using biomechanical motion sensors and therapy.',
    hybridQuote: '"Peak athletic human performance is built on anatomy, injury prevention, and mental strength."',
    teenActionSteps: [
      'Focus on Biology, Physical Education, Physics, and Chemistry',
      'Assist school sports teams as a student trainer and first responder',
      'Study exercise physiology and human muscle anatomy'
    ],
    salaryTier: 'High (KSh 140k - 350k+ / mo)',
    growthScore: 90,
    subjectsNeeded: ['Biology', 'Physics', 'Physical Education', 'Chemistry']
  },

  // 10. Architecture & Urban Design
  {
    id: 'career-sustainable-architect',
    title: 'Sustainable Architectural & Urban Designer',
    industry: 'Architecture & Green Building',
    absaPillar: 'Sustainability & Green Economy',
    tagline: 'Designing zero-carbon skyscrapers, green parks, and smart climate-resilient cities.',
    matchExplanation: 'Combines 3D Spatial Design + Clean Energy + Systems Thinking to construct energy-efficient buildings.',
    requiredSkillIds: ['skill-3d-spatial', 'skill-clean-energy', 'skill-ux-design'],
    primaryInterestIds: ['int-green-planet', 'int-creative-arts'],
    interestTags: ['art', 'nature'],
    futureOutlook: 'High Impact',
    dailyMission: 'Drafting 3D BIM models for solar-powered school campuses and energy-positive residential towers.',
    hybridQuote: '"We do not just construct walls; we create living spaces in harmony with the natural environment."',
    teenActionSteps: [
      'Excel in Art & Design, Physics, Mathematics, and Geography',
      'Learn 3D CAD modeling software like SketchUp, Blender, or AutoCAD',
      'Sketch architectural floorplans of eco-friendly community centers'
    ],
    salaryTier: 'High (KSh 180k - 450k+ / mo)',
    growthScore: 93,
    subjectsNeeded: ['Art & Design', 'Physics', 'Mathematics', 'Geography']
  },

  // 11. AI Engineering & Robotics
  {
    id: 'career-ai-engineer',
    title: 'AI Systems Engineer & Robotics Developer',
    industry: 'Artificial Intelligence & Robotics',
    absaPillar: 'Digital & FinTech',
    tagline: 'Building neural networks, autonomous delivery drones, and intelligent software agents.',
    matchExplanation: 'Combines AI Prompt/Data Craft + Coding + Mechanical Systems to engineer autonomous robots.',
    requiredSkillIds: ['skill-ai-prompt', 'skill-coding', 'skill-mechanical-build'],
    primaryInterestIds: ['int-ai-tech', 'int-aviation-eng'],
    interestTags: ['tech', 'science'],
    futureOutlook: 'Explosive Growth',
    dailyMission: 'Training computer vision algorithms on autonomous agricultural drones to detect crop pests in real time.',
    hybridQuote: '"AI is a tool of boundless creativity when programmed to solve real human challenges."',
    teenActionSteps: [
      'Learn Python, linear algebra, and machine learning frameworks',
      'Build open-source robotics projects with Arduino or Raspberry Pi',
      'Join global student AI hackathons'
    ],
    salaryTier: 'High (KSh 240k - 580k+ / mo)',
    growthScore: 100,
    subjectsNeeded: ['Mathematics', 'Computer Studies', 'Physics', 'English']
  },

  // 12. Mental Health & Psychology
  {
    id: 'career-youth-psychologist',
    title: 'Clinical Youth Psychologist & Wellness Counselor',
    industry: 'Mental Health & Behavioral Science',
    absaPillar: 'Health, Biotech & Medicine',
    tagline: 'Empowering teens and families to overcome anxiety, trauma, and build emotional strength.',
    matchExplanation: 'Blends Deep Empathy + Clinical Diagnostics + Public Advocacy to champion mental wellness.',
    requiredSkillIds: ['skill-empathy', 'skill-biology-health', 'skill-persuasion'],
    primaryInterestIds: ['int-health-med', 'int-education-impact'],
    interestTags: ['people', 'science'],
    futureOutlook: 'Essential Pillar',
    dailyMission: 'Facilitating one-on-one therapy sessions and establishing mental health support programs in schools.',
    hybridQuote: '"Mental wellness is the foundation upon which every other human achievement is built."',
    teenActionSteps: [
      'Study Biology, English/Literature, and Social Sciences',
      'Volunteer in peer counseling circles and youth support hotlines',
      'Read foundational books on psychology and emotional intelligence'
    ],
    salaryTier: 'High (KSh 150k - 360k+ / mo)',
    growthScore: 96,
    subjectsNeeded: ['Biology', 'English', 'Social Studies / CRE', 'Mathematics']
  },

  // 13. Culinary Arts & Food Innovation
  {
    id: 'career-executive-chef',
    title: 'Executive Culinary Chef & Food Innovator',
    industry: 'Gastronomy & Hospitality Management',
    absaPillar: 'Modern Agriculture & Food',
    tagline: 'Crafting world-class African fusion cuisine and managing luxury 5-star hotel kitchens.',
    matchExplanation: 'Combines Culinary Arts + Venture Leadership + UI/UX Experience Design to craft culinary masterpieces.',
    requiredSkillIds: ['skill-culinary-arts', 'skill-entrepreneurship', 'skill-ux-design'],
    primaryInterestIds: ['int-agri-food', 'int-creative-arts'],
    interestTags: ['art', 'business'],
    futureOutlook: 'High Impact',
    dailyMission: 'Designing farm-to-table seasonal menus and mentoring a brigade of 20 pastry and hot-line chefs.',
    hybridQuote: '"Cooking is an edible art form that unites cultures, stimulates all senses, and nourishes the body."',
    teenActionSteps: [
      'Master food science, chemistry, and Home Science in school',
      'Experiment with indigenous African ingredients and flavor pairings',
      'Complete food safety hygiene and kitchen management certifications'
    ],
    salaryTier: 'High (KSh 160k - 400k+ / mo)',
    growthScore: 89,
    subjectsNeeded: ['Home Science', 'Chemistry', 'Business Studies', 'English']
  },

  // 14. Education & STEM Mentorship
  {
    id: 'career-stem-educator',
    title: 'High School STEM Educator & Innovation Mentor',
    industry: 'Education & Future Skills',
    absaPillar: 'Education, Sports & Wellness',
    tagline: 'Inspiring the next generation of engineers, doctors, and innovators through hands-on labs.',
    matchExplanation: 'Merges Advocacy/Speaking + Deep Empathy + Coding/Math to make science thrilling and accessible.',
    requiredSkillIds: ['skill-persuasion', 'skill-empathy', 'skill-coding'],
    primaryInterestIds: ['int-education-impact', 'int-ai-tech'],
    interestTags: ['science', 'people'],
    futureOutlook: 'Essential Pillar',
    dailyMission: 'Leading high school robotics clubs and designing interactive physics experiments for 200 teens daily.',
    hybridQuote: '"A great teacher doesn’t just share formulas; they ignite a lifelong passion for discovery."',
    teenActionSteps: [
      'Master multiple STEM subjects in high school',
      'Tutor junior students in math and physics',
      'Lead school science fair exhibitions and innovation clubs'
    ],
    salaryTier: 'Moderate-High (KSh 120k - 300k+ / mo)',
    growthScore: 92,
    subjectsNeeded: ['Mathematics', 'Physics / Chemistry / Biology', 'English', 'Education']
  },

  // 15. Biomedical & Genetics Research
  {
    id: 'career-biomedical-geneticist',
    title: 'Biomedical Scientist & Genetics Researcher',
    industry: 'Life Sciences & Biotechnology',
    absaPillar: 'Health, Biotech & Medicine',
    tagline: 'Unlocking DNA breakthroughs to eradicate tropical diseases and develop novel therapeutics.',
    matchExplanation: 'Combines Biochem Lab Research + Data Analytics + Clinical Diagnostics for cutting-edge medical discoveries.',
    requiredSkillIds: ['skill-biochem-research', 'skill-data-sleuth', 'skill-biology-health'],
    primaryInterestIds: ['int-health-med', 'int-ai-tech'],
    interestTags: ['science', 'tech'],
    futureOutlook: 'Explosive Growth',
    dailyMission: 'Sequencing pathogen genomes and conducting clinical drug trials at KEMRI and global laboratories.',
    hybridQuote: '"The secrets to human longevity and disease eradication are written inside our cellular code."',
    teenActionSteps: [
      'Excel in Biology, Chemistry, and Mathematics',
      'Read scientific journals on CRISPR gene editing and bioinformatics',
      'Participate in high school biology science congress presentations'
    ],
    salaryTier: 'High (KSh 200k - 480k+ / mo)',
    growthScore: 96,
    subjectsNeeded: ['Biology', 'Chemistry', 'Mathematics', 'Physics']
  },

  // 16. Entrepreneurship & Venture Building
  {
    id: 'career-venture-founder',
    title: 'Circular Tech Founder & Venture Builder',
    industry: 'Entrepreneurship & Innovation',
    absaPillar: 'Sustainability & Green Economy',
    tagline: 'Transforming waste materials and tech solutions into scalable, profitable pan-African ventures.',
    matchExplanation: 'Fuses Venture Leadership + Financial Modeling + Clean Energy to build scalable commercial companies.',
    requiredSkillIds: ['skill-entrepreneurship', 'skill-fin-literacy', 'skill-clean-energy'],
    primaryInterestIds: ['int-fintech', 'int-green-planet'],
    interestTags: ['business', 'tech'],
    futureOutlook: 'High Impact',
    dailyMission: 'Pitching venture capital investors, managing product development, and scaling sustainable clean energy hardware.',
    hybridQuote: '"Entrepreneurship is turning bold ideas into products that create jobs and improve communities."',
    teenActionSteps: [
      'Study Business Studies, Economics, and Mathematics',
      'Launch a small-scale school or community micro-business',
      'Learn how startup pitch decks, cap tables, and revenue models work'
    ],
    salaryTier: 'Variable / High (Equity + KSh 200k - 600k+ / mo)',
    growthScore: 95,
    subjectsNeeded: ['Business Studies', 'Economics', 'Mathematics', 'English']
  }
,
  // 17. Music & Audio
  {
    id: 'career-music-producer',
    title: 'Music Producer & Audio Engineer',
    industry: 'Music, Audio & Live Sound',
    absaPillar: 'Creative, Media & Arts',
    tagline: 'Turning a voice note into a record people play on repeat.',
    matchExplanation: 'Sits where Storytelling meets Coding — modern production is half creative ear, half software.',
    requiredSkillIds: ['skill-storytelling', 'skill-coding', 'skill-ux-design'],
    primaryInterestIds: ['int-creative-arts', 'int-ai-tech'],
    interestTags: ['music', 'tech'],
    futureOutlook: 'Explosive Growth',
    dailyMission: 'Recording artists, mixing sessions, mastering releases and shaping the sound of a live show.',
    hybridQuote: '"Producers are engineers who happen to have taste — and taste is the part that cannot be automated."',
    teenActionSteps: [
      'Learn one free DAW properly — BandLab, GarageBand or Reaper',
      'Record and finish ten songs, however rough they sound',
      'Offer to run sound at school events, church or local gigs'
    ],
    salaryTier: 'Variable / Good (KSh 60k - 300k+ / mo)',
    growthScore: 88,
    subjectsNeeded: ['Music', 'Physics', 'Computer Studies', 'English']
  },

  // 18. Sport meets data
  {
    id: 'career-sports-data-analyst',
    title: 'Sports Performance Data Analyst',
    industry: 'Sports Technology & Analytics',
    absaPillar: 'Education, Sports & Wellness',
    tagline: 'Using the numbers behind every match to decide who plays, who rests and who gets signed.',
    matchExplanation: 'Blends Data Investigation + Sports Kinesiology — the fastest-growing job in professional sport.',
    requiredSkillIds: ['skill-data-sleuth', 'skill-sports-kinesiology', 'skill-coding'],
    primaryInterestIds: ['int-sports-wellness', 'int-ai-tech'],
    interestTags: ['sport', 'tech'],
    futureOutlook: 'Explosive Growth',
    dailyMission: 'Tagging match footage, reading GPS and heart-rate data, and briefing coaches before selection.',
    hybridQuote: '"Every top club now hires more analysts than scouts. The numbers see what the eye misses."',
    teenActionSteps: [
      'Keep Mathematics strong — this job is statistics wearing a tracksuit',
      'Track your own team\'s stats in a spreadsheet for a full season',
      'Learn basic Python or Excel modelling on a free course'
    ],
    salaryTier: 'Good (KSh 90k - 350k / mo)',
    growthScore: 93,
    subjectsNeeded: ['Mathematics', 'Physical Education / Biology', 'Computer Studies', 'English']
  },

  // 19. Creator economy
  {
    id: 'career-content-creator',
    title: 'Digital Content Creator & Social Strategist',
    industry: 'Creator Economy & Digital Media',
    absaPillar: 'Creative, Media & Arts',
    tagline: 'Building an audience, then building a business on top of it.',
    matchExplanation: 'Storytelling + Persuasion + Empathy — the three things every brand now pays creators for.',
    requiredSkillIds: ['skill-storytelling', 'skill-persuasion', 'skill-empathy'],
    primaryInterestIds: ['int-creative-arts', 'int-education-impact'],
    interestTags: ['media', 'people'],
    futureOutlook: 'Explosive Growth',
    dailyMission: 'Planning content, filming and editing, reading the analytics and pitching brand partnerships.',
    hybridQuote: '"Attention is the new shelf space, and the people who can hold it are writing their own cheques."',
    teenActionSteps: [
      'Post consistently on one platform for 90 days and study what worked',
      'Learn editing properly — CapCut, Premiere or DaVinci Resolve',
      'Take Business Studies so you understand rates, contracts and tax'
    ],
    salaryTier: 'Variable / High (KSh 40k - 500k+ / mo)',
    growthScore: 90,
    subjectsNeeded: ['English', 'Business Studies', 'Art & Design', 'Computer Studies']
  },

  // 20. Games
  {
    id: 'career-game-developer',
    title: 'Game Designer & Developer',
    industry: 'Gaming & Interactive Entertainment',
    absaPillar: 'Digital & FinTech',
    tagline: 'Designing worlds people lose whole weekends inside.',
    matchExplanation: 'Coding + 3D Spatial Design + UX — games are the hardest and most fun place to use all three.',
    requiredSkillIds: ['skill-coding', 'skill-3d-spatial', 'skill-ux-design'],
    primaryInterestIds: ['int-ai-tech', 'int-creative-arts'],
    interestTags: ['tech', 'art'],
    futureOutlook: 'Explosive Growth',
    dailyMission: 'Prototyping mechanics, building levels, playtesting with real players and fixing what is not fun yet.',
    hybridQuote: '"African studios are hiring — and the skills transfer straight into film, simulation and training tech."',
    teenActionSteps: [
      'Build one small game in Unity, Godot or Roblox Studio and finish it',
      'Keep Mathematics and Physics — game engines run on both',
      'Join a game jam; 48 hours teaches more than a term'
    ],
    salaryTier: 'Good (KSh 100k - 400k / mo)',
    growthScore: 92,
    subjectsNeeded: ['Mathematics', 'Physics', 'Computer Studies', 'Art & Design']
  },

  // 21. Brand & marketing
  {
    id: 'career-brand-strategist',
    title: 'Brand & Digital Marketing Strategist',
    industry: 'Advertising, Brand & Communications',
    absaPillar: 'Creative, Media & Arts',
    tagline: 'Deciding what a brand stands for — then making a whole country believe it.',
    matchExplanation: 'Persuasion + Storytelling + Data Investigation: creative instinct proven with numbers.',
    requiredSkillIds: ['skill-persuasion', 'skill-storytelling', 'skill-data-sleuth'],
    primaryInterestIds: ['int-fintech', 'int-creative-arts'],
    interestTags: ['business', 'media'],
    futureOutlook: 'High Impact',
    dailyMission: 'Running campaigns, briefing creatives, reading performance dashboards and pitching to clients.',
    hybridQuote: '"Marketing is the one creative job that has to prove its results in a spreadsheet every month."',
    teenActionSteps: [
      'Run the socials for a school club and track what grows them',
      'Study Business Studies and English — this job is writing plus numbers',
      'Rebuild a brand you think is boring, as a practice portfolio piece'
    ],
    salaryTier: 'Good (KSh 90k - 400k / mo)',
    growthScore: 87,
    subjectsNeeded: ['English', 'Business Studies', 'Mathematics', 'Art & Design']
  },

  // 22. Conservation
  {
    id: 'career-wildlife-conservationist',
    title: 'Wildlife Conservation Scientist',
    industry: 'Conservation & Environmental Science',
    absaPillar: 'Sustainability & Green Economy',
    tagline: 'Keeping Kenya\'s wildlife and wild places alive — with science, not slogans.',
    matchExplanation: 'Climate & Agri Science + Biology + Data Investigation: fieldwork backed by evidence.',
    requiredSkillIds: ['skill-climate-agri', 'skill-biology-health', 'skill-data-sleuth'],
    primaryInterestIds: ['int-green-planet', 'int-education-impact'],
    interestTags: ['nature', 'science'],
    futureOutlook: 'High Impact',
    dailyMission: 'Tracking populations, running camera-trap data, working with communities and advising on policy.',
    hybridQuote: '"Conservation pays for people who can do the science and talk to the community. Very few can do both."',
    teenActionSteps: [
      'Take Biology and Geography seriously — they are the entry ticket',
      'Volunteer with a local conservancy, wildlife club or clean-up group',
      'Learn to use basic mapping tools like Google Earth or QGIS'
    ],
    salaryTier: 'Moderate / Good (KSh 70k - 250k / mo)',
    growthScore: 86,
    subjectsNeeded: ['Biology', 'Geography', 'Chemistry', 'Mathematics']
  },

  // 23. Travel & hospitality
  {
    id: 'career-travel-experience-manager',
    title: 'Travel & Guest Experience Manager',
    industry: 'Tourism, Hospitality & Events',
    absaPillar: 'Education, Sports & Wellness',
    tagline: 'Designing the trip people talk about for the next ten years.',
    matchExplanation: 'Empathy + Persuasion + Venture Leadership — hospitality is people skills run as a business.',
    requiredSkillIds: ['skill-empathy', 'skill-persuasion', 'skill-entrepreneurship'],
    primaryInterestIds: ['int-education-impact', 'int-fintech'],
    interestTags: ['travel', 'people'],
    futureOutlook: 'High Impact',
    dailyMission: 'Building itineraries, leading front-of-house teams, handling guests and managing partner lodges.',
    hybridQuote: '"Tourism is one of Kenya\'s biggest employers, and the top jobs go to people who can run a P&L."',
    teenActionSteps: [
      'Take Geography, Business Studies and a foreign language if offered',
      'Get a holiday job in hospitality — front desk teaches you everything',
      'Plan a full trip for your family on a fixed budget, start to finish'
    ],
    salaryTier: 'Moderate / Good (KSh 60k - 300k / mo)',
    growthScore: 84,
    subjectsNeeded: ['Geography', 'Business Studies', 'English', 'French / Kiswahili']
  },

  // 24. Product design
  {
    id: 'career-ux-designer',
    title: 'UX Designer & Product Researcher',
    industry: 'Digital Product & Service Design',
    absaPillar: 'Digital & FinTech',
    tagline: 'Making sure the app actually makes sense to the person holding the phone.',
    matchExplanation: 'UX Design + Empathy + Data Investigation — design decisions made from real user behaviour.',
    requiredSkillIds: ['skill-ux-design', 'skill-empathy', 'skill-data-sleuth'],
    primaryInterestIds: ['int-ai-tech', 'int-creative-arts'],
    interestTags: ['art', 'tech'],
    futureOutlook: 'Explosive Growth',
    dailyMission: 'Interviewing users, sketching flows, prototyping in Figma and testing designs before anything is built.',
    hybridQuote: '"Every bank, hospital and government service is now an app — and every app needs someone who thinks like the user."',
    teenActionSteps: [
      'Learn Figma free and redesign an app you find frustrating',
      'Interview five people about how they use their phones — that is real research',
      'Keep Art & Design plus Mathematics or Computer Studies'
    ],
    salaryTier: 'High (KSh 120k - 450k / mo)',
    growthScore: 94,
    subjectsNeeded: ['Art & Design', 'Computer Studies', 'Mathematics', 'English']
  },

  // 25. Coaching
  {
    id: 'career-performance-coach',
    title: 'Performance Coach & Sports Manager',
    industry: 'Sport, Coaching & Athlete Development',
    absaPillar: 'Education, Sports & Wellness',
    tagline: 'Getting the best out of people who already thought they were giving their best.',
    matchExplanation: 'Sports Kinesiology + Empathy + Persuasion — the science of training plus the art of motivating.',
    requiredSkillIds: ['skill-sports-kinesiology', 'skill-empathy', 'skill-persuasion'],
    primaryInterestIds: ['int-sports-wellness', 'int-education-impact'],
    interestTags: ['sport', 'people'],
    futureOutlook: 'High Impact',
    dailyMission: 'Planning training blocks, managing injuries and workload, and holding a squad together over a season.',
    hybridQuote: '"There is a whole industry behind every athlete, and it lasts far longer than a playing career."',
    teenActionSteps: [
      'Take Biology and Physical Education — coaching is applied physiology',
      'Get a junior coaching badge and run sessions for a younger team',
      'Learn to write a training plan and actually track whether it worked'
    ],
    salaryTier: 'Moderate / Good (KSh 60k - 300k / mo)',
    growthScore: 85,
    subjectsNeeded: ['Biology', 'Physical Education', 'Mathematics', 'English']
  },

  // 26. Live music business
  {
    id: 'career-artist-manager',
    title: 'Artist Manager & Live Events Producer',
    industry: 'Music Business & Live Entertainment',
    absaPillar: 'Creative, Media & Arts',
    tagline: 'Running the career and the calendar behind the person on stage.',
    matchExplanation: 'Venture Leadership + Persuasion + Financial Literacy — an artist is a business with a heartbeat.',
    requiredSkillIds: ['skill-entrepreneurship', 'skill-persuasion', 'skill-fin-literacy'],
    primaryInterestIds: ['int-creative-arts', 'int-fintech'],
    interestTags: ['music', 'business'],
    futureOutlook: 'Emerging Frontier',
    dailyMission: 'Booking shows, negotiating deals, managing budgets and protecting the artist\'s rights and royalties.',
    hybridQuote: '"African music is a global export now. The managers who understand contracts are the ones who last."',
    teenActionSteps: [
      'Put on one small live event end to end — budget, venue, promo, door',
      'Take Business Studies and Mathematics; learn what a royalty split is',
      'Manage a friend who makes music and treat it like a real job'
    ],
    salaryTier: 'Variable / Good (KSh 50k - 350k+ / mo)',
    growthScore: 83,
    subjectsNeeded: ['Business Studies', 'Mathematics', 'English', 'Music']
  },

  // 27. Journalism & broadcast
  {
    id: 'career-broadcast-journalist',
    title: 'Broadcast Journalist & Presenter',
    industry: 'News, Broadcast & Documentary',
    absaPillar: 'Trust, Law & Governance',
    tagline: 'Finding out what is really going on, then telling everyone in ninety seconds.',
    matchExplanation: 'Storytelling + Legal Logic + Persuasion — reporting has to be gripping and legally watertight.',
    requiredSkillIds: ['skill-storytelling', 'skill-legal-logic', 'skill-persuasion'],
    primaryInterestIds: ['int-law-justice', 'int-creative-arts'],
    interestTags: ['media', 'people'],
    futureOutlook: 'Essential Pillar',
    dailyMission: 'Chasing sources, verifying facts, writing to time and going live when the story breaks.',
    hybridQuote: '"In a world full of AI-generated noise, a journalist people trust becomes more valuable, not less."',
    teenActionSteps: [
      'Take English, History and Government seriously — this job is writing',
      'Start a school news page, podcast or bulletin and publish weekly',
      'Practise reading to camera and to a stopwatch until it feels normal'
    ],
    salaryTier: 'Moderate / Good (KSh 70k - 300k / mo)',
    growthScore: 82,
    subjectsNeeded: ['English', 'History & Government', 'Kiswahili', 'Literature']
  },

  // 28. Fashion
  {
    id: 'career-fashion-designer',
    title: 'Fashion & Sustainable Textile Designer',
    industry: 'Fashion, Textiles & Circular Design',
    absaPillar: 'Creative, Media & Arts',
    tagline: 'Designing clothes people want — without the waste the industry is famous for.',
    matchExplanation: '3D Spatial Design + Venture Leadership + Climate Science: style with a supply chain that stands up.',
    requiredSkillIds: ['skill-3d-spatial', 'skill-entrepreneurship', 'skill-climate-agri'],
    primaryInterestIds: ['int-creative-arts', 'int-green-planet'],
    interestTags: ['art', 'business'],
    futureOutlook: 'Emerging Frontier',
    dailyMission: 'Sketching collections, sourcing fabric, costing pieces and managing production with local tailors.',
    hybridQuote: '"Kenyan design is being bought globally. The brands that win can explain where every metre of fabric came from."',
    teenActionSteps: [
      'Learn to actually sew and pattern-cut, not just sketch',
      'Take Art & Design plus Business Studies — half of fashion is costing',
      'Make and sell ten pieces; find out what people really pay for'
    ],
    salaryTier: 'Variable / Good (KSh 50k - 350k+ / mo)',
    growthScore: 84,
    subjectsNeeded: ['Art & Design', 'Business Studies', 'Home Science', 'Mathematics']
  },

  // 29. Logistics
  {
    id: 'career-supply-chain-manager',
    title: 'Supply Chain & Logistics Manager',
    industry: 'Trade, Logistics & Operations',
    absaPillar: 'Aviation, Engineering & Trades',
    tagline: 'Making sure the right thing reaches the right place before anybody notices it was missing.',
    matchExplanation: 'Data Investigation + Financial Literacy + Mechanical Systems — the invisible job that keeps trade moving.',
    requiredSkillIds: ['skill-data-sleuth', 'skill-fin-literacy', 'skill-mechanical-build'],
    primaryInterestIds: ['int-fintech', 'int-aviation-eng'],
    interestTags: ['business', 'travel'],
    futureOutlook: 'Essential Pillar',
    dailyMission: 'Routing shipments, managing warehouses and suppliers, and cutting cost out of every kilometre.',
    hybridQuote: '"Mombasa port and Nairobi\'s air freight hub run on people who can read a spreadsheet and a map at once."',
    teenActionSteps: [
      'Take Mathematics, Geography and Business Studies',
      'Learn Excel properly — it is still the language of logistics',
      'Ask for holiday work in a warehouse, shop or delivery business'
    ],
    salaryTier: 'Good (KSh 90k - 350k / mo)',
    growthScore: 88,
    subjectsNeeded: ['Mathematics', 'Geography', 'Business Studies', 'English']
  },

  // 30. Marine & field science
  {
    id: 'career-marine-biologist',
    title: 'Marine Biologist & Blue Economy Researcher',
    industry: 'Marine Science & Blue Economy',
    absaPillar: 'Sustainability & Green Economy',
    tagline: 'Working out how the coast stays alive — and how coastal communities do too.',
    matchExplanation: 'Biology + Biochem Research + Climate Science, done in the field rather than at a desk.',
    requiredSkillIds: ['skill-biology-health', 'skill-biochem-research', 'skill-climate-agri'],
    primaryInterestIds: ['int-green-planet', 'int-health-med'],
    interestTags: ['nature', 'travel'],
    futureOutlook: 'Emerging Frontier',
    dailyMission: 'Diving survey sites, sampling reefs and fisheries, and advising on coastal protection and quotas.',
    hybridQuote: '"The blue economy is one of the biggest untapped employers on this coastline."',
    teenActionSteps: [
      'Biology, Chemistry and Geography are non-negotiable for this one',
      'Learn to swim well and look into dive certification',
      'Join a beach clean-up or coastal conservation programme'
    ],
    salaryTier: 'Moderate / Good (KSh 70k - 280k / mo)',
    growthScore: 85,
    subjectsNeeded: ['Biology', 'Chemistry', 'Geography', 'Mathematics']
  }
];

export const SCENARIO_QUESTS: ScenarioQuest[] = [
  {
    id: 'quest-agri-wallet',
    title: 'Mission: Solar Irrigation Agri-Wallet',
    tagline: 'Kitui farmers need solar pumps without upfront collateral.',
    challengeBrief: 'Farmers face severe droughts. Assemble the 3 vital skills to launch a pay-as-you-harvest mobile credit system with solar drip equipment.',
    targetIndustry: 'FinTech & Smart Agriculture',
    absaPillar: 'Modern Agriculture & Food',
    contextLocation: 'Kitui, Kenya',
    availableSkillIds: [
      'skill-fin-literacy',
      'skill-ux-design',
      'skill-clean-energy',
      'skill-data-sleuth',
      'skill-3d-spatial',
      'skill-empathy'
    ],
    correctSkillIds: ['skill-fin-literacy', 'skill-ux-design', 'skill-clean-energy'],
    minRequired: 3,
    explanation: 'Financial Modeling structures the flexible micro-loan, UX Design makes USSD simple, and Clean Energy sizes the solar pump hardware.',
    unlockedCareerTitle: 'FinTech Product & Mobile Money Architect',
    impactQuote: '"5,000 family farms now enjoy constant water flow and steady harvest revenues."',
    xpReward: 350
  },
  {
    id: 'quest-cyber-defense',
    title: 'Mission: Shielding 1,000,000 Teen Wallets',
    tagline: 'Phishing and SIM-swap scams target high school accounts.',
    challengeBrief: 'Absa is launching zero-fee youth accounts. Assemble the 3 skills to build automated fraud shields and engaging video security tips.',
    targetIndustry: 'Cybersecurity & Financial Defense',
    absaPillar: 'Trust, Law & Governance',
    contextLocation: 'Nairobi & East Africa',
    availableSkillIds: [
      'skill-cyber-trust',
      'skill-storytelling',
      'skill-coding',
      'skill-sports-kinesiology',
      'skill-legal-logic',
      'skill-climate-agri'
    ],
    correctSkillIds: ['skill-cyber-trust', 'skill-coding', 'skill-storytelling'],
    minRequired: 3,
    explanation: 'Cyber Defense detects malicious SMS, Coding builds automated anomaly filters, and Media Storytelling creates safety videos teens watch.',
    unlockedCareerTitle: 'Cyber Security & Digital Trust Guardian',
    impactQuote: '"Zero accounts breached! Security awareness stopped 99.4% of attacks."',
    xpReward: 400
  },
  {
    id: 'quest-community-solar',
    title: 'Mission: Solar Micro-Grids for Schools',
    tagline: 'Boarding schools suffer blackouts during evening exam prep.',
    challengeBrief: 'Assemble the skill team to engineer lithium battery banks, model ROI savings, and pitch alumni donors for funding.',
    targetIndustry: 'Clean Energy & Infrastructure',
    absaPillar: 'Sustainability & Green Economy',
    contextLocation: 'Rift Valley, Kenya',
    availableSkillIds: [
      'skill-clean-energy',
      'skill-fin-literacy',
      'skill-persuasion',
      'skill-3d-spatial',
      'skill-ai-prompt',
      'skill-mechanical-build'
    ],
    correctSkillIds: ['skill-clean-energy', 'skill-fin-literacy', 'skill-persuasion'],
    minRequired: 3,
    explanation: 'Clean Energy designs the battery array, Finance models the 18-month diesel savings ROI, and Public Speaking raises capital from alumni.',
    unlockedCareerTitle: 'Renewable Smart-Grid & EV Engineer',
    impactQuote: '"Classroom lights stayed on 100% of the term, boosting exam averages by 24%."',
    xpReward: 350
  },
  {
    id: 'quest-remote-clinic',
    title: 'Mission: Remote Health AI Diagnostic Hub',
    tagline: 'Rural clinics need rapid triage for maternal and child health.',
    challengeBrief: 'Assemble the 3 skills to deploy a low-bandwidth AI symptom checker, biological test validation, and compassionate community care.',
    targetIndustry: 'Healthcare & Biotechnology',
    absaPillar: 'Health, Biotech & Medicine',
    contextLocation: 'Turkana County, Kenya',
    availableSkillIds: [
      'skill-biology-health',
      'skill-ai-prompt',
      'skill-empathy',
      'skill-flight-aero',
      'skill-culinary-arts',
      'skill-fin-literacy'
    ],
    correctSkillIds: ['skill-biology-health', 'skill-ai-prompt', 'skill-empathy'],
    minRequired: 3,
    explanation: 'Clinical Diagnostics validates symptoms, AI Prompting crafts low-data triage logic, and Empathy ensures compassionate patient care.',
    unlockedCareerTitle: 'Pediatric Surgeon & Medical Doctor',
    impactQuote: '"Over 12,000 mothers and infants received prompt diagnostic care."',
    xpReward: 400
  }
];

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'badge-support-pioneer',
    title: 'Career Explorer',
    description: 'Explored comprehensive teen career guidance roadmaps.',
    icon: 'Compass',
    color: '#AF144B'
  },
  {
    id: 'badge-passport-certified',
    title: 'Future Ready Pioneer',
    description: 'Generated your official Absa Future-Ready Teen Career Passport.',
    icon: 'Award',
    color: '#9333EA'
  },
  {
    id: 'badge-fintech-master',
    title: 'FinTech Alchemist',
    description: 'Mastered financial technology and digital money pathways.',
    icon: 'Coins',
    color: '#FFB800'
  },
  {
    id: 'badge-eco-warrior',
    title: 'Green Titan',
    description: 'Solved clean energy and sustainable agriculture scenario quests.',
    icon: 'Sprout',
    color: '#16A34A'
  },
  {
    id: 'badge-cyber-sentinel',
    title: 'Cyber Sentinel',
    description: 'Shielded digital communities from virtual threats in quests.',
    icon: 'ShieldCheck',
    color: '#0284C7'
  },
  {
    id: 'badge-medical-hero',
    title: 'Healer & Innovator',
    description: 'Explored clinical medicine and life science pathways.',
    icon: 'Activity',
    color: '#E11D48'
  }
];

export const WORK_STYLES = [
  {
    id: 'style-builder',
    title: 'The Tech & System Builder',
    tagline: 'I love figuring out how machines, code, or airplanes work.',
    emoji: '🛠️'
  },
  {
    id: 'style-healer',
    title: 'The Healer & Scientist',
    tagline: 'I love biological discovery, medicine, and caring for people.',
    emoji: '🩺'
  },
  {
    id: 'style-creator',
    title: 'The Creative Visionary',
    tagline: 'I love storytelling, visual arts, filmmaking, and architecture.',
    emoji: '🎨'
  },
  {
    id: 'style-leader',
    title: 'The Leader & Advocate',
    tagline: 'I love debating, starting businesses, law, and justice.',
    emoji: '🚀'
  }
];

export const TEEN_CAREER_FAQS = [
  {
    q: 'How do I choose high school subjects (KCSE / IGCSE) for my dream career?',
    a: 'Focus on your core pillar: For Medicine/Engineering take Physics, Chemistry, Biology & Math. For Law & Media take History, Literature & Languages. For FinTech & Business take Math, Computer Studies & Business. Balance what you enjoy with prerequisite requirements.',
    category: 'Subject Selection'
  },
  {
    q: 'Are skills more important than degrees today?',
    a: 'Both work together! A degree provides strong theoretical fundamentals and licensing (e.g. Doctor, Lawyer, Pilot), but hands-on skills (coding, communication, digital tools, problem solving) help you stand out and build real projects early.',
    category: 'Skills & Degrees'
  },
  {
    q: 'What if I have multiple different passions (e.g., Art AND Biology)?',
    a: 'Modern careers are hybrid! An artist who loves biology becomes a Medical 3D Animator or Prosthetics Designer. A coder who loves law becomes an AI Ethics Lawyer or Cyber Investigator. Hybrid skill sets are the most valuable.',
    category: 'Hybrid Careers'
  },
  {
    q: 'How can a teenager gain practical experience before turning 18?',
    a: '1) Build personal projects (websites, apps, garden models, videos). 2) Volunteer with local community clubs and charities. 3) Take free online courses on Coursera, YouTube, or Absa ReadytoWork. 4) Shadow professionals during school breaks.',
    category: 'Experience & Internships'
  },
  {
    q: 'What careers are resistant to AI automation?',
    a: 'Careers requiring deep human empathy, ethical judgment, hands-on physical dexterity, and high-level creativity (such as Surgeons, Trial Lawyers, Film Directors, Pilots, Sustainable Architects, and Mental Health Counselors) remain uniquely human.',
    category: 'AI & Future of Work'
  }
];
