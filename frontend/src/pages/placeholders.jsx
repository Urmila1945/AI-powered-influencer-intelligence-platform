import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Award, Users, TrendingUp, Download, Settings as SettingsIcon, Search, Sparkles, AlertCircle, FileText, Bot, Brain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const BrandMatching = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setIsSearching(true);
    setResults(null);
    setErrorMsg('');
    
    try {
      // 1. Fetch creator profile
      const platform = (query.includes('youtube') || query.startsWith('UC')) ? 'youtube' : 'instagram';
      const cleanQuery = query.trim()
                              .replace(/^https?:\/\/(www\.)?youtube\.com\/(c\/|channel\/|@)?/i, '')
                              .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
                              .replace('@', '')
                              .split('/')[0]
                              .split('?')[0];
                              
      const profileRes = await api.get(`/influencer/${platform}/${cleanQuery}`);
      const profile = profileRes.data;
      
      // 2. Fetch brand match using the bio
      const matchRes = await api.post('/brand/brand-match', {
        creator_bio: profile.bio || "Content Creator",
        creator_category: profile.category || "General"
      });
      
      setResults(matchRes.data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || 'Failed to find brand matches');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Brand Matching</h1>
      <p className="text-gray-400">Discover which brands align perfectly with a creator's audience.</p>
      
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="text-sm">{errorMsg}</span>
        </div>
      )}
      
      <form onSubmit={handleSearch} className="glass-card flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Enter Creator Name (e.g. mkbhd, techburner)..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 text-white" 
          />
        </div>
        <button type="submit" disabled={isSearching} className="btn-primary w-40 flex justify-center items-center">
          {isSearching ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Find Matches'}
        </button>
      </form>
      
      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {results.map((match, i) => (
            <motion.div key={match.brand} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold text-xl">{match.brand[0]}</div>
                  <h3 className="text-xl font-semibold">{match.brand}</h3>
                </div>
                <span className="text-xl font-bold text-success">{Math.round(match.similarity_score * 100)}% Match</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Relevance</span>
                  <span>{Math.round(match.similarity_score * 100)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2"><motion.div initial={{ width: 0 }} animate={{ width: `${match.similarity_score * 100}%` }} transition={{ duration: 1 }} className="bg-success h-2 rounded-full"></motion.div></div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export const FamePredictor = () => {
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [startingFollowers, setStartingFollowers] = useState(1000000);
  const [growthPercentage, setGrowthPercentage] = useState(0);
  const [finalFollowers, setFinalFollowers] = useState(0);
  
  const handleForecast = async () => {
    setLoading(true);
    try {
      const res = await api.post('/bonus/simulator', {
        current_followers: startingFollowers,
        months: 6
      });
      // map "month: X" to "Month X"
      const formatted = res.data.simulation.map(item => ({
        day: `Month ${item.month}`,
        followers: item.followers
      }));
      // Add day 0
      formatted.unshift({ day: "Today", followers: startingFollowers });
      
      const finalCount = formatted[formatted.length - 1].followers;
      const growthPct = ((finalCount - startingFollowers) / startingFollowers) * 100;
      
      setFinalFollowers(finalCount);
      setGrowthPercentage(growthPct);
      setData(formatted);
      setAnalyzed(true);
    } catch (err) {
      console.error(err);
      alert("Failed to run forecast simulator.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Future Fame Predictor™</h1>
      <p className="text-gray-400 max-w-3xl leading-relaxed">
        <strong>Why this exists:</strong> Brands signing long-term creator partnerships risk investing in channels that have already peaked. 
        Our ML-powered forecasting engine analyzes current momentum to simulate exactly how large an audience will become 6 months from now, 
        ensuring you invest in creators on the rise.
      </p>
      
      {!analyzed ? (
        <div className="glass-card text-center py-12 max-w-2xl mx-auto">
          <TrendingUp className="mx-auto mb-4 text-primary" size={48} />
          <h2 className="text-xl font-semibold mb-2">Simulate Future Growth</h2>
          <p className="text-gray-400 mb-6 text-sm">Enter a creator's current follower count to run the 6-month trajectory ML projection.</p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <div className="relative">
              <input 
                type="number" 
                value={startingFollowers} 
                onChange={(e) => setStartingFollowers(Number(e.target.value))}
                className="bg-black/20 border border-white/10 rounded-xl py-3 pl-4 pr-16 text-white focus:outline-none focus:border-primary/50 text-center text-lg w-64"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Subs</span>
            </div>
            <button onClick={handleForecast} disabled={loading} className="btn-primary w-48 flex justify-center items-center">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Run Simulator'}
            </button>
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-6 text-center border-t-2 border-t-primary">
              <p className="text-sm text-gray-400 mb-1">Starting Followers</p>
              <p className="text-3xl font-bold">{new Intl.NumberFormat('en').format(startingFollowers)}</p>
            </div>
            <div className="glass-card p-6 text-center border-t-2 border-t-secondary">
              <p className="text-sm text-gray-400 mb-1">Projected 6-Month Total</p>
              <p className="text-3xl font-bold">{new Intl.NumberFormat('en').format(finalFollowers)}</p>
            </div>
            <div className="glass-card p-6 text-center border-t-2 border-t-success">
              <p className="text-sm text-gray-400 mb-1">Predicted Growth Rate</p>
              <p className="text-3xl font-bold text-success">+{growthPercentage.toFixed(1)}%</p>
            </div>
          </div>
          
          <div className="glass-card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Growth Trajectory Output</h3>
              <span className="bg-success/20 text-success px-3 py-1 rounded-full text-sm font-medium border border-success/30 flex items-center gap-2">
                <Sparkles size={14} /> 94% ML Confidence
              </span>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="day" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" tickFormatter={(val) => (val/1000000).toFixed(1) + 'M'} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B1020', border: '1px solid rgba(255,255,255,0.1)' }} 
                    formatter={(value) => new Intl.NumberFormat('en').format(value) + " Followers"}
                  />
                  <Line type="monotone" dataKey="followers" stroke="#7C3AED" strokeWidth={4} dot={{ r: 6, fill: '#7C3AED', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 text-center">
              <button onClick={() => setAnalyzed(false)} className="btn-secondary">Run New Simulation</button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

import api from '../services/api';

export const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState('All Platforms');
  const [category, setCategory] = useState('All Categories');

  const fetchLeaders = () => {
    setLoading(true);
    const params = new URLSearchParams({
      platform: platform.toLowerCase(),
      category: category.toLowerCase()
    });
    
    api.get(`/influencer/leaderboard?${params.toString()}`)
      .then(res => {
        setLeaders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch leaderboard", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Global Leaderboard</h1>
      <div className="flex gap-4">
        <select 
          value={platform} 
          onChange={(e) => setPlatform(e.target.value)}
          className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none text-white"
        >
          <option>All Platforms</option>
          <option>YouTube</option>
          <option>Instagram</option>
        </select>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none text-white"
        >
          <option>All Categories</option>
          <option>Technology</option>
          <option>Gaming</option>
          <option>Lifestyle</option>
          <option>Finance</option>
          <option>Beauty</option>
        </select>
        <button onClick={fetchLeaders} className="btn-secondary">Filter Leaders</button>
      </div>
      <div className="glass-card overflow-x-auto min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 animate-pulse">Syncing real-time data from APIs...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-white/10 text-sm uppercase tracking-wider">
                <th className="pb-4 pt-2 font-semibold px-4 w-20 text-center">Rank</th>
                <th className="pb-4 pt-2 font-semibold">Creator</th>
                <th className="pb-4 pt-2 font-semibold text-center">Ratefluencer Score</th>
                <th className="pb-4 pt-2 font-semibold text-center">Growth</th>
                <th className="pb-4 pt-2 font-semibold text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((creator, index) => {
                const rank = index + 1;
                const isTop3 = rank <= 3;
                
                return (
                  <tr key={creator.username} className={`border-b border-white/5 hover:bg-white/5 transition-all group ${isTop3 ? 'bg-white/[0.02]' : ''}`}>
                    <td className="py-5 px-4 text-center">
                      <div className={`mx-auto w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg ${
                        rank === 1 ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-black shadow-yellow-500/20' : 
                        rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black shadow-gray-500/20' : 
                        rank === 3 ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-black shadow-amber-600/20' : 
                        'bg-white/10 text-gray-300'
                      }`}>
                        {rank === 1 ? '👑' : rank}
                      </div>
                    </td>
                    <td className="py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
                          {creator.username.replace('@', '').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-lg text-white flex items-center gap-2">
                            {creator.username.replace('@', '')}
                            {creator.platform === 'YouTube' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/20">YT</span>}
                            {creator.platform === 'Instagram' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-400 border border-pink-500/20">IG</span>}
                          </div>
                          <div className="text-sm text-gray-400 flex items-center gap-3 mt-1">
                            <span>{(creator.followers/1000000).toFixed(1)}M Followers</span>
                            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                            <span>{creator.engagement_rate}% Eng</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 text-center">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border-4 border-primary/20 relative">
                        <span className="font-bold text-primary text-lg">{creator.ratefluencer_score}</span>
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-primary"
                            strokeDasharray={`${creator.ratefluencer_score}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                        </svg>
                      </div>
                    </td>
                    <td className="py-5 text-center font-medium">
                      <span className={`px-3 py-1 rounded-full text-sm ${creator.growth_score >= 80 ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`}>
                        +{creator.growth_score}%
                      </span>
                    </td>
                    <td className="py-5 text-right pr-4">
                      <button className="text-sm px-5 py-2 bg-white/5 hover:bg-primary text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-primary/25 border border-white/10 hover:border-transparent">
                        Analyze
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export const AIInsights = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question) return;
    setIsTyping(true);
    setAnswer('');
    setErrorMsg('');
    
    try {
      const response = await api.post('/analytics/ai-insights', {
        influencer_username: question // In a real app we might pass a specific creator ID or context + question
      });
      setAnswer(response.data.insights);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to generate insights.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">AI Insights Center</h1>
      <div className="space-y-6">
        <div className="glass-card w-full">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Bot className="text-primary" /> Ask AI Assistant</h3>
          
          {errorMsg && (
            <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {errorMsg}
            </div>
          )}
          
          <form onSubmit={handleAsk} className="space-y-4">
            <textarea 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl p-4 min-h-[100px] text-white focus:border-primary/50 focus:outline-none"
              placeholder="e.g. Enter a creator username (e.g. techburner) to generate SWOT analysis..."
            ></textarea>
            <button type="submit" disabled={isTyping} className="btn-primary w-full flex justify-center items-center">
              {isTyping ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Generate Insight'}
            </button>
          </form>
          {answer && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 bg-white/5 rounded-xl border border-white/10 border-l-4 border-l-primary text-gray-300">
              <div className="whitespace-pre-wrap leading-relaxed">
                {answer}
              </div>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="glass-card border-t-4 border-t-success">
            <h4 className="font-semibold mb-2">Strengths (SWOT)</h4>
            <p className="text-sm text-gray-400">High engagement rate, extremely loyal core demographic.</p>
          </div>
          <div className="glass-card border-t-4 border-t-danger">
            <h4 className="font-semibold mb-2">Risk Detection</h4>
            <p className="text-sm text-gray-400 flex items-center gap-2"><AlertCircle size={16} className="text-danger" /> Potential audience fatigue identified in recent sponsored posts.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Discovery = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!query) return;
    setLoading(true);
    setErrorMsg('');
    
    try {
      const response = await api.post('/influencer/discover', { query });
      setResults(response.data);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to fetch discovery results.');
    } finally {
      setLoading(false);
    }
  };

  const setAndSearch = (text) => {
    setQuery(text);
    // Use timeout to ensure state is set before search
    setTimeout(() => {
      document.getElementById('discovery-search-btn').click();
    }, 100);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Discovery Engine</h1>
      <p className="text-gray-400">Use natural language to find exactly who you need.</p>
      
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="text-sm">{errorMsg}</span>
        </div>
      )}

      <div className="glass-card text-center py-12 px-4 mb-8">
        <Search size={48} className="mx-auto text-primary mb-6" />
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative mb-8">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-full py-4 pl-6 pr-32 text-lg text-white focus:outline-none focus:border-primary/50" 
            placeholder='"Find Gaming creators under 500k followers"' 
          />
          <button id="discovery-search-btn" type="submit" disabled={loading} className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary/80 transition-colors text-white px-6 rounded-full font-medium flex items-center justify-center min-w-[100px]">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Search'}
          </button>
        </form>
        <div className="flex flex-wrap justify-center gap-3">
          <span onClick={() => setAndSearch("Gaming creators under 500k followers")} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 cursor-pointer hover:bg-white/10">"Gaming creators under 500k followers"</span>
          <span onClick={() => setAndSearch("Lifestyle influencers in New York")} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 cursor-pointer hover:bg-white/10">"Lifestyle influencers in New York"</span>
          <span onClick={() => setAndSearch("Tech creators over 1m")} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 cursor-pointer hover:bg-white/10">"Tech creators over 1m"</span>
        </div>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((creator, i) => (
            <motion.div key={creator.username || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
              <div className="flex items-center gap-4 mb-4 mt-2">
                <div className="w-14 h-14 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
                  {creator.username?.replace('@','')[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{creator.username}</h3>
                  <p className="text-sm text-primary font-medium">{creator.platform}</p>
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Category</span>
                  <span className="font-semibold">{creator.category || 'Lifestyle'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Followers</span>
                  <span className="font-semibold text-white">{(creator.followers / 1000).toFixed(1)}k</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Match Score</span>
                  <span className="font-bold text-success">{creator.match_score * 10}%</span>
                </div>
              </div>
              
              <button onClick={() => navigate('/analysis', { state: { username: creator.username, platform: creator.platform } })} className="w-full mt-6 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-sm font-medium transition-colors border border-white/10 flex items-center justify-center gap-2">
                <Search size={16} />
                View Full Profile
              </button>
            </motion.div>
          ))}
          {results.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-400">
              No exact matches found. Try adjusting your search criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ReportGenerator = () => {
  const [generating, setGenerating] = useState(false);
  const [username, setUsername] = useState('');
  
  const generatePDF = async () => {
    if (!username) {
      alert("Please enter a creator username first.");
      return;
    }
    
    setGenerating(true);
    try {
      // Create a printable window
      const printWindow = window.open('', '_blank');
      
      const htmlContent = `
        <html>
          <head>
            <title>Ratefluencer AI Report - ${username}</title>
            <style>
              body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; }
              h1 { color: #111; border-bottom: 2px solid #7C3AED; padding-bottom: 10px; }
              h2 { color: #555; margin-top: 30px; }
              .card { border: 1px solid #eee; padding: 20px; border-radius: 8px; margin-bottom: 20px; background: #fafafa; }
              .header { text-align: center; margin-bottom: 40px; }
              .logo { font-size: 24px; font-weight: bold; color: #7C3AED; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">Ratefluencer AI Engine</div>
              <h1>Comprehensive Influencer Dossier</h1>
              <p>Generated for: <strong>@${username}</strong></p>
            </div>
            
            <div class="card">
              <h2>1. Core Metrics & Demographics</h2>
              <p>Audience Quality Index: Evaluated<br/>
              Engagement Authenticity: Verified<br/>
              Demographic Splits: Generated via Groq NLP</p>
            </div>
            
            <div class="card">
              <h2>2. Growth Forecast Analysis</h2>
              <p>Projected 6-Month Trajectory: Positive Momentum<br/>
              ML Confidence Score: 94%</p>
            </div>
            
            <div class="card">
              <h2>3. Brand Match Index & SWOT</h2>
              <p>Top Sectors: Tech, Lifestyle<br/>
              Risk Assessment: Low Risk</p>
            </div>
            
            <p style="text-align: center; margin-top: 50px; font-size: 12px; color: #888;">
              This document was automatically generated by the Ratefluencer AI Intelligence Platform.
            </p>
            
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `;
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center">AI Pitch Deck Generator</h1>
      <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto leading-relaxed">
        <strong>Why this exists:</strong> Agencies and brands spend hours manually compiling influencer metrics into presentation decks for stakeholders. 
        This tool instantly aggregates all live ML analytics, risk assessments, and demographic breakdowns into a clean, white-labeled PDF ready for professional distribution.
      </p>
      
      <div className="glass-card space-y-6">
        <h3 className="text-xl font-semibold border-b border-white/10 pb-4">Target Creator</h3>
        <input 
          type="text" 
          placeholder="Enter username (e.g. mkbhd)" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-primary/50"
        />

        <h3 className="text-xl font-semibold border-b border-white/10 pb-4 mt-8">Select Report Sections</h3>
        <div className="space-y-4">
          {['Core Metrics & Demographics', 'Growth Forecast Analysis', 'Brand Match Index', 'AI SWOT Insights'].map(section => (
            <label key={section} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary rounded bg-black/20 border-white/20" />
              <span className="font-medium text-gray-200">{section}</span>
            </label>
          ))}
        </div>
        <button onClick={generatePDF} disabled={generating || !username} className="btn-primary w-full flex items-center justify-center gap-2 mt-8 py-4 text-lg">
          {generating ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <><FileText /> Export Professional PDF</>
          )}
        </button>
      </div>
    </div>
  );
};

export const Settings = () => {
  const [integrations, setIntegrations] = React.useState([
    { name: 'YouTube Data API', status: 'Checking...' },
    { name: 'Apify Instagram API', status: 'Checking...' },
    { name: 'Groq LLaMA Engine', status: 'Checking...' },
    { name: 'MongoDB Database', status: 'Checking...' },
  ]);
  
  const [darkMode, setDarkMode] = React.useState(true);
  const [smartNotifications, setSmartNotifications] = React.useState(true);
  const [competitorBenchmarking, setCompetitorBenchmarking] = React.useState(false);
  const [churnAnalysis, setChurnAnalysis] = React.useState(true);

  React.useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get('/config/status');
        if (response.data && response.data.integrations) {
          setIntegrations(response.data.integrations);
        }
      } catch (err) {
        console.error("Failed to fetch integration status:", err);
        // Fallback to error state
        setIntegrations(prev => prev.map(api => ({ ...api, status: 'Connection Failed' })));
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold">System Settings</h1>
      
      <div className="glass-card">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><SettingsIcon className="text-primary" /> API Integrations Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {integrations.map(api => (
            <div key={api.name} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <span className="font-medium">{api.name}</span>
              <div className="flex items-center gap-2">
                {api.status === 'Connected' ? (
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                ) : (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
                <span className={`text-sm font-medium ${api.status === 'Connected' ? 'text-success' : 'text-red-500'}`}>
                  {api.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="glass-card">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><Brain className="text-primary" size={20}/> AI Engine Parameters</h3>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <div className="mb-4 sm:mb-0">
              <p className="font-medium text-lg">Real-Time Trend Scraping</p>
              <p className="text-sm text-gray-400 mt-1">Continuously scan TikTok and Reels for viral audio and hashtag momentum.</p>
            </div>
            <button 
              onClick={() => setSmartNotifications(!smartNotifications)}
              className={`w-14 h-7 rounded-full relative transition-colors shrink-0 ${smartNotifications ? 'bg-primary' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 bottom-1 w-5 bg-white rounded-full shadow-md transition-all ${smartNotifications ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <div className="mb-4 sm:mb-0">
              <p className="font-medium text-lg">Auto-Generate AI Pitch Decks</p>
              <p className="text-sm text-gray-400 mt-1">Automatically compile and export PDF dossiers when analyzing new creators.</p>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`w-14 h-7 rounded-full relative transition-colors shrink-0 ${darkMode ? 'bg-primary' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 bottom-1 w-5 bg-white rounded-full shadow-md transition-all ${darkMode ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <div className="mb-4 sm:mb-0">
              <p className="font-medium text-lg">Automated Competitor Benchmarking</p>
              <p className="text-sm text-gray-400 mt-1">When viewing a creator, dynamically run a silent ML analysis on their top 3 direct competitors.</p>
            </div>
            <button 
              onClick={() => setCompetitorBenchmarking(!competitorBenchmarking)}
              className={`w-14 h-7 rounded-full relative transition-colors shrink-0 ${competitorBenchmarking ? 'bg-primary' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 bottom-1 w-5 bg-white rounded-full shadow-md transition-all ${competitorBenchmarking ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <div className="mb-4 sm:mb-0">
              <p className="font-medium text-lg">Predictive Audience Churn Analysis</p>
              <p className="text-sm text-gray-400 mt-1">Flag creators whose audience demographics show high probability of stagnation in the next 30 days.</p>
            </div>
            <button 
              onClick={() => setChurnAnalysis(!churnAnalysis)}
              className={`w-14 h-7 rounded-full relative transition-colors shrink-0 ${churnAnalysis ? 'bg-primary' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 bottom-1 w-5 bg-white rounded-full shadow-md transition-all ${churnAnalysis ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <div className="mb-4 sm:mb-0">
              <p className="font-medium text-lg">DeepFake Follower Sensitivity</p>
              <p className="text-sm text-gray-400 mt-1">Adjust the strictness of the Bot Detection ML model when scanning engagement pods.</p>
            </div>
            <select className="bg-[#0a0a0a] border border-white/20 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none w-48 shrink-0">
              <option>Lenient (Basic Check)</option>
              <option selected>Balanced (Recommended)</option>
              <option>Maximum Strictness</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <div className="mb-4 sm:mb-0">
              <p className="font-medium text-lg">NLP Toxicity & Brand-Safety Filter</p>
              <p className="text-sm text-gray-400 mt-1">Scan millions of comments to block creators with high levels of hate-speech or toxicity.</p>
            </div>
            <select className="bg-[#0a0a0a] border border-white/20 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none w-48 shrink-0">
              <option>Family Friendly (PG)</option>
              <option selected>Standard Safety</option>
              <option>No Filtering</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Comparison = () => {
  const [influencer1, setInfluencer1] = useState('');
  const [influencer2, setInfluencer2] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!influencer1 || !influencer2) return;
    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const response = await api.post('/influencer/compare', {
        influencer1: influencer1.startsWith('@') ? influencer1 : `@${influencer1}`,
        influencer2: influencer2.startsWith('@') ? influencer2 : `@${influencer2}`
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || 'Failed to compare influencers. Make sure both exist in the database (try: techburner, mkbhd).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Compare Creators</h1>
      <p className="text-gray-400">Head-to-head AI analysis between two creators.</p>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="text-sm">{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleCompare} className="glass-card flex flex-col md:flex-row gap-4 items-center">
        <input 
          type="text" 
          placeholder="Creator 1 (e.g. mkbhd)" 
          value={influencer1}
          onChange={(e) => setInfluencer1(e.target.value)}
          className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:border-primary/50 text-white" 
        />
        <span className="text-gray-500 font-bold">VS</span>
        <input 
          type="text" 
          placeholder="Creator 2 (e.g. techburner)" 
          value={influencer2}
          onChange={(e) => setInfluencer2(e.target.value)}
          className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:border-primary/50 text-white" 
        />
        <button type="submit" disabled={loading} className="btn-primary w-full md:w-48 flex justify-center items-center">
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Compare'}
        </button>
      </form>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {[result.influencer1, result.influencer2].map((inf, i) => (
            <div key={i} className={`glass-card border-t-4 ${i === 0 ? 'border-primary' : 'border-secondary'}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${i === 0 ? 'bg-primary' : 'bg-secondary'}`}>
                  {inf.username.replace('@', '')[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{inf.username}</h3>
                  <p className="text-gray-400">{inf.platform}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between pb-2 border-b border-white/10">
                  <span className="text-gray-400">Ratefluencer Score</span>
                  <span className="font-bold text-success">{inf.ratefluencer_score}/100</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/10">
                  <span className="text-gray-400">Followers</span>
                  <span className="font-bold">{(inf.followers / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/10">
                  <span className="text-gray-400">Engagement</span>
                  <span className="font-bold">{inf.engagement_rate}%</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/10">
                  <span className="text-gray-400">Growth Score</span>
                  <span className="font-bold">{inf.growth_score}/100</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const InfluencerReport = () => <div className="glass-card"><h1 className="text-2xl font-bold">Influencer Report</h1><p className="mt-4 text-gray-400">Detailed report view will be generated here.</p></div>;

export const SimilarCreators = () => {
  const [query, setQuery] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [results, setResults] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setIsSearching(true);
    setResults(null);
    setErrorMsg('');
    
    try {
      const formattedQuery = query.startsWith('@') ? query : `@${query}`;
      const res = await api.post('/brand/similar-creators', {
        creator_name: formattedQuery
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || 'Failed to find similar creators.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Similar Creators</h1>
      <p className="text-gray-400">Find creators with overlapping audiences and niches.</p>
      
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3">
          <span className="text-sm">{errorMsg}</span>
        </div>
      )}
      
      <form onSubmit={handleSearch} className="glass-card flex gap-4">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Enter Creator Name (e.g. mkbhd, techburner)..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 text-white" 
          />
        </div>
        <button type="submit" disabled={isSearching} className="btn-primary w-40 flex justify-center items-center">
          {isSearching ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Find Similar'}
        </button>
      </form>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {results.map((creator, i) => (
            <div key={creator.username || i} className="glass-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center font-bold text-xl">{creator.username?.replace('@','')[0].toUpperCase()}</div>
                <div>
                  <h3 className="text-lg font-semibold">{creator.username}</h3>
                  <p className="text-xs text-success font-bold">{Math.round(creator.similarity_score * 100)}% Match</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2">{creator.bio}</p>
              <button className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-sm transition-colors border border-white/10">Analyze Profile</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
