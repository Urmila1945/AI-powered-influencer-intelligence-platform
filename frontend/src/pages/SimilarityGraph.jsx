import React, { useState, useEffect, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Network, Search, X, Users, Activity, BarChart3, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SimilarityGraph = () => {
  const [query, setQuery] = useState('TechBurner');
  const [data, setData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  
  const containerRef = useRef(null);
  const fgRef = useRef();

  const generateMockGraph = (centerNode) => {
    return {
      nodes: [
        { id: centerNode, group: 1, val: 25, followers: '15.2M', match: '100%', category: 'Tech' },
        { id: 'Trakin Tech', group: 2, val: 15, followers: '13.5M', match: '94%', category: 'Tech' },
        { id: 'Geeky Ranjit', group: 2, val: 12, followers: '3.4M', match: '88%', category: 'Tech' },
        { id: 'TechWiser', group: 2, val: 10, followers: '2.1M', match: '82%', category: 'Tech' },
        { id: 'Gyan Therapy', group: 2, val: 10, followers: '1.9M', match: '79%', category: 'Tech/Mobile' },
        { id: 'Beebom', group: 2, val: 12, followers: '3.0M', match: '85%', category: 'Tech/News' },
        { id: 'C4ETech', group: 2, val: 8, followers: '1.8M', match: '72%', category: 'Tech' },
        { id: 'Technical Guruji', group: 2, val: 18, followers: '23.1M', match: '91%', category: 'Tech' }
      ],
      links: [
        { source: centerNode, target: 'Trakin Tech', val: 5 },
        { source: centerNode, target: 'Geeky Ranjit', val: 4 },
        { source: centerNode, target: 'TechWiser', val: 3 },
        { source: centerNode, target: 'Technical Guruji', val: 6 },
        { source: 'Trakin Tech', target: 'Gyan Therapy', val: 2 },
        { source: 'TechWiser', target: 'Beebom', val: 4 },
        { source: 'Geeky Ranjit', target: 'C4ETech', val: 3 },
        { source: 'Technical Guruji', target: 'Trakin Tech', val: 4 }
      ]
    };
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setSelectedNode(null);
    setTimeout(() => {
      setData(generateMockGraph(query || 'Creator'));
      setLoading(false);
      if (fgRef.current) {
        fgRef.current.d3Force('charge').strength(-300);
        fgRef.current.zoomToFit(400, 50);
      }
    }, 1000);
  };

  useEffect(() => {
    setData(generateMockGraph(query));
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(2.5, 1000);
    }
  }, [fgRef]);

  const renderNode = useCallback((node, ctx, globalScale) => {
    const isSelected = selectedNode && selectedNode.id === node.id;
    const isCenter = node.group === 1;
    
    // Draw Node Circle
    const radius = Math.sqrt(node.val) * (isSelected ? 1.5 : 1);
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    
    if (isCenter) {
      ctx.fillStyle = isSelected ? '#a855f7' : '#8b5cf6'; // Primary Purple
      // Add glow to center
      ctx.shadowColor = '#8b5cf6';
      ctx.shadowBlur = 15;
    } else {
      ctx.fillStyle = isSelected ? '#60a5fa' : '#3b82f6'; // Secondary Blue
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = isSelected ? 15 : 5;
    }
    
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow

    // Draw Text Label
    const label = node.id;
    const fontSize = isSelected ? 14/globalScale : 12/globalScale;
    ctx.font = `${isSelected ? 'bold ' : ''}${fontSize}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(label, node.x, node.y + radius + 4/globalScale);
  }, [selectedNode]);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 h-[85vh] flex flex-col relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Network className="text-primary" /> Creator Neural Network
          </h1>
          <p className="text-gray-400">Discover creator clusters, audience overlaps, and competitor networks interactively.</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Enter center node creator..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary/50 text-white text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary text-sm py-2 px-8" disabled={loading}>
            {loading ? 'Simulating...' : 'Generate Graph'}
          </button>
        </form>
      </div>

      <div className="flex-1 w-full relative flex gap-6 overflow-hidden">
        {/* Main Graph Container */}
        <motion.div 
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel flex-1 relative border border-white/10 rounded-2xl overflow-hidden bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)]"
        >
          {dimensions.width > 0 && dimensions.height > 0 && (
            <ForceGraph2D
              ref={fgRef}
              width={dimensions.width}
              height={dimensions.height}
              graphData={data}
              nodeLabel={() => ''} // We draw custom labels
              linkColor={() => 'rgba(255,255,255,0.15)'}
              linkWidth={link => Math.sqrt(link.val)}
              linkDirectionalParticles={2}
              linkDirectionalParticleWidth={1.5}
              linkDirectionalParticleSpeed={d => d.val * 0.001}
              backgroundColor="transparent"
              onNodeClick={handleNodeClick}
              nodeCanvasObject={renderNode}
              nodePointerAreaPaint={(node, color, ctx) => {
                ctx.fillStyle = color;
                const radius = Math.sqrt(node.val) * 1.5;
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius + 5, 0, 2 * Math.PI, false);
                ctx.fill();
              }}
              d3VelocityDecay={0.3}
            />
          )}
          
          {loading && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-md flex flex-col items-center justify-center z-10">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-primary font-medium animate-pulse">Computing Neural Links...</p>
            </div>
          )}
          
          {/* Legend */}
          <div className="absolute bottom-6 left-6 glass-card p-4 rounded-xl border border-white/5 flex gap-4 text-xs font-medium">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#8b5cf6] shadow-[0_0_8px_#8b5cf6]"></div>
                <span>Target Node</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3b82f6] shadow-[0_0_8px_#3b82f6]"></div>
                <span>Similar Creators</span>
             </div>
          </div>
        </motion.div>

        {/* Dynamic Side Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
              className="w-80 glass-panel rounded-2xl border border-white/10 p-6 flex flex-col shrink-0"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center border border-white/10 shrink-0">
                  <Users className="text-primary" size={24} />
                </div>
                <button onClick={() => setSelectedNode(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <h2 className="text-2xl font-bold mb-1 truncate">{selectedNode.id}</h2>
              <p className="text-sm text-gray-400 mb-8">{selectedNode.category || 'General Creator'}</p>

              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-2"><BarChart3 size={16}/> Node Weight</span>
                    <span className="font-bold text-white">{selectedNode.val}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min(100, selectedNode.val * 3)}%` }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-2"><Activity size={16}/> Audience Match</span>
                    <span className="font-bold text-success">{selectedNode.match || '85%'}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div className="bg-success h-1.5 rounded-full" style={{ width: selectedNode.match || '85%' }}></div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-4">Quick Stats</h4>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="text-xs text-gray-400 mb-1">Followers</div>
                        <div className="text-lg font-bold">{selectedNode.followers || 'N/A'}</div>
                     </div>
                     <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="text-xs text-gray-400 mb-1">Engagement</div>
                        <div className="text-lg font-bold text-success flex items-center gap-1"><TrendingUp size={14}/> +4.2%</div>
                     </div>
                  </div>
                </div>
              </div>

              <button 
                className="w-full py-3 mt-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors font-medium text-sm flex items-center justify-center gap-2"
                onClick={() => {
                  setQuery(selectedNode.id);
                  handleSearch({ preventDefault: () => {} });
                }}
              >
                Set as Target Node
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SimilarityGraph;
