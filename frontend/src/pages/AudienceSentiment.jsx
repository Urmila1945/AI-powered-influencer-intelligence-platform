import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Search, Activity, MessageSquare } from 'lucide-react';
import api from '../services/api';

const AudienceSentiment = () => {
  const [username, setUsername] = useState('mrbeast');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!username) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/analytics/audience-sentiment', {
        influencer_username: username.replace('@', '')
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze audience');
    } finally {
      setLoading(false);
    }
  };

  const getBotRiskColor = (score) => {
    if (score < 30) return 'text-success drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]';
    if (score < 60) return 'text-warning drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]';
    return 'text-danger drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]';
  };

  const getBotRiskBg = (score) => {
    if (score < 30) return 'bg-success/20 border-success/30';
    if (score < 60) return 'bg-warning/20 border-warning/30';
    return 'bg-danger/20 border-danger/30';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Audience <span className="text-gradient">Sentiment & Bot Detection</span></h1>
        <p className="text-gray-400 mt-2">Deep NLP analysis of follower comments to detect fake engagement and emotional sentiment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="glass-panel p-6 space-y-6 lg:col-span-1">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Creator Username</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none transition-colors"
                placeholder="e.g. mrbeast"
              />
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary to-secondary rounded-xl font-bold hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Activity className="animate-spin" size={18} /> : <ShieldAlert size={18} />}
            {loading ? 'Running AI Scan...' : 'Analyze Audience'}
          </button>
          
          {error && <p className="text-danger text-sm mt-2">{error}</p>}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <div className="space-y-6 animate-fade-in-up">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sentiment Chart */}
                <div className="glass-panel p-6 space-y-4">
                  <h3 className="font-semibold text-lg text-white mb-4">Emotional Sentiment</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-success">Positive</span>
                        <span>{result.analysis.positive}%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-3">
                        <div className="bg-success h-3 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${result.analysis.positive}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Neutral</span>
                        <span>{result.analysis.neutral}%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-3">
                        <div className="bg-gray-400 h-3 rounded-full" style={{ width: `${result.analysis.neutral}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-danger">Negative / Toxic</span>
                        <span>{result.analysis.negative}%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-3">
                        <div className="bg-danger h-3 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{ width: `${result.analysis.negative}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bot Risk */}
                <div className={`glass-panel p-6 flex flex-col items-center justify-center text-center space-y-2 border ${getBotRiskBg(result.analysis.bot_risk_score)} relative overflow-hidden transition-colors`}>
                  <h3 className="text-gray-400 text-sm uppercase tracking-wider relative z-10">Bot / Fake Engagement Risk</h3>
                  <div className={`text-6xl font-black ${getBotRiskColor(result.analysis.bot_risk_score)} relative z-10`}>
                    {result.analysis.bot_risk_score}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {result.analysis.bot_risk_score < 40 ? <ShieldCheck className="text-success" size={20} /> : <ShieldAlert className="text-danger" size={20} />}
                    <span className="font-bold tracking-wide relative z-10">{result.analysis.bot_risk_label}</span>
                  </div>
                </div>
              </div>

              {/* Analysis & Topics */}
              <div className="glass-panel p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <MessageSquare size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-white">AI Audience Verdict</h3>
                    <p className="text-gray-300 leading-relaxed text-sm mb-4">
                      {result.analysis.analysis}
                    </p>
                    
                    <h4 className="font-semibold text-sm text-gray-400 mb-2">Common Comment Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.analysis.top_topics.map((topic, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          ) : (
            <div className="h-full min-h-[400px] glass-panel flex flex-col items-center justify-center text-center p-8 border-dashed border-2 border-white/10">
              <ShieldAlert size={48} className="text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-300">Scan Audience Authenticity</h3>
              <p className="text-gray-500 mt-2 max-w-md">
                Enter a creator username to instantly detect fake followers, bot comments, and measure the true emotional sentiment of their audience.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudienceSentiment;
