import React, { useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, PLANE_LEVELS } from '../context/UserContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  FileText, 
  TrendingUp, 
  Plane, 
  MapPin, 
  Calendar, 
  Download, 
  Trash2,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Gauge
} from 'lucide-react';

export const FlightLog: React.FC = () => {
  const navigate = useNavigate();
  const { 
    getAssessmentHistory, 
    clearHistory,
    combinedScore,
    planeLevel,
    flightMiles
  } = useUser();
  
  const [scenarioStatuses] = useLocalStorage<Record<string, { status?: 'in_progress' | 'completed'; viewedAt?: number }>>('scenarioStatuses', {});
  const [isExporting, setIsExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const history = getAssessmentHistory();
  const completedScenarios = Object.values(scenarioStatuses).filter(s => s.status === 'completed').length;
  const inProgressScenarios = Object.values(scenarioStatuses).filter(s => s.status === 'in_progress').length;

  // Format data for charts
  const scoreData = useMemo(() => {
    if (history.length === 0) {
      // Include current state if no history
      return [{
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
        score: combinedScore,
        planeLevel,
        miles: flightMiles,
        readiness: 0,
        efficiency: 0,
        alignment: 0,
      }];
    }
    
    return history.map(entry => ({
      date: new Date(entry.timestamp).toLocaleDateString(),
      timestamp: entry.timestamp,
      score: entry.combinedScore,
      planeLevel: entry.planeLevel,
      miles: entry.flightMiles,
      readiness: entry.readinessScore,
      efficiency: entry.efficiencyScore,
      alignment: entry.alignmentScore,
    })).sort((a, b) => a.timestamp - b.timestamp);
  }, [history, combinedScore, planeLevel, flightMiles]);

  // Plane level progression data
  const planeLevelData = useMemo(() => {
    const levelCounts: Record<string, number> = {};
    PLANE_LEVELS.forEach(level => levelCounts[level.name] = 0);
    
    history.forEach(entry => {
      levelCounts[entry.planeLevel] = (levelCounts[entry.planeLevel] || 0) + 1;
    });
    
    return PLANE_LEVELS.map(level => ({
      name: level.name,
      count: levelCounts[level.name],
      color: level.color,
      icon: level.icon,
    }));
  }, [history]);

  // Routes unlocked timeline
  const routesTimeline = useMemo(() => {
    const routeMap = new Map<string, number>();
    
    history.forEach(entry => {
      entry.unlockedRoutes.forEach(routeId => {
        if (!routeMap.has(routeId)) {
          routeMap.set(routeId, entry.timestamp);
        }
      });
    });
    
    return Array.from(routeMap.entries())
      .map(([routeId, timestamp]) => ({
        routeId,
        date: new Date(timestamp).toLocaleDateString(),
        timestamp,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [history]);

  // Calculate improvements
  const improvements = useMemo(() => {
    if (history.length < 2) return null;
    
    const first = history[0];
    const last = history[history.length - 1];
    
    return {
      scoreChange: last.combinedScore - first.combinedScore,
      scorePercentChange: ((last.combinedScore - first.combinedScore) / first.combinedScore) * 100,
      routesUnlocked: last.unlockedRoutes.length - first.unlockedRoutes.length,
      milesGained: last.flightMiles - first.flightMiles,
      daysBetween: Math.floor((last.timestamp - first.timestamp) / (1000 * 60 * 60 * 24)),
    };
  }, [history]);

  // PDF Export function
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Dynamic import of html2canvas and jspdf
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      
      if (!contentRef.current) return;
      
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        backgroundColor: '#020617',
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      const fileName = `Flight-Log-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all assessment history? This cannot be undone.')) {
      clearHistory();
    }
  };

  const hasHistory = history.length > 0;

  return (
    <div className="space-y-8 pb-12" ref={contentRef}>
      {/* Header */}
      <div className="text-center pt-4 pb-6">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 bg-cyan-500/10 rounded-xl">
            <FileText className="text-cyan-400 h-12 w-12" />
          </div>
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-white mb-3">
          Flight Log
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Track your marketing maturity journey over time
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            disabled={isExporting || !hasHistory}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
          {hasHistory && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 font-semibold rounded-lg transition-all"
            >
              <Trash2 size={18} />
              Clear History
            </button>
          )}
        </div>
        <button
          onClick={() => navigate('/assessment')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all"
        >
          Retake Assessment
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Empty State */}
      {!hasHistory && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <FileText className="text-slate-600 mx-auto mb-4" size={64} />
          <h3 className="text-2xl font-bold text-white mb-2">No Flight History Yet</h3>
          <p className="text-slate-400 mb-6">
            Complete your first assessment to start tracking your progress over time.
          </p>
          <button
            onClick={() => navigate('/assessment')}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-all"
          >
            Take Assessment
          </button>
        </div>
      )}

      {/* Summary Stats */}
      {hasHistory && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="text-sm text-slate-400 uppercase mb-2">Total Assessments</div>
              <div className="text-3xl font-bold text-white">{history.length}</div>
              <div className="text-xs text-slate-500 mt-1">
                {history.filter(h => h.assessmentType === 'deep').length} Deep Dive
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="text-sm text-slate-400 uppercase mb-2">Current Score</div>
              <div className="text-3xl font-bold text-cyan-400">{combinedScore}</div>
              <div className="text-xs text-slate-500 mt-1">/ 100</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="text-sm text-slate-400 uppercase mb-2">Scenarios Completed</div>
              <div className="text-3xl font-bold text-emerald-400">{completedScenarios}</div>
              <div className="text-xs text-slate-500 mt-1">{inProgressScenarios} in progress</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="text-sm text-slate-400 uppercase mb-2">Flight Miles</div>
              <div className="text-3xl font-bold text-yellow-400">{flightMiles.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">Total earned</div>
            </div>
          </div>

          {/* Improvements Summary */}
          {improvements && (
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-cyan-400" size={24} />
                <h2 className="text-2xl font-bold text-white">Progress Summary</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <div className="text-sm text-slate-400">Score Change</div>
                  <div className={`text-2xl font-bold ${improvements.scoreChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {improvements.scoreChange >= 0 ? '+' : ''}{improvements.scoreChange}
                  </div>
                  <div className="text-xs text-slate-500">
                    {improvements.scorePercentChange >= 0 ? '+' : ''}{improvements.scorePercentChange.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Routes Unlocked</div>
                  <div className="text-2xl font-bold text-cyan-400">
                    +{improvements.routesUnlocked}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Miles Gained</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    +{improvements.milesGained.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Time Period</div>
                  <div className="text-2xl font-bold text-white">
                    {improvements.daysBetween}
                  </div>
                  <div className="text-xs text-slate-500">days</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Current Level</div>
                  <div className="text-2xl font-bold" style={{ color: PLANE_LEVELS.find(l => l.name === planeLevel)?.color }}>
                    {planeLevel}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Score Progression Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-cyan-400" size={24} />
                <h2 className="text-2xl font-bold text-white">Score Progression</h2>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={scoreData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#06b6d4" 
                  fillOpacity={1} 
                  fill="url(#colorScore)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* REAO Scores Chart */}
          {scoreData.length > 0 && scoreData[0].readiness !== undefined && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Gauge className="text-cyan-400" size={24} />
                <h2 className="text-2xl font-bold text-white">REAO Metrics Over Time</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8' }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8' }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="readiness" stroke="#10b981" strokeWidth={2} name="Readiness" />
                  <Line type="monotone" dataKey="efficiency" stroke="#06b6d4" strokeWidth={2} name="Efficiency" />
                  <Line type="monotone" dataKey="alignment" stroke="#f59e0b" strokeWidth={2} name="Alignment" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Plane Level Distribution */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Plane className="text-cyan-400" size={24} />
              <h2 className="text-2xl font-bold text-white">Plane Level Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={planeLevelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {planeLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Routes Unlocked Timeline */}
          {routesTimeline.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-cyan-400" size={24} />
                <h2 className="text-2xl font-bold text-white">Routes Unlocked Timeline</h2>
              </div>
              <div className="space-y-3">
                  {routesTimeline.map((route, index) => (
                  <div 
                    key={route.routeId} 
                    className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg border border-slate-700"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold">{route.routeId}</div>
                      <div className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                        <Calendar size={14} />
                        {route.date}
                      </div>
                    </div>
                    <CheckCircle2 className="text-emerald-400" size={20} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assessment History Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-cyan-400" size={24} />
              <h2 className="text-2xl font-bold text-white">Assessment History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Score</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Plane Level</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Routes</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Miles</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice().reverse().map((entry, index) => {
                    const levelInfo = PLANE_LEVELS.find(l => l.name === entry.planeLevel);
                    return (
                      <tr key={entry.timestamp} className="border-b border-slate-800 hover:bg-slate-800/50">
                        <td className="py-3 px-4 text-sm text-slate-300">
                          {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            entry.assessmentType === 'deep' 
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {entry.assessmentType === 'deep' ? 'Deep Dive' : 'Quick Scan'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-lg font-bold text-cyan-400">{entry.combinedScore}</span>
                          <span className="text-sm text-slate-500">/100</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span>{levelInfo?.icon}</span>
                            <span className="text-sm font-semibold" style={{ color: levelInfo?.color }}>
                              {entry.planeLevel}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-300">
                          {entry.unlockedRoutes.length} unlocked
                        </td>
                        <td className="py-3 px-4 text-sm font-mono text-yellow-400">
                          {entry.flightMiles.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

