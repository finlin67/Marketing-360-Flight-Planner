// Placeholder pages - these will be implemented in phase 2

import React from 'react';
import { Link } from 'react-router-dom';
import { Construction } from 'lucide-react';

const PlaceholderPage: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center space-y-4">
      <Construction className="h-16 w-16 text-cyan-400 mx-auto" />
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      <p className="text-slate-400 max-w-md mx-auto">{description}</p>
      <Link 
        to="/" 
        className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors mt-4"
      >
        Return Home
      </Link>
    </div>
  </div>
);

export const JourneyMap: React.FC = () => (
  <PlaceholderPage 
    title="Journey Map" 
    description="Interactive world map visualization coming soon. This will show marketing functions as cities with unlocked routes based on your score."
  />
);

export const Scenarios: React.FC = () => (
  <PlaceholderPage 
    title="Pre-Built Scenarios" 
    description="Browse industry-specific marketing scenarios and strategic templates."
  />
);

export const ScenarioDetail: React.FC = () => (
  <PlaceholderPage 
    title="Scenario Details" 
    description="Detailed scenario breakdown with phases, tasks, and deliverables."
  />
);

export const TechStackAudit: React.FC = () => (
  <PlaceholderPage 
    title="Tech Stack Audit" 
    description="Inventory your marketing tools and assess optimization levels to boost your combined score."
  />
);

export const Simulator: React.FC = () => (
  <PlaceholderPage 
    title="What-If Simulator" 
    description="Adjust variables like budget, team size, and tool utilization to see the projected impact on your score."
  />
);

export const OperationsCenter: React.FC = () => (
  <PlaceholderPage 
    title="Operations Center" 
    description="Your command dashboard for monitoring status, active routes, and recommendations."
  />
);
