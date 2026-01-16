import React, { useState, useMemo, useEffect } from 'react';
import { CITIES } from '../data/staticData';
import { MapPin, ChevronDown, ChevronUp, Search, ExternalLink } from 'lucide-react';

interface ArrivalsBoardProps {
  onCityClick?: (cityId: string) => void;
  autoExpand?: boolean;
}

// Region display names and flags
const REGION_INFO: Record<string, { name: string; flag: string }> = {
  'NA': { name: 'North America', flag: '🇺🇸' },
  'EU': { name: 'Europe', flag: '🇪🇺' },
  'APAC': { name: 'Asia Pacific', flag: '🌏' },
  'MENA': { name: 'Middle East', flag: '🇦🇪' },
};

// Airport codes mapping
const AIRPORT_CODES: Record<string, string> = {
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

export const ArrivalsBoard: React.FC<ArrivalsBoardProps> = ({ 
  onCityClick,
  autoExpand = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(autoExpand);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'function' | 'city' | 'region'>('function');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Auto-expand when prop changes
  useEffect(() => {
    if (autoExpand && !isExpanded) {
      setIsExpanded(true);
    }
  }, [autoExpand, isExpanded]);

  // Filter and sort cities
  const filteredAndSortedCities = useMemo(() => {
    let filtered = CITIES.filter(city => {
      const query = searchQuery.toLowerCase();
      return (
        city.name.toLowerCase().includes(query) ||
        city.function.toLowerCase().includes(query) ||
        REGION_INFO[city.region]?.name.toLowerCase().includes(query)
      );
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: string;
      let bValue: string;

      switch (sortBy) {
        case 'function':
          aValue = a.function;
          bValue = b.function;
          break;
        case 'city':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'region':
          aValue = REGION_INFO[a.region]?.name || '';
          bValue = REGION_INFO[b.region]?.name || '';
          break;
        default:
          return 0;
      }

      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchQuery, sortBy, sortOrder]);

  const handleCityClick = (cityId: string) => {
    if (onCityClick) {
      onCityClick(cityId);
    }
    // Scroll to map section
    const mapSection = document.getElementById('recommended-packages');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSort = (column: 'function' | 'city' | 'region') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className={`bg-slate-800 border rounded-xl overflow-hidden transition-all ${
      !isExpanded ? 'border-l-4 border-l-cyan-500/50 hover:border-l-cyan-500 border-slate-700' : 'border-slate-700'
    }`}>
      {/* Header - Collapsible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between p-6 transition-all ${
          !isExpanded
            ? 'hover:bg-slate-800/70 cursor-pointer'
            : 'hover:bg-slate-800/50'
        }`}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className={`p-2 rounded-lg transition-colors ${
            !isExpanded ? 'bg-cyan-500/20' : 'bg-slate-700'
          }`}>
            <MapPin className="text-cyan-400" size={20} />
          </div>
          <div className="text-left flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                📋 Arrivals & Departures Board
              </h2>
              {!isExpanded && (
                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs font-semibold rounded">
                  Click to expand
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              View all marketing functions and their city destinations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isExpanded && (
            <span className="hidden md:block text-sm text-cyan-400">Expand</span>
          )}
          {isExpanded ? (
            <ChevronUp className="text-cyan-400" size={24} />
          ) : (
            <ChevronDown className="text-cyan-400 animate-bounce" size={24} />
          )}
        </div>
      </button>

      {/* Content - Expanded */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-4 animate-fade-in-up">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search functions or cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th
                    onClick={() => handleSort('function')}
                    className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-cyan-400 transition-colors"
                  >
                    Marketing Function
                    {sortBy === 'function' && (
                      <span className="ml-2 text-cyan-400">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th
                    onClick={() => handleSort('city')}
                    className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-cyan-400 transition-colors"
                  >
                    Destination City
                    {sortBy === 'city' && (
                      <span className="ml-2 text-cyan-400">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th
                    onClick={() => handleSort('region')}
                    className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-cyan-400 transition-colors"
                  >
                    Region
                    {sortBy === 'region' && (
                      <span className="ml-2 text-cyan-400">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedCities.map((city, index) => {
                  const regionInfo = REGION_INFO[city.region];
                  const airportCode = AIRPORT_CODES[city.id] || '';
                  
                  return (
                    <tr
                      key={city.id}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="py-4 px-4">
                        <span className="text-white font-medium">{city.function}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{regionInfo?.flag}</span>
                          <div>
                            <div className="text-white font-medium">
                              {city.name}
                            </div>
                            <div className="text-xs text-slate-500 font-mono">
                              {airportCode}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-slate-300 text-sm">{regionInfo?.name || city.region}</span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleCityClick(city.id)}
                          className="text-cyan-400 hover:text-cyan-300 text-xs font-medium flex items-center gap-1 transition-colors group"
                        >
                          View on Map
                          <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Showing {filteredAndSortedCities.length} of {CITIES.length} destinations
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

