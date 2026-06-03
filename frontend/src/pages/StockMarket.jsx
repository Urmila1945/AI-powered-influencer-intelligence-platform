import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Link } from 'react-router-dom';

const StockMarket = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await api.get('/influencer/stock-market');
        setStocks(response.data);
      } catch (error) {
        console.error('Failed to fetch stock market data:', error);
        // Fallback demo data
        setStocks([
            { username: 'TechBurner', price: 10500, momentum: 12, recommendation: 'Buy', viralmind_score: 94 },
            { username: 'CarryMinati', price: 40200, momentum: -3, recommendation: 'Hold', viralmind_score: 88 },
            { username: 'BeerBiceps', price: 7100, momentum: 8, recommendation: 'Buy', viralmind_score: 91 },
            { username: 'MKBHD', price: 18500, momentum: -1, recommendation: 'Hold', viralmind_score: 96 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Activity className="text-primary" /> Creator Stock Market™
          </h1>
          <p className="text-gray-400">Treat influencers like stocks. Buy, Hold, or Avoid based on AI momentum.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-4 font-semibold text-gray-300">Creator</th>
                <th className="p-4 font-semibold text-gray-300">Influence Cap</th>
                <th className="p-4 font-semibold text-gray-300">24h Momentum</th>
                <th className="p-4 font-semibold text-gray-300">ViralMind Score</th>
                <th className="p-4 font-semibold text-gray-300">AI Recommendation</th>
                <th className="p-4 font-semibold text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock, i) => (
                <motion.tr 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-4 font-bold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs">
                        {stock.username.charAt(0).toUpperCase()}
                    </div>
                    {stock.username}
                  </td>
                  <td className="p-4 text-gray-300">
                    {stock.price >= 1000 ? (stock.price/1000).toFixed(1) + 'M' : stock.price.toFixed(1) + 'K'}
                  </td>
                  <td className={`p-4 font-bold flex items-center gap-1 ${stock.momentum > 0 ? 'text-success' : 'text-danger'}`}>
                    {stock.momentum > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {stock.momentum > 0 ? '+' : ''}{stock.momentum}%
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div style={{width: `${stock.viralmind_score}%`}} className="h-full bg-primary rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">{stock.viralmind_score}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        stock.recommendation === 'Buy' ? 'bg-success/20 text-success border-success/30' :
                        stock.recommendation === 'Hold' ? 'bg-warning/20 text-warning border-warning/30' :
                        'bg-danger/20 text-danger border-danger/30'
                    }`}>
                        {stock.recommendation.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link to="/analysis" state={{ username: stock.username }} className="text-primary hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
                        Deep Dive <ArrowRight size={14} />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockMarket;
