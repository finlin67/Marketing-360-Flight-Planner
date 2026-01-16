// ============= CITIES (Marketing Functions as Geographic Locations) =============
export interface City {
  id: string;
  name: string;
  function: string;
  coords: [number, number]; // [longitude, latitude] - for react-simple-maps
  region: 'NA' | 'EU' | 'APAC' | 'MENA';
  description: string;
}

export const CITIES: City[] = [
  {
    id: 'nyc',
    name: 'New York City',
    function: 'Content Marketing',
    coords: [-74.0060, 40.7128], // [longitude, latitude]
    region: 'NA',
    description: 'The content capital - blogs, whitepapers, thought leadership',
  },
  {
    id: 'lax',
    name: 'Los Angeles',
    function: 'Social Media',
    coords: [-118.2437, 34.0522], // [longitude, latitude]
    region: 'NA',
    description: 'Social media hub - engagement, community, influencer marketing',
  },
  {
    id: 'sfo',
    name: 'San Francisco',
    function: 'AI & Marketing Tech',
    coords: [-122.4194, 37.7749], // [longitude, latitude]
    region: 'NA',
    description: 'Innovation center - AI, automation, cutting-edge martech',
  },
  {
    id: 'chi',
    name: 'Chicago',
    function: 'Sales Enablement',
    coords: [-87.6298, 41.8781], // [longitude, latitude]
    region: 'NA',
    description: 'Sales-marketing alignment - collateral, training, enablement',
  },
  {
    id: 'tor',
    name: 'Toronto',
    function: 'Account-Based Marketing',
    coords: [-79.3832, 43.6532], // [longitude, latitude]
    region: 'NA',
    description: 'ABM headquarters - target account strategy and orchestration',
  },
  {
    id: 'lon',
    name: 'London',
    function: 'Demand Generation',
    coords: [-0.1278, 51.5074], // [longitude, latitude]
    region: 'EU',
    description: 'Demand gen central - pipeline, lead gen, campaign management',
  },
  {
    id: 'par',
    name: 'Paris',
    function: 'Brand & Positioning',
    coords: [2.3522, 48.8566], // [longitude, latitude]
    region: 'EU',
    description: 'Brand excellence - positioning, messaging, creative',
  },
  {
    id: 'ber',
    name: 'Berlin',
    function: 'Market Research',
    coords: [13.4050, 52.5200], // [longitude, latitude]
    region: 'EU',
    description: 'Insights hub - customer research, competitive intelligence',
  },
  {
    id: 'tok',
    name: 'Tokyo',
    function: 'SEO & Organic',
    coords: [139.6503, 35.6762], // [longitude, latitude]
    region: 'APAC',
    description: 'SEO mastery - organic search, technical SEO, content optimization',
  },
  {
    id: 'seo',
    name: 'Seoul',
    function: 'Video Marketing',
    coords: [126.9780, 37.5665], // [longitude, latitude]
    region: 'APAC',
    description: 'Video production - demos, webinars, multimedia content',
  },
  {
    id: 'sin',
    name: 'Singapore',
    function: 'Growth Marketing',
    coords: [103.8198, 1.3521], // [longitude, latitude]
    region: 'APAC',
    description: 'Growth hacking - experimentation, optimization, viral loops',
  },
  {
    id: 'dub',
    name: 'Dubai',
    function: 'Omnichannel',
    coords: [55.2708, 25.2048], // [longitude, latitude]
    region: 'MENA',
    description: 'Omnichannel orchestration - unified customer experience',
  },
  {
    id: 'sto',
    name: 'Stockholm',
    function: 'Marketing Operations',
    coords: [18.0686, 59.3293], // [longitude, latitude]
    region: 'EU',
    description: 'MarOps excellence - process, systems, efficiency',
  },
];

// Helper function to get airport code from city id
function getAirportCode(cityId: string): string {
  const codes: Record<string, string> = {
    'nyc': 'NYC',
    'lax': 'LAX',
    'sfo': 'SFO',
    'chi': 'ORD',
    'tor': 'YYZ',
    'lon': 'LHR',
    'par': 'CDG',
    'ber': 'BER',
    'tok': 'NRT',
    'seo': 'ICN',
    'sin': 'SIN',
    'dub': 'DXB',
    'sto': 'ARN',
  };
  return codes[cityId] || cityId.toUpperCase();
}

// Generate GeoJSON for city labels
export function getCitiesGeoJSON() {
  return {
    type: 'FeatureCollection' as const,
    features: CITIES.map(city => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [city.coords[0], city.coords[1]], // [longitude, latitude]
      },
      properties: {
        id: city.id,
        name: city.name,
        function: city.function,
        code: getAirportCode(city.id),
        description: city.description,
        region: city.region,
      },
    })),
  };
}

// ============= ROUTES (Growth Paths Between Functions) =============
export interface Route {
  id: string;
  from: string; // city id
  to: string; // city id
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  requiredScore: number;
  requiredMiles: number;
  estimatedDuration: string;
  waypoints: Waypoint[];
}

export interface Waypoint {
  title: string;
  duration: string;
  description: string;
  deliverables: string[];
}

export const ROUTES: Route[] = [
  {
    id: 'content-demandgen',
    from: 'nyc',
    to: 'lon',
    name: 'Content → Demand Gen',
    difficulty: 'Medium',
    requiredScore: 40,
    requiredMiles: 1800,
    estimatedDuration: '90-120 days',
    waypoints: [
      {
        title: 'Content Audit & Gap Analysis',
        duration: '2 weeks',
        description: 'Evaluate existing content for demand gen potential',
        deliverables: ['Content inventory', 'Performance analysis', 'Gap identification'],
      },
      {
        title: 'Lead Magnet Development',
        duration: '3 weeks',
        description: 'Create high-value gated content assets',
        deliverables: ['3-5 premium assets', 'Landing pages', 'Nurture sequences'],
      },
      {
        title: 'Campaign Launch & Optimization',
        duration: '6 weeks',
        description: 'Execute multi-channel campaigns with content',
        deliverables: ['Active campaigns', 'Lead scoring model', 'Attribution dashboard'],
      },
    ],
  },
  {
    id: 'content-seo',
    from: 'nyc',
    to: 'tok',
    name: 'Content → SEO Mastery',
    difficulty: 'Medium',
    requiredScore: 40,
    requiredMiles: 2100,
    estimatedDuration: '60-90 days',
    waypoints: [
      {
        title: 'SEO Audit & Keyword Research',
        duration: '2 weeks',
        description: 'Analyze current SEO performance and opportunities',
        deliverables: ['Technical audit', 'Keyword strategy', 'Content gaps'],
      },
      {
        title: 'Content Optimization',
        duration: '4 weeks',
        description: 'Optimize existing content for search',
        deliverables: ['20+ optimized pages', 'Internal linking', 'Schema markup'],
      },
      {
        title: 'Authority Building',
        duration: '8 weeks',
        description: 'Build topical authority and backlinks',
        deliverables: ['Pillar content', 'Link building campaign', 'Rankings improvement'],
      },
    ],
  },
  {
    id: 'content-abm',
    from: 'nyc',
    to: 'tor',
    name: 'Content → ABM',
    difficulty: 'Hard',
    requiredScore: 60,
    requiredMiles: 1200,
    estimatedDuration: '120-150 days',
    waypoints: [
      {
        title: 'ICP Definition & Account Selection',
        duration: '2 weeks',
        description: 'Define ideal customer profile and target accounts',
        deliverables: ['ICP document', 'Target account list', 'Account tiers'],
      },
      {
        title: 'Account Intelligence & Personalization',
        duration: '4 weeks',
        description: 'Research accounts and create personalized content',
        deliverables: ['Account dossiers', 'Personalized content', 'Custom playbooks'],
      },
      {
        title: 'ABM Orchestration & Measurement',
        duration: '8 weeks',
        description: 'Launch coordinated ABM campaigns',
        deliverables: ['Multi-channel campaigns', 'Account scoring', 'ABM dashboard'],
      },
    ],
  },
  {
    id: 'social-video',
    from: 'lax',
    to: 'seo',
    name: 'Social → Video',
    difficulty: 'Easy',
    requiredScore: 25,
    requiredMiles: 1500,
    estimatedDuration: '45-60 days',
    waypoints: [
      {
        title: 'Video Strategy & Planning',
        duration: '1 week',
        description: 'Define video content strategy and formats',
        deliverables: ['Video strategy', 'Content calendar', 'Production plan'],
      },
      {
        title: 'Production & Editing',
        duration: '3 weeks',
        description: 'Create video content library',
        deliverables: ['10+ video assets', 'Social clips', 'Thumbnail designs'],
      },
      {
        title: 'Distribution & Optimization',
        duration: '4 weeks',
        description: 'Launch and optimize video campaigns',
        deliverables: ['Channel strategy', 'Performance tracking', 'Optimization playbook'],
      },
    ],
  },
  {
    id: 'demandgen-ops',
    from: 'lon',
    to: 'sto',
    name: 'Demand Gen → Marketing Ops',
    difficulty: 'Medium',
    requiredScore: 50,
    requiredMiles: 900,
    estimatedDuration: '90 days',
    waypoints: [
      {
        title: 'Process Documentation',
        duration: '2 weeks',
        description: 'Document current demand gen processes',
        deliverables: ['Process maps', 'System inventory', 'Pain points'],
      },
      {
        title: 'Automation & Integration',
        duration: '5 weeks',
        description: 'Build automated workflows and integrations',
        deliverables: ['Lead routing', 'Scoring automation', 'CRM sync'],
      },
      {
        title: 'Reporting & Analytics',
        duration: '4 weeks',
        description: 'Implement comprehensive reporting',
        deliverables: ['Dashboards', 'Attribution model', 'Weekly reports'],
      },
    ],
  },
  {
    id: 'ai-sales',
    from: 'sfo',
    to: 'chi',
    name: 'AI → Sales Enablement',
    difficulty: 'Hard',
    requiredScore: 70,
    requiredMiles: 2200,
    estimatedDuration: '120 days',
    waypoints: [
      {
        title: 'AI Use Case Definition',
        duration: '2 weeks',
        description: 'Identify AI opportunities in sales process',
        deliverables: ['Use case matrix', 'ROI projections', 'Implementation plan'],
      },
      {
        title: 'AI Tool Implementation',
        duration: '6 weeks',
        description: 'Deploy AI-powered sales tools',
        deliverables: ['Conversation intelligence', 'Predictive analytics', 'Content generation'],
      },
      {
        title: 'Sales Training & Adoption',
        duration: '8 weeks',
        description: 'Train sales team on AI-powered workflows',
        deliverables: ['Training program', 'Playbooks', 'Adoption metrics'],
      },
    ],
  },
  {
    id: 'seo-growth',
    from: 'tok',
    to: 'sin',
    name: 'SEO → Growth Marketing',
    difficulty: 'Medium',
    requiredScore: 55,
    requiredMiles: 1600,
    estimatedDuration: '75-90 days',
    waypoints: [
      {
        title: 'Growth Audit',
        duration: '1 week',
        description: 'Identify growth opportunities and bottlenecks',
        deliverables: ['Funnel analysis', 'Opportunity map', 'Growth hypotheses'],
      },
      {
        title: 'Experimentation Framework',
        duration: '3 weeks',
        description: 'Build systematic testing approach',
        deliverables: ['Experiment pipeline', 'Testing infrastructure', 'Success metrics'],
      },
      {
        title: 'Growth Loops',
        duration: '6 weeks',
        description: 'Build and optimize growth loops',
        deliverables: ['Viral loops', 'Referral program', 'Product-led growth'],
      },
    ],
  },
];

// ============= ASSESSMENT QUESTIONS =============
export interface Question {
  id: number;
  category: string;
  question: string;
  description: string;
  options: { label: string; value: number }[];
}

export const QUICK_ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Strategy & Planning',
    question: 'How mature is your marketing strategy and planning process?',
    description: 'Consider strategic planning, goal-setting, market positioning, and competitive analysis.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 2,
    category: 'Content & Communication',
    question: 'How sophisticated is your content marketing operation?',
    description: 'Assess content creation, editorial calendar, distribution channels, and performance measurement.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 3,
    category: 'Demand Generation',
    question: 'How effective is your demand generation and lead nurturing?',
    description: 'Evaluate lead generation, multi-channel campaigns, nurture programs, and conversion optimization.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 4,
    category: 'Sales & Marketing Alignment',
    question: 'How aligned are your sales and marketing teams?',
    description: 'Measure shared goals, SLAs, handoff processes, and joint revenue accountability.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 5,
    category: 'Marketing Operations',
    question: 'How mature are your marketing operations and processes?',
    description: 'Assess process documentation, workflow automation, resource management, and operational efficiency.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 6,
    category: 'Marketing Technology',
    question: 'How optimized is your marketing technology ecosystem?',
    description: 'Evaluate tool selection, integration, utilization, data flow, and tech stack ROI.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 7,
    category: 'Data & Analytics',
    question: 'How data-driven are your marketing decisions?',
    description: 'Assess data collection, analysis capabilities, attribution modeling, and predictive insights.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 8,
    category: 'Brand Strategy',
    question: 'How clear and differentiated is your brand positioning?',
    description: 'Evaluate brand clarity, messaging consistency, competitive differentiation, and market perception.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 9,
    category: 'Customer Journey',
    question: 'How integrated and optimized is your customer journey?',
    description: 'Assess touchpoint mapping, personalization, omnichannel consistency, and experience measurement.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 10,
    category: 'Team & Capabilities',
    question: 'How capable and well-structured is your marketing team?',
    description: 'Evaluate team skills, role clarity, training programs, and alignment with marketing goals.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
];

// ============= DEEP DIVE ASSESSMENT QUESTIONS =============
// Complete 25-question assessment (combines Quick Scan + additional questions)
export const DEEP_DIVE_QUESTIONS: Question[] = [
  // Include all Quick Scan questions first (1-10)
  ...QUICK_ASSESSMENT_QUESTIONS,
  // Additional 15 questions for comprehensive assessment (questions 11-25)
  {
    id: 11,
    category: 'Marketing Operations',
    question: 'How sophisticated is your marketing operations infrastructure?',
    description: 'Assess process documentation, workflow automation, resource allocation, operational metrics, and team efficiency.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 12,
    category: 'Team Structure',
    question: 'How well-structured and capable is your marketing team?',
    description: 'Evaluate team size, role clarity, skill gaps, training programs, and organizational structure alignment.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 13,
    category: 'Budget & ROI',
    question: 'How effectively do you allocate budget and track marketing ROI?',
    description: 'Assess budget planning, allocation across channels, ROI measurement, cost per acquisition tracking, and financial accountability.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 14,
    category: 'Technology Integration',
    question: 'How well-integrated is your marketing technology stack?',
    description: 'Evaluate data flow between tools, API integrations, single source of truth, and unified customer view.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 15,
    category: 'Data Flow & Architecture',
    question: 'How mature is your marketing data architecture and flow?',
    description: 'Assess data collection, storage, transformation, accessibility, and data quality management.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 16,
    category: 'Attribution Modeling',
    question: 'How sophisticated is your marketing attribution model?',
    description: 'Evaluate multi-touch attribution, channel contribution analysis, conversion path tracking, and revenue attribution accuracy.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 17,
    category: 'Content Production',
    question: 'How efficient and scalable is your content production workflow?',
    description: 'Assess content planning, production processes, quality control, distribution strategy, and content performance measurement.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 18,
    category: 'Lead Scoring',
    question: 'How advanced is your lead scoring and qualification system?',
    description: 'Evaluate lead scoring models, behavioral tracking, qualification criteria, sales handoff processes, and conversion rates.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 19,
    category: 'Sales-Marketing SLAs',
    question: 'How well-defined are your sales and marketing service level agreements?',
    description: 'Assess lead response times, qualification criteria, handoff processes, feedback loops, and joint accountability metrics.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 20,
    category: 'Customer Journey Mapping',
    question: 'How comprehensive is your customer journey mapping and optimization?',
    description: 'Evaluate touchpoint identification, journey stages, pain point analysis, personalization strategy, and experience measurement.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 21,
    category: 'Marketing Governance',
    question: 'How mature is your marketing governance and compliance framework?',
    description: 'Assess policy documentation, compliance processes, risk management, audit procedures, and regulatory adherence.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 22,
    category: 'Campaign Orchestration',
    question: 'How sophisticated is your multi-channel campaign orchestration?',
    description: 'Evaluate campaign planning, cross-channel coordination, timing optimization, and unified campaign measurement.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 23,
    category: 'Marketing Automation',
    question: 'How advanced is your marketing automation and workflow efficiency?',
    description: 'Assess automation coverage, workflow complexity, trigger-based campaigns, lead nurturing programs, and efficiency gains.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 24,
    category: 'Performance Measurement',
    question: 'How comprehensive is your marketing performance measurement framework?',
    description: 'Evaluate KPI selection, dashboard quality, reporting frequency, predictive analytics, and business impact measurement.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
  {
    id: 25,
    category: 'Innovation & Experimentation',
    question: 'How mature is your marketing innovation and experimentation culture?',
    description: 'Assess A/B testing programs, experimentation framework, innovation initiatives, learning culture, and continuous improvement processes.',
    options: [
      { label: 'Not developed / Reactive only', value: 0 },
      { label: 'Basic / Getting started', value: 25 },
      { label: 'Defined / Structured approach', value: 50 },
      { label: 'Advanced / Data-driven', value: 75 },
      { label: 'World-class / Industry leading', value: 100 },
    ],
  },
];

// ============= PRE-BUILT SCENARIOS =============
export interface Scenario {
  id: string;
  title: string;
  description: string;
  
  // Existing fields (kept for backward compatibility)
  industry: string;
  challenge: string;
  from: string; // city id
  to: string; // city id
  duration: string;
  investment: string;
  complexity: 1 | 2 | 3 | 4 | 5;
  expectedOutcomes: string[];
  phases?: ScenarioPhase[]; // Optional - some scenarios may not have phases
  purpose?: string[]; // Array of purpose keywords that match this scenario
  waypointCities?: string[]; // Cities along the route (optional)
  
  // NEW fields for industry-specific scenarios
  companySize?: string; // e.g., "SMB", "Mid-Market", "Enterprise", "All"
  problem?: string; // Problem statement (alternative to challenge)
  desiredOutcome?: string; // Desired outcome description
  requiredSteps?: string[]; // Array of required steps (alternative to phases)
  obstacles?: string[]; // Potential obstacles
  successMeasures?: string[]; // Success criteria/measures
  
  // Metadata
  targetAudience?: string; // Legacy field, kept for compatibility
  estimatedDuration?: string; // Alternative to duration
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'; // Alternative to complexity
  requiredScore?: number; // Minimum score needed to attempt
  requiredMiles?: number; // Minimum flight miles needed
}

export interface ScenarioPhase {
  name: string;
  duration: string;
  tasks: string[];
  deliverables: string[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'launch-abm',
    title: 'Launch ABM Program',
    industry: 'Cross-Industry',
    companySize: 'Mid-Market',
    challenge: 'We generate leads but struggle to land enterprise accounts',
    problem: 'Broad demand generation not converting high-value accounts',
    desiredOutcome: 'Targeted ABM program focused on enterprise accounts with personalized engagement',
    from: 'nyc',
    to: 'tor',
    duration: '90-120 days',
    estimatedDuration: '90-120 days',
    investment: '$25k-50k',
    complexity: 3,
    difficulty: 'Intermediate',
    description: 'Transform your demand gen into a targeted ABM engine focused on high-value enterprise accounts.',
    purpose: ['Launch ABM', 'Scale pipeline', 'Improve pipeline quality', 'Land enterprise accounts'],
    waypointCities: ['nyc', 'tor'],
    requiredScore: 60,
    requiredMiles: 1200,
    targetAudience: 'SaaS / Tech',
    expectedOutcomes: [
      'Define ICP and identify 50-100 target accounts',
      'Create personalized content and playbooks for top accounts',
      'Launch orchestrated ABM campaigns across 3+ channels',
      'Implement account scoring and engagement tracking',
    ],
    phases: [
      {
        name: 'Foundation',
        duration: '2-3 weeks',
        tasks: [
          'Define Ideal Customer Profile (ICP)',
          'Create account selection criteria',
          'Build target account list',
          'Set up ABM technology stack',
        ],
        deliverables: [
          'ICP document',
          'Tier 1/2/3 account list',
          'ABM platform configuration',
        ],
      },
      {
        name: 'Intelligence & Personalization',
        duration: '4-5 weeks',
        tasks: [
          'Research top 20 accounts deeply',
          'Create account-specific insights',
          'Develop personalized content themes',
          'Build custom landing pages',
        ],
        deliverables: [
          'Account dossiers',
          'Personalized content assets',
          'Custom web experiences',
        ],
      },
      {
        name: 'Campaign Launch',
        duration: '6-8 weeks',
        tasks: [
          'Launch multi-channel ABM campaigns',
          'Coordinate sales outreach',
          'Run targeted advertising',
          'Track account engagement',
        ],
        deliverables: [
          'Active campaigns',
          'Sales-marketing playbooks',
          'ABM dashboard',
        ],
      },
    ],
  },
  {
    id: 'scale-pipeline',
    title: 'Scale Pipeline Generation',
    industry: 'Cross-Industry',
    companySize: 'Mid-Market',
    challenge: 'Pipeline is inconsistent and unpredictable',
    problem: 'Inconsistent pipeline generation and lack of predictable demand',
    desiredOutcome: 'Predictable, scalable demand generation engine with automated operations',
    from: 'lon',
    to: 'sto',
    duration: '120-150 days',
    estimatedDuration: '120-150 days',
    investment: '$40k-80k',
    complexity: 4,
    difficulty: 'Advanced',
    description: 'Build a predictable, scalable demand generation engine with robust operations.',
    purpose: ['Scale pipeline', 'Improve pipeline quality', 'Build demand engine', 'Reduce CAC'],
    waypointCities: ['lon', 'sto'],
    requiredScore: 50,
    requiredMiles: 1800,
    targetAudience: 'SaaS / Tech',
    expectedOutcomes: [
      'Implement lead scoring and routing automation',
      'Create 5+ nurture tracks with behavioral triggers',
      'Build attribution model and pipeline dashboard',
      'Establish weekly pipeline review cadence',
    ],
    phases: [
      {
        name: 'Demand Gen Audit',
        duration: '2 weeks',
        tasks: [
          'Audit current funnel and conversion rates',
          'Analyze campaign performance',
          'Identify bottlenecks and gaps',
        ],
        deliverables: [
          'Funnel analysis',
          'Performance benchmarks',
          'Opportunity roadmap',
        ],
      },
      {
        name: 'Operations Build',
        duration: '6 weeks',
        tasks: [
          'Build lead scoring model',
          'Create automated routing',
          'Implement nurture tracks',
          'Set up attribution',
        ],
        deliverables: [
          'Scoring framework',
          'Routing automation',
          'Nurture campaigns',
          'Attribution model',
        ],
      },
      {
        name: 'Scale & Optimize',
        duration: '8 weeks',
        tasks: [
          'Launch new campaign types',
          'A/B test messaging and offers',
          'Optimize conversion paths',
          'Build predictive models',
        ],
        deliverables: [
          'Multi-channel campaigns',
          'Testing framework',
          'Pipeline dashboard',
        ],
      },
    ],
  },
  {
    id: 'optimize-martech',
    title: 'Optimize MarTech Stack',
    industry: 'Cross-Industry',
    companySize: 'All',
    challenge: "Too many tools that don't talk to each other",
    problem: 'Fragmented tech stack with disconnected tools and data silos',
    desiredOutcome: 'Integrated, optimized marketing technology stack with unified data flow',
    from: 'sfo',
    to: 'sto',
    duration: '60-90 days',
    estimatedDuration: '60-90 days',
    investment: '$10k-30k',
    complexity: 3,
    difficulty: 'Intermediate',
    description: 'Audit, rationalize, and integrate your marketing technology for maximum efficiency.',
    purpose: ['Optimize tech stack', 'Improve efficiency', 'Reduce costs', 'Integrate systems'],
    waypointCities: ['sfo', 'sto'],
    requiredScore: 40,
    requiredMiles: 900,
    targetAudience: 'All Industries',
    expectedOutcomes: [
      'Complete tech stack inventory and utilization audit',
      'Eliminate 20-30% of underutilized tools',
      'Integrate core platforms (CRM, MAP, Analytics)',
      'Create tech stack documentation and training',
    ],
    phases: [
      {
        name: 'Tech Stack Audit',
        duration: '2 weeks',
        tasks: [
          'Inventory all marketing tools',
          'Assess utilization and ROI',
          'Identify redundancies',
          'Map data flows',
        ],
        deliverables: [
          'Complete tool inventory',
          'Utilization scorecard',
          'Rationalization plan',
        ],
      },
      {
        name: 'Integration & Consolidation',
        duration: '4-6 weeks',
        tasks: [
          'Sunset redundant tools',
          'Build core integrations',
          'Migrate data',
          'Test workflows',
        ],
        deliverables: [
          'Integrated tech stack',
          'Data flow documentation',
          'Testing results',
        ],
      },
      {
        name: 'Training & Adoption',
        duration: '2-3 weeks',
        tasks: [
          'Create SOPs for each tool',
          'Train team members',
          'Set up governance',
          'Monitor adoption',
        ],
        deliverables: [
          'Tech stack playbook',
          'Training materials',
          'Governance framework',
        ],
      },
    ],
  },
  
  // ============= ADDITIONAL 57 INDUSTRY-SPECIFIC SCENARIOS =============
  // TODO: Import and parse your CSV file (mega_scenarios__1_.csv) here
  // 
  // CSV Format Expected:
  // ID, Industry, Company Size, Problem, Desired Outcome, Required Steps, Obstacles, Success Measures
  //
  // For each CSV row, create a scenario object following this structure:
  // {
  //   id: 'U1', // Generate from industry prefix + index (U1-U8 for Cross-Industry, H1-H3 for Healthcare, etc.)
  //   title: 'Scale Organic + Paid Search Pipeline', // Derived from problem or create descriptive title
  //   description: 'Strong content output but no SEO or PPC strategy; organic traffic not translating to pipeline.',
  //   industry: 'Cross-Industry',
  //   companySize: 'Mid-Market',
  //   problem: 'Strong content output but no SEO or PPC strategy; organic traffic not translating to pipeline.',
  //   desiredOutcome: 'Predictable pipeline generation from organic + paid search.',
  //   requiredSteps: ['SEO audit', 'Keyword/intent mapping', 'PPC foundation', 'Content optimization', 'Landing pages', 'Campaign scaling'], // Parse from CSV (split by → or ;)
  //   obstacles: ['Writer resistance to SEO structure', 'Lack of PPC expertise', 'Slow leadership expectations'], // Parse from CSV (split by ;)
  //   successMeasures: ['+300% qualified organic traffic', 'PPC CAC efficiency', '25% pipeline from inbound'], // Parse from CSV (split by ;)
  //   estimatedDuration: '90-120 days',
  //   difficulty: 'Intermediate',
  //   from: 'nyc', // Map based on problem/outcome (see mapping logic below)
  //   to: 'lon', // Map based on problem/outcome
  //   requiredScore: 40,
  //   requiredMiles: 1800,
  //   // Optional: Add phases if you have detailed phase data
  //   phases: [...],
  // }
  //
  // CITY MAPPING LOGIC:
  // - Content/SEO problems → from: 'nyc' (Content Marketing)
  // - Demand gen/pipeline → to: 'lon' (Demand Generation)
  // - ABM focused → to: 'tor' (Account-Based Marketing)
  // - Analytics/attribution → to: 'sto' (Marketing Operations)
  // - Tech stack/automation → to: 'sfo' (AI & Marketing Tech)
  // - Sales alignment → to: 'chi' (Sales Enablement)
  // - Lifecycle/retention → to: 'sin' (Growth Marketing)
  // - Brand/awareness → to: 'par' (Brand & Positioning)
  // - SEO/organic → from/to: 'tok' (SEO & Organic)
  // - Video → from/to: 'seo' (Video Marketing)
  //
  // Add your 57 scenarios here following the format above:
  
  // Example template (remove after adding real data):
  // {
  //   id: 'U1',
  //   title: 'Scale Organic + Paid Search Pipeline',
  //   description: 'Strong content output but no SEO or PPC strategy; organic traffic not translating to pipeline.',
  //   industry: 'Cross-Industry',
  //   companySize: 'Mid-Market',
  //   problem: 'Strong content output but no SEO or PPC strategy; organic traffic not translating to pipeline.',
  //   desiredOutcome: 'Predictable pipeline generation from organic + paid search.',
  //   requiredSteps: [
  //     'SEO audit',
  //     'Keyword/intent mapping',
  //     'PPC foundation',
  //     'Content optimization',
  //     'Landing pages',
  //     'Campaign scaling'
  //   ],
  //   obstacles: [
  //     'Writer resistance to SEO structure',
  //     'Lack of PPC expertise',
  //     'Slow leadership expectations'
  //   ],
  //   successMeasures: [
  //     '+300% qualified organic traffic',
  //     'PPC CAC efficiency',
  //     '25% pipeline from inbound'
  //   ],
  //   estimatedDuration: '90-120 days',
  //   difficulty: 'Intermediate',
  //   from: 'nyc',
  //   to: 'lon',
  //   requiredScore: 40,
  //   requiredMiles: 1800,
  // },
];

// ============= SCENARIO FILTERING HELPER FUNCTIONS =============

// Filter scenarios by industry
export function getScenariosByIndustry(industry: string): Scenario[] {
  return SCENARIOS.filter(s => 
    s.industry === industry || s.industry === 'Cross-Industry'
  );
}

// Filter scenarios by company size
export function getScenariosByCompanySize(size: string): Scenario[] {
  return SCENARIOS.filter(s =>
    s.companySize === size || s.companySize === 'All'
  );
}

// Get recommended scenarios based on user profile
export function getRecommendedScenarios(
  userIndustry?: string,
  userCompanySize?: string,
  userScore?: number,
  userMiles?: number
): Scenario[] {
  let scenarios = [...SCENARIOS];
  
  // Filter by industry match
  if (userIndustry) {
    scenarios = scenarios.filter(s =>
      s.industry === userIndustry || s.industry === 'Cross-Industry'
    );
  }
  
  // Filter by company size
  if (userCompanySize) {
    scenarios = scenarios.filter(s =>
      s.companySize === userCompanySize || s.companySize === 'All'
    );
  }
  
  // Filter by score (only show scenarios user can attempt)
  if (userScore !== undefined) {
    scenarios = scenarios.filter(s =>
      !s.requiredScore || userScore >= s.requiredScore
    );
  }
  
  // Filter by flight miles
  if (userMiles !== undefined) {
    scenarios = scenarios.filter(s =>
      !s.requiredMiles || userMiles >= s.requiredMiles
    );
  }
  
  return scenarios.slice(0, 6); // Return top 6
}

// Group scenarios by industry
export function getScenariosByIndustryGrouped(): Record<string, Scenario[]> {
  const grouped: Record<string, Scenario[]> = {};
  
  SCENARIOS.forEach(scenario => {
    const industry = scenario.industry || 'Other';
    if (!grouped[industry]) {
      grouped[industry] = [];
    }
    grouped[industry].push(scenario);
  });
  
  // Sort industries: Cross-Industry first, then alphabetically
  const sorted: Record<string, Scenario[]> = {};
  const industries = Object.keys(grouped).sort((a, b) => {
    if (a === 'Cross-Industry') return -1;
    if (b === 'Cross-Industry') return 1;
    return a.localeCompare(b);
  });
  
  industries.forEach(industry => {
    sorted[industry] = grouped[industry];
  });
  
  return sorted;
}

// Get unique industries from scenarios
export function getUniqueIndustries(): string[] {
  const industries = new Set(SCENARIOS.map(s => s.industry));
  return Array.from(industries).sort((a, b) => {
    if (a === 'Cross-Industry') return -1;
    if (b === 'Cross-Industry') return 1;
    return a.localeCompare(b);
  });
}

// Get unique company sizes from scenarios
export function getUniqueCompanySizes(): string[] {
  const sizes = new Set(SCENARIOS.map(s => s.companySize).filter(Boolean));
  return Array.from(sizes).sort();
}

// Search scenarios by query
export function searchScenarios(query: string): Scenario[] {
  if (!query.trim()) return SCENARIOS;
  
  const lowerQuery = query.toLowerCase();
  return SCENARIOS.filter(s =>
    s.title?.toLowerCase().includes(lowerQuery) ||
    s.description?.toLowerCase().includes(lowerQuery) ||
    s.problem?.toLowerCase().includes(lowerQuery) ||
    s.desiredOutcome?.toLowerCase().includes(lowerQuery) ||
    s.industry?.toLowerCase().includes(lowerQuery) ||
    s.challenge?.toLowerCase().includes(lowerQuery)
  );
}

// ============= PROFILE OPTIONS =============
export const ROLES = ['CMO', 'VP Marketing', 'Director of Marketing', 'Marketing Manager', 'Marketing Ops', 'Demand Gen', 'Content Marketing', 'Product Marketing', 'Growth Marketing'];
export const INDUSTRIES = ['SaaS', 'Technology', 'Financial Services', 'Healthcare', 'Manufacturing', 'Retail', 'Professional Services', 'Other'];
export const COMPANY_SIZES = ['1-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'];
export const REVENUES = ['<$1M', '$1M-$10M', '$10M-$50M', '$50M-$100M', '$100M-$500M', '$500M+'];
export const COMPANY_TYPES = ['B2B', 'B2C', 'B2B2C', 'Marketplace'];
export const GOALS = [
  'Improve pipeline quality',
  'Reduce CAC',
  'Increase retention',
  'Launch ABM',
  'Optimize tech stack',
  'Build content engine',
  'Improve attribution',
  'Scale globally',
];

// Deep Dive Profile Options
export const MARKETING_BUDGETS = [
  '<$50K',
  '$50K-$100K',
  '$100K-$250K',
  '$250K-$500K',
  '$500K-$1M',
  '$1M-$2M',
  '$2M-$5M',
  '$5M+',
];

export const SALES_CYCLES = [
  '<1 month',
  '1-3 months',
  '3-6 months',
  '6-12 months',
  '12+ months',
];

export const DEAL_SIZES = [
  '<$10K',
  '$10K-$25K',
  '$25K-$50K',
  '$50K-$100K',
  '$100K-$250K',
  '$250K-$500K',
  '$500K+',
];

export const TARGET_SEGMENTS = [
  'SMB',
  'Mid-Market',
  'Enterprise',
  'Startups',
  'Non-profit',
  'Government',
  'Education',
];

// Purpose options for booking form
export const PURPOSE_OPTIONS = [
  'Scale pipeline',
  'Launch ABM',
  'Optimize tech stack',
  'Build demand engine',
  'Improve pipeline quality',
  'Land enterprise accounts',
  'Reduce CAC',
  'Scale globally',
  'Improve efficiency',
  'Integrate systems',
];
