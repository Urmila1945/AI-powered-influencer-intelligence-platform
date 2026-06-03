import React, { useState } from 'react';
import { Target, TrendingUp, DollarSign, Activity, ShoppingCart, Search } from 'lucide-react';
import api from '../services/api';

const ROIPredictor = () => {
  const [username, setUsername] = useState('mkbhd');
  const [budget, setBudget] = useState(5000);
  const [industry, setIndustry] = useState('Tech');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    if (!username) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/analytics/roi-predictor', {
        influencer_username: username.replace('@', ''),
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Predictive <span className="text-gradient">ROI Engine</span></h1>
        <p className="text-gray-400 mt-2">Simulate campaign outcomes and calculate fair market pricing before you spend a dime.</p>
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
                placeholder="e.g. mkbhd"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Campaign Budget ($)</label>
            <div className="flex items-center justify-between text-lg font-bold mb-2">
              <span className="text-primary">${budget.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="100000"
              step="500"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$500</span>
              <span>$100,000</span>
            </div>
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
                <p className="text-xs text-gray-500 relative z-10 mt-2">Based on historical industry conversion rates</p>
              </div>

              <div className="glass-panel p-6 flex flex-col justify-center space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-sm text-gray-400">Fair Market Price (1 Post)</p>
                    <p className="text-2xl font-bold">${result.fair_market_price.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <DollarSign size={24} />
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-gray-400">
                    Calculated using standard baseline of $10-$20 CPM adjusted for {result.influencer_data.engagementRate} engagement rate on {result.influencer_data.platform}.
                  </p>
                </div>
              </div>

              <div className="glass-panel p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Estimated Clicks</p>
                  <p className="text-3xl font-bold mt-1 text-white">{result.predictions.predicted_clicks.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Target size={24} />
                </div>
              </div>

              <div className="glass-panel p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Expected Conversions</p>
                  <p className="text-3xl font-bold mt-1 text-white">{result.predictions.expected_sales.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center text-success">
                  <ShoppingCart size={24} />
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
                Enter a creator username and adjust your budget to see real-time AI predictions for clicks, sales, and total return on investment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ROIPredictor;
