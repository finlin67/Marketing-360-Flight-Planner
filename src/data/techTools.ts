// Marketing Technology Tools Library
// Organized by category with company size recommendations

export interface TechTool {
  id: string;
  name: string;
  category: string;
  description?: string;
  recommendedFor: ('SMB' | 'Mid-Market' | 'Enterprise')[];
  isTopTool: boolean;
}

export const TECH_TOOL_CATEGORIES = [
  'Data & Analytics',
  'Content & Creative',
  'Acquisition & Marketing Automation',
  'CRO & Experience',
  'Retention & Customer Success'
] as const;

export const MARKETING_TECH_TOOLS: TechTool[] = [
  // Data & Analytics
  { id: 'google-analytics', name: 'Google Analytics', category: 'Data & Analytics', recommendedFor: ['SMB', 'Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'mixpanel', name: 'Mixpanel', category: 'Data & Analytics', recommendedFor: ['Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'amplitude', name: 'Amplitude', category: 'Data & Analytics', recommendedFor: ['Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'segment', name: 'Segment', category: 'Data & Analytics', recommendedFor: ['Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'looker-tableau', name: 'Looker / Tableau', category: 'Data & Analytics', recommendedFor: ['SMB', 'Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'hotjar', name: 'Hotjar', category: 'Data & Analytics', recommendedFor: ['SMB', 'Mid-Market'], isTopTool: true },
  { id: 'semrush', name: 'Semrush', category: 'Data & Analytics', recommendedFor: ['SMB', 'Mid-Market'], isTopTool: true },
  { id: 'ahrefs', name: 'Ahrefs', category: 'Data & Analytics', recommendedFor: ['Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'triple-whale', name: 'Triple Whale / Rockerbox', category: 'Data & Analytics', recommendedFor: ['Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'zoominfo', name: 'ZoomInfo / Leadfeeder', category: 'Data & Analytics', recommendedFor: ['Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'looker-studio', name: 'Looker Studio', category: 'Data & Analytics', recommendedFor: ['SMB'], isTopTool: false },
  { id: 'heap', name: 'Heap', category: 'Data & Analytics', recommendedFor: ['Enterprise'], isTopTool: false },
  { id: 'sixsense', name: '6sense / Demandbase', category: 'Data & Analytics', recommendedFor: ['Enterprise'], isTopTool: false },
  { id: 'fullstory', name: 'FullStory', category: 'Data & Analytics', recommendedFor: ['Enterprise'], isTopTool: false },
  { id: 'recast', name: 'Recast / Measured', category: 'Data & Analytics', recommendedFor: ['Enterprise'], isTopTool: false },
  { id: 'snowflake', name: 'Snowflake / BigQuery', category: 'Data & Analytics', recommendedFor: ['Enterprise'], isTopTool: false },
  { id: 'adobe-cdp', name: 'Adobe Experience Platform / Tealium CDP', category: 'Data & Analytics', recommendedFor: ['Enterprise'], isTopTool: false },
  { id: 'powerbi', name: 'Power BI', category: 'Data & Analytics', recommendedFor: ['Enterprise'], isTopTool: false },

  // Content & Creative
  { id: 'adobe-creative', name: 'Adobe Creative Cloud', category: 'Content & Creative', recommendedFor: ['Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'canva', name: 'Canva', category: 'Content & Creative', recommendedFor: ['SMB', 'Mid-Market'], isTopTool: true },
  { id: 'figma', name: 'Figma', category: 'Content & Creative', recommendedFor: ['SMB', 'Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'webflow', name: 'Webflow', category: 'Content & Creative', recommendedFor: ['SMB', 'Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'wordpress', name: 'WordPress', category: 'Content & Creative', recommendedFor: ['SMB'], isTopTool: true },
  { id: 'contentful', name: 'Contentful', category: 'Content & Creative', recommendedFor: ['Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'descript', name: 'Descript', category: 'Content & Creative', recommendedFor: ['SMB', 'Mid-Market'], isTopTool: true },
  { id: 'loom', name: 'Loom', category: 'Content & Creative', recommendedFor: ['SMB', 'Mid-Market'], isTopTool: true },
  { id: 'brandfolder', name: 'Brandfolder / Bynder', category: 'Content & Creative', recommendedFor: ['Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'midjourney', name: 'Midjourney / Runway', category: 'Content & Creative', recommendedFor: ['Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'notion', name: 'Notion', category: 'Content & Creative', recommendedFor: ['SMB'], isTopTool: false },
  { id: 'adobe-experience', name: 'Adobe Experience Manager', category: 'Content & Creative', recommendedFor: ['Enterprise'], isTopTool: false },
  { id: 'sitecore', name: 'Sitecore', category: 'Content & Creative', recommendedFor: ['Enterprise'], isTopTool: false },

  // Acquisition & Marketing Automation
  { id: 'google-ads', name: 'Google Ads', category: 'Acquisition & Marketing Automation', recommendedFor: ['SMB', 'Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'meta-ads', name: 'Meta Ads', category: 'Acquisition & Marketing Automation', recommendedFor: ['SMB', 'Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'linkedin-ads', name: 'LinkedIn Ads', category: 'Acquisition & Marketing Automation', recommendedFor: ['Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'tiktok-ads', name: 'TikTok Ads', category: 'Acquisition & Marketing Automation', recommendedFor: ['SMB', 'Mid-Market'], isTopTool: true },
  { id: 'hubspot', name: 'HubSpot Marketing Hub', category: 'Acquisition & Marketing Automation', recommendedFor: ['SMB', 'Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'salesforce-mc', name: 'Salesforce Marketing Cloud', category: 'Acquisition & Marketing Automation', recommendedFor: ['Enterprise'], isTopTool: true },
  { id: 'marketo', name: 'Marketo', category: 'Acquisition & Marketing Automation', recommendedFor: ['Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'klaviyo', name: 'Klaviyo', category: 'Acquisition & Marketing Automation', recommendedFor: ['Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'customerio', name: 'Customer.io', category: 'Acquisition & Marketing Automation', recommendedFor: ['Mid-Market'], isTopTool: true },
  { id: 'braze', name: 'Braze', category: 'Acquisition & Marketing Automation', recommendedFor: ['Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'sprout-social', name: 'Sprout Social', category: 'Acquisition & Marketing Automation', recommendedFor: ['Mid-Market'], isTopTool: true },
  { id: 'buffer', name: 'Buffer / Later', category: 'Acquisition & Marketing Automation', recommendedFor: ['SMB', 'Mid-Market'], isTopTool: true },
  { id: 'skai', name: 'Skai / Smartly', category: 'Acquisition & Marketing Automation', recommendedFor: ['Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'mailchimp', name: 'Mailchimp / Brevo', category: 'Acquisition & Marketing Automation', recommendedFor: ['SMB'], isTopTool: false },
  { id: 'iterable', name: 'Iterable', category: 'Acquisition & Marketing Automation', recommendedFor: ['Enterprise'], isTopTool: false },
  { id: 'airship', name: 'Airship', category: 'Acquisition & Marketing Automation', recommendedFor: ['Enterprise'], isTopTool: false },

  // CRO & Experience
  { id: 'optimizely', name: 'Optimizely', category: 'CRO & Experience', recommendedFor: ['Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'vwo', name: 'VWO', category: 'CRO & Experience', recommendedFor: ['Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'unbounce', name: 'Unbounce', category: 'CRO & Experience', recommendedFor: ['SMB', 'Mid-Market'], isTopTool: true },
  { id: 'instapage', name: 'Instapage', category: 'CRO & Experience', recommendedFor: ['Mid-Market'], isTopTool: true },
  { id: 'mutiny', name: 'Mutiny', category: 'CRO & Experience', recommendedFor: ['Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'dynamic-yield', name: 'Dynamic Yield', category: 'CRO & Experience', recommendedFor: ['Enterprise'], isTopTool: true },
  { id: 'intercom', name: 'Intercom', category: 'CRO & Experience', recommendedFor: ['Mid-Market'], isTopTool: true },
  { id: 'drift', name: 'Drift', category: 'CRO & Experience', recommendedFor: ['Mid-Market'], isTopTool: true },
  { id: 'leadpages', name: 'Leadpages', category: 'CRO & Experience', recommendedFor: ['SMB'], isTopTool: false },
  { id: 'tidio', name: 'Tidio / Crisp', category: 'CRO & Experience', recommendedFor: ['SMB'], isTopTool: false },
  { id: 'optimonk', name: 'Optimonk / Justuno', category: 'CRO & Experience', recommendedFor: ['SMB'], isTopTool: false },
  { id: 'adobe-target', name: 'Adobe Target', category: 'CRO & Experience', recommendedFor: ['Enterprise'], isTopTool: false },
  { id: 'pendo', name: 'Pendo', category: 'CRO & Experience', recommendedFor: ['Enterprise'], isTopTool: false },

  // Retention & Customer Success
  { id: 'zendesk', name: 'Zendesk', category: 'Retention & Customer Success', recommendedFor: ['SMB', 'Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'gorgias', name: 'Gorgias', category: 'Retention & Customer Success', recommendedFor: ['Mid-Market'], isTopTool: true },
  { id: 'helpscout', name: 'HelpScout', category: 'Retention & Customer Success', recommendedFor: ['SMB'], isTopTool: true },
  { id: 'qualtrics', name: 'Qualtrics', category: 'Retention & Customer Success', recommendedFor: ['Mid-Market', 'Enterprise'], isTopTool: true },
  { id: 'surveymonkey', name: 'SurveyMonkey', category: 'Retention & Customer Success', recommendedFor: ['SMB', 'Mid-Market'], isTopTool: true },
  { id: 'delighted', name: 'Delighted', category: 'Retention & Customer Success', recommendedFor: ['SMB', 'Mid-Market'], isTopTool: true },
  { id: 'yotpo', name: 'Yotpo', category: 'Retention & Customer Success', recommendedFor: ['SMB', 'Mid-Market'], isTopTool: true },
  { id: 'referralcandy', name: 'ReferralCandy', category: 'Retention & Customer Success', recommendedFor: ['Mid-Market'], isTopTool: true },
  { id: 'influitive', name: 'Influitive', category: 'Retention & Customer Success', recommendedFor: ['Enterprise'], isTopTool: true },
  { id: 'circle', name: 'Circle / Discord', category: 'Retention & Customer Success', recommendedFor: ['SMB', 'Mid-Market'], isTopTool: true },
  { id: 'freshdesk', name: 'Freshdesk', category: 'Retention & Customer Success', recommendedFor: ['SMB', 'Mid-Market'], isTopTool: false },
  { id: 'saasquatch', name: 'SaaSquatch', category: 'Retention & Customer Success', recommendedFor: ['Mid-Market'], isTopTool: false },
  { id: 'medallia', name: 'Medallia', category: 'Retention & Customer Success', recommendedFor: ['Enterprise'], isTopTool: false },
  { id: 'gainsight', name: 'Gainsight', category: 'Retention & Customer Success', recommendedFor: ['Enterprise'], isTopTool: false },
  { id: 'khoros', name: 'Khoros', category: 'Retention & Customer Success', recommendedFor: ['Enterprise'], isTopTool: false },
];

// Helper function to get tools by category
export function getToolsByCategory(category: string): TechTool[] {
  return MARKETING_TECH_TOOLS.filter(tool => tool.category === category);
}

// Helper function to get tools by company size
export function getToolsByCompanySize(size: 'SMB' | 'Mid-Market' | 'Enterprise'): TechTool[] {
  return MARKETING_TECH_TOOLS.filter(tool => tool.recommendedFor.includes(size));
}

// Helper function to get top tools
export function getTopTools(): TechTool[] {
  return MARKETING_TECH_TOOLS.filter(tool => tool.isTopTool);
}

// Pre-built tech stack presets
export const TECH_STACK_PRESETS = {
  'Enterprise Stack': [
    'salesforce-mc', 'marketo', 'adobe-cdp', 'snowflake', 'looker-tableau',
    'adobe-experience', 'figma', 'sixsense', 'optimizely', 'qualtrics',
    'gainsight', 'pendo'
  ],
  'Mid-Market Stack': [
    'hubspot', 'marketo', 'segment', 'mixpanel', 'contentful',
    'figma', 'google-ads', 'linkedin-ads', 'drift', 'zendesk',
    'delighted'
  ],
  'SMB Growth Stack': [
    'hubspot', 'google-analytics', 'canva', 'wordpress', 'mailchimp',
    'google-ads', 'meta-ads', 'buffer', 'unbounce', 'zendesk',
    'surveymonkey'
  ],
  'ABM-Focused Stack': [
    'sixsense', 'marketo', 'salesforce-mc', 'zoominfo', 'drift',
    'mutiny', 'linkedin-ads', 'gainsight'
  ],
  'Product-Led Growth Stack': [
    'segment', 'amplitude', 'mixpanel', 'intercom', 'pendo',
    'customerio', 'optimizely', 'delighted'
  ]
};
