import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalyticsSummary, clearAnalytics, getAnalyticsEvents } from '../utils/analytics';
import { BarChart3, TrendingUp, Users, MousePointerClick, X, Trash2 } from 'lucide-react';

export const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  
  const summary = useMemo(() => getAnalyticsSummary(), [refreshKey]);
  const events = useMemo(() => getAnalyticsEvents(), [refreshKey]);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
      clearAnalytics();
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-slate-400">Client-side usage tracking (stored locally)</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors min-h-[44px]"
            >
              Refresh
            </button>
            <button
              onClick={handleClear}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg border border-red-500/50 transition-colors min-h-[44px] flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Data
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors min-h-[44px]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-400 text-sm font-semibold">Total Page Views</h3>
              <BarChart3 className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-4xl font-bold text-cyan-400">
              {summary.totalPageviews.toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-400 text-sm font-semibold">Assessments Completed</h3>
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-4xl font-bold text-purple-400">
              {summary.totalAssessments.toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-400 text-sm font-semibold">Conversion Rate</h3>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-4xl font-bold text-green-400">
              {summary.conversionRate}%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Assessments / Home Page Views
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-400 text-sm font-semibold">CTA Clicks</h3>
              <MousePointerClick className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-4xl font-bold text-yellow-400">
              {summary.totalCtaClicks.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Popular Pages */}
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h3 className="text-white font-bold text-lg mb-4">Most Popular Pages</h3>
            <div className="space-y-3">
              {summary.popularPages.length > 0 ? (
                summary.popularPages.map(({ page, count }) => (
                  <div key={page} className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm font-mono">{page}</span>
                    <span className="text-cyan-400 font-bold">{count}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No page views yet</p>
              )}
            </div>
          </div>

          {/* CTA Click Locations */}
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h3 className="text-white font-bold text-lg mb-4">CTA Click Locations</h3>
            <div className="space-y-3">
              {Object.keys(summary.ctaLocations).length > 0 ? (
                Object.entries(summary.ctaLocations)
                  .sort(([, a], [, b]) => b - a)
                  .map(([location, count]) => (
                    <div key={location} className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm capitalize">{location}</span>
                      <span className="text-yellow-400 font-bold">{count}</span>
                    </div>
                  ))
              ) : (
                <p className="text-slate-500 text-sm">No CTA clicks yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Assessment Stats */}
        {summary.totalAssessments > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Average Score */}
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
              <h3 className="text-white font-bold text-lg mb-4">Assessment Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-slate-400 text-sm mb-1">Average Score</div>
                  <div className="text-3xl font-bold text-cyan-400">{summary.avgScore}/100</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-2">Plane Level Distribution</div>
                  <div className="space-y-2">
                    {Object.entries(summary.planeLevelCounts)
                      .sort(([, a], [, b]) => b - a)
                      .map(([level, count]) => (
                        <div key={level} className="flex items-center justify-between">
                          <span className="text-slate-300 text-sm">{level}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-400 rounded-full"
                                style={{
                                  width: `${(count / summary.totalAssessments) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-purple-400 font-bold text-sm w-8 text-right">
                              {count}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Time Range */}
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
              <h3 className="text-white font-bold text-lg mb-4">Tracking Period</h3>
              <div className="space-y-3">
                {summary.firstEvent && (
                  <div>
                    <div className="text-slate-400 text-sm mb-1">First Event</div>
                    <div className="text-slate-300">
                      {summary.firstEvent.toLocaleString()}
                    </div>
                  </div>
                )}
                {summary.lastEvent && (
                  <div>
                    <div className="text-slate-400 text-sm mb-1">Last Event</div>
                    <div className="text-slate-300">
                      {summary.lastEvent.toLocaleString()}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-slate-400 text-sm mb-1">Total Events</div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {summary.totalEvents.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Raw Events (Collapsible) */}
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <details>
            <summary className="text-white font-bold text-lg cursor-pointer mb-4">
              Raw Events ({events.length})
            </summary>
            <div className="mt-4 max-h-96 overflow-y-auto">
              <pre className="text-xs text-slate-400 bg-slate-950 p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(events.slice(-50), null, 2)}
              </pre>
              <p className="text-xs text-slate-500 mt-2">
                Showing last 50 events. Total: {events.length}
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

