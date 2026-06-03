import React, { useState } from 'react';
import { Target, TrendingUp, DollarSign, Activity, ShoppingCart, Search, Users, Heart, MessageCircle } from 'lucide-react';
import api from '../services/api';

const ROIPredictor = () => {
  const [username, setUsername] = useState('techburner');
  const [brand, setBrand] = useState('Samsung');
  const [budget, setBudget] = useState(50000);
  const [industry, setIndustry] = useState('Tech');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    if (!username || !brand) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/analytics/roi-predictor', {
        influencer_username: username.replace('@', ''),
        brand,
        budget,
        industry
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate ROI prediction');
    } finally {
      setLoading(false);
    }
  };

  const calculateScoreColor = (roi) => {
    if (roi >= 200) return 'text-success drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]';
    if (roi >= 100) return 'text-warning drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]';
    return 'text-danger drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]';
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-3">
            <Activity className="text-primary" /> AI Campaign Simulator & Negotiation Assistant
        </h1>
        <p className="text-gray-400 mt-2">Simulate campaign outcomes and get AI-suggested sponsorship pricing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="glass-panel p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Creator Username</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none transition-colors"
                placeholder="e.g. techburner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Brand Name</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none transition-colors"
              placeholder="e.g. Samsung"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Campaign Budget ($)</label>
            <div className="flex items-center justify-between text-lg font-bold mb-2">
              <span className="text-primary">${budget.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="200000"
              step="1000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Brand Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none transition-colors appearance-none"
            >
              <option value="Tech">Technology & Electronics</option>
              <option value="Beauty">Beauty & Cosmetics</option>
              <option value="Fashion">Fashion & Apparel</option>
              <option value="Gaming">Gaming & Esports</option>
              <option value="Finance">Finance & Crypto</option>
              <option value="General">General / Lifestyle</option>
            </select>
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary to-secondary rounded-xl font-bold hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Simulating Campaign...' : 'Predict ROI'}
          </button>
          
          {error && <p className="text-danger text-sm mt-2">{error}</p>}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
              
              <div className="glass-panel p-6 flex flex-col items-center justify-center text-center space-y-2 border border-primary/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5"></div>
                <h3 className="text-gray-400 text-sm uppercase tracking-wider relative z-10">Predicted ROI</h3>
                <div className={`text-6xl font-black ${calculateScoreColor(result.predictions.roi_percentage)} relative z-10`}>
                  {result.predictions.roi_percentage}%
                </div>
                <p className="text-xs text-gray-500 relative z-10 mt-2">Based on historical conversion rates</p>
              </div>

              <div className="glass-panel p-6 flex flex-col justify-center space-y-4 relative overflow-hidden border border-secondary/30">
                <div className="absolute inset-0 bg-secondary/5"></div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                  <div>
                    <p className="text-sm text-gray-400">Suggested Sponsorship Price</p>
                    <p className="text-3xl font-bold">${result.fair_market_price.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                    <DollarSign size={24} />
                  </div>
                </div>
                <div className="pt-2 relative z-10">
                  <p className="text-xs text-gray-400">
                    AI Negotiation Tip: Based on {result.influencer_data.engagementRate} engagement, do not pay more than ${(result.fair_market_price * 1.2).toLocaleString()}.
                  </p>
                </div>
              </div>

              {/* Engagement Predictions */}
              <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="glass-card p-4 text-center">
                    <Users size={20} className="mx-auto text-primary mb-2" />
                    <p className="text-xs text-gray-400 uppercase">Reach</p>
                    <p className="text-xl font-bold">{formatNumber(result.predictions.predicted_reach)}</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <Heart size={20} className="mx-auto text-danger mb-2" />
                    <p className="text-xs text-gray-400 uppercase">Likes</p>
                    <p className="text-xl font-bold">{formatNumber(result.predictions.predicted_likes)}</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <MessageCircle size={20} className="mx-auto text-warning mb-2" />
                    <p className="text-xs text-gray-400 uppercase">Comments</p>
                    <p className="text-xl font-bold">{formatNumber(result.predictions.predicted_comments)}</p>
                </div>
                <div className="glass-card p-4 text-center border border-success/30 bg-success/5">
                    <ShoppingCart size={20} className="mx-auto text-success mb-2" />
                    <p className="text-xs text-success uppercase">Sales</p>
                    <p className="text-xl font-bold text-success">{formatNumber(result.predictions.expected_sales)}</p>
                </div>
              </div>

              <div className="md:col-span-2 glass-panel p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shrink-0">
                    <Activity size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-white">AI Analyst Breakdown</h3>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {result.predictions.analysis}
                    </p>
                  </div>
                </div>
              </div>
              
            </div>
          ) : (
            <div className="h-full min-h-[400px] glass-panel flex flex-col items-center justify-center text-center p-8 border-dashed border-2 border-white/10">
              <TrendingUp size={48} className="text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-300">Run a Campaign Simulation</h3>
              <p className="text-gray-500 mt-2 max-w-md">
                Enter a creator and brand to simulate reach, engagement, sales, and get AI-suggested sponsorship pricing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ROIPredictor;
