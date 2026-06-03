import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import { FaYoutube as Youtube, FaInstagram as Instagram } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const ScoreCard = ({ title, score, max = 100, color }) => {
  const percentage = (score / max) * 100;
  return (
    <div className="glass-panel p-4 rounded-xl border border-white/10">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400 font-medium">{title}</span>
        <span className={`text-sm font-bold ${color}`}>{score}/{max}</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-2 rounded-full ${color.replace('text-', 'bg-')}`}
        ></motion.div>
      </div>
    </div>
  );
};

import api from '../services/api';

const InfluencerAnalysis = () => {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (location.state && location.state.username) {
      setQuery(location.state.username);
      // Automatically trigger handleAnalyze logic by directly calling api since handleAnalyze expects an event
      const fetchProfile = async () => {
        setIsAnalyzing(true);
        setResult(null);
        setErrorMsg('');
        try {
            const platform = (location.state.platform && location.state.platform.toLowerCase() === 'youtube') ? 'youtube' : 'instagram';
            const cleanQuery = location.state.username.trim().replace('@', '');
            const res = await api.get(`/influencer/${platform}/${cleanQuery}`);
            setResult(res.data);
        } catch(e) {
            setErrorMsg(e.response?.data?.error || "Failed to analyze influencer. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
      };
      fetchProfile();
    }
  }, [location.state]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!query) return;
    setIsAnalyzing(true);
    setResult(null);
    setErrorMsg('');
    
    try {
      // Determine if it's youtube or instagram based on query (simple heuristic)
      const platform = (query.includes('youtube') || query.startsWith('UC')) ? 'youtube' : 'instagram';
      
      const cleanQuery = query.trim()
                              .replace(/^https?:\/\/(www\.)?youtube\.com\/(c\/|channel\/|@)?/i, '')
                              .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
                              .replace('@', '')
                              .split('/')[0]
                              .split('?')[0];

      const response = await api.get(`/influencer/${platform}/${cleanQuery}`);
      setResult(response.data);
    } catch (error) {
      setErrorMsg(error.response?.data?.error || 'Failed to analyze influencer');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Influencer Analysis</h1>
        <p className="text-gray-400">Deep-dive AI analysis into any creator's profile.</p>
      </div>

      <div className="glass-card">
        <form onSubmit={handleAnalyze} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Enter Instagram Username or YouTube Channel URL..."
              className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 text-white placeholder-gray-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary w-32 flex justify-center items-center"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Analyze'
            )}
          </button>
        </form>
        {errorMsg && (
          <div className="mt-4 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertTriangle size={20} />
            <span className="text-sm">{errorMsg}</span>
          </div>
        )}
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Profile Card */}
          <div className="glass-card md:col-span-1 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-secondary p-1 mb-4">
              <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold">{result.name.charAt(0)}</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold">{result.name}</h2>
            <p className="text-gray-400 mb-2">{result.username}</p>
            
            <div className="flex gap-2 mb-6">
              <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium border border-white/10 flex items-center gap-1">
                <Youtube size={14} className="text-danger" /> {result.platform}
              </span>
              <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium border border-white/10">
                {result.category}
              </span>
            </div>

            <div className="w-full grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Followers</p>
                <p className="font-bold text-md">{result.followers}</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Following</p>
                <p className="font-bold text-md">{result.following}</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Eng. Rate</p>
                <p className="font-bold text-md text-success">{result.engagementRate}</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Total Posts</p>
                <p className="font-bold text-md">{result.posts}</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Total Views</p>
                <p className="font-bold text-md">{result.views}</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Post Frequency</p>
                <p className="font-bold text-md text-primary">{result.postingFrequency || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Est. Likes</p>
                <p className="font-bold text-md">{result.likes}</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Est. Comments</p>
                <p className="font-bold text-md">{result.comments}</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Est. Shares</p>
                <p className="font-bold text-md">{result.shares}</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Est. Saves</p>
                <p className="font-bold text-md">{result.saves}</p>
              </div>
            </div>
          </div>

          {/* AI Scores & Metrics */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass-card flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                  ViralMind Score™
                  <CheckCircle size={18} className="text-success" />
                </h3>
                <p className="text-gray-400 text-sm">Overall AI confidence score based on 50+ metrics.</p>
              </div>
              
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                  <motion.circle 
                    initial={{ strokeDasharray: "0, 1000" }}
                    animate={{ strokeDasharray: `${(result.scores.viralmind_score / 100) * 251.2}, 1000` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                    strokeLinecap="round"
                    className="text-primary"
                  />
                </svg>
                <span className="absolute text-2xl font-bold">{result.scores.viralmind_score}</span>
              </div>
            </div>

            {/* ML Features Processed */}
            <div className="glass-card p-4">
              <h4 className="font-semibold text-sm mb-3 text-gray-300">ML Features Evaluated</h4>
              <div className="flex flex-wrap gap-2">
                {['Engagement Rate', 'Share Rate', 'Save Rate', 'Audience Quality', 'Posting Consistency', 'Growth Rate', 'Comment Quality', 'Content Category', 'Audience Demographics'].map(feature => (
                  <span key={feature} className="px-2 py-1 bg-primary/20 text-primary border border-primary/30 rounded-md text-[10px] font-medium tracking-wide">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ScoreCard title="Authenticity Score" score={result.scores.authenticity} color="text-success" />
              <ScoreCard title="Audience Quality Index™" score={result.scores.aqi} color="text-secondary" />
              <ScoreCard title="Growth Prediction" score={result.scores.growth} color="text-primary" />
              <ScoreCard title="Campaign Success Prob." score={result.scores.campaignSuccess} color="text-accent" />
              <ScoreCard title="Brand Match Score" score={result.scores.brandMatchScore} color="text-warning" />
            </div>

            <div className="glass-card border-l-4 border-l-success p-4">
              <div className="flex items-start gap-4 mb-4">
                <ShieldAlert className="text-success shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold text-success mb-1">Creator Risk Meter™: {result.riskLevel}</h4>
                  <p className="text-sm text-gray-400">
                    {result.riskLevel === 'Low' 
                      ? 'Analysis shows no significant signs of bot activity, purchased followers, or engagement pods. Audience growth is organic and consistent.'
                      : result.riskLevel === 'Medium'
                      ? 'Analysis detects some minor inconsistencies in engagement or follower growth patterns. Proceed with standard due diligence.'
                      : 'High risk of fake followers, engagement pods, or bot activity. Not recommended for brand partnerships without deep manual auditing.'
                    }
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pl-10">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle size={14} className={result.riskLevel === 'High' ? "text-danger" : "text-success"} />
                  <span className="text-gray-300">Purchased Followers Check</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle size={14} className={result.riskLevel === 'High' ? "text-danger" : "text-success"} />
                  <span className="text-gray-300">Engagement Pods Check</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle size={14} className={result.riskLevel === 'High' ? "text-danger" : "text-success"} />
                  <span className="text-gray-300">Bot Activity Scan</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle size={14} className={result.riskLevel === 'High' ? "text-danger" : "text-success"} />
                  <span className="text-gray-300">Artificial Engagement Spikes</span>
                </div>
              </div>
            </div>

            {/* Audience Demographics */}
            {result.demographics && (
              <div className="glass-card p-4">
                <h4 className="font-bold mb-3 flex items-center gap-2">Audience Demographics</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Gender Breakdown</span>
                      <span>{result.demographics.Male}% Male / {result.demographics.Female}% Female</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 flex overflow-hidden">
                      <div style={{ width: `${result.demographics.Male}%` }} className="bg-blue-500 h-full"></div>
                      <div style={{ width: `${result.demographics.Female}%` }} className="bg-pink-500 h-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Age: 18-24</span>
                      <span>{result.demographics['18-24']}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div style={{ width: `${result.demographics['18-24']}%` }} className="bg-purple-500 h-full rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Age: 25-34</span>
                      <span>{result.demographics['25-34']}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div style={{ width: `${result.demographics['25-34']}%` }} className="bg-indigo-500 h-full rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Age: 35+</span>
                      <span>{result.demographics['35+']}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div style={{ width: `${result.demographics['35+']}%` }} className="bg-teal-500 h-full rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Brand Recommendations */}
            {result.brandMatches && (
              <div className="glass-card p-4">
                <h4 className="font-bold mb-3">AI Brand Recommendations</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {result.brandMatches.map((brand, idx) => (
                    <div key={idx} className="bg-black/20 p-3 rounded-lg border border-white/5 flex flex-col items-center text-center">
                      <span className="font-bold text-primary">{brand.brand}</span>
                      <span className="text-xs text-gray-400 mt-1">Match: {brand.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InfluencerAnalysis;
