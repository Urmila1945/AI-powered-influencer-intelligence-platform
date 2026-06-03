import React, { useState, useEffect, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Network, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const SimilarityGraph = () => {
  const [query, setQuery] = useState('TechBurner');
  const [data, setData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const fgRef = useRef();

  const generateMockGraph = (centerNode) => {
    return {
      nodes: [
        { id: centerNode, group: 1, val: 20 },
        { id: 'Trakin Tech', group: 2, val: 15 },
        { id: 'Geeky Ranjit', group: 2, val: 15 },
        { id: 'TechWiser', group: 2, val: 10 },
        { id: 'Gyan Therapy', group: 2, val: 10 },
        { id: 'Beebom', group: 2, val: 12 },
        { id: 'C4ETech', group: 2, val: 8 },
        { id: 'Technical Guruji', group: 2, val: 18 }
      ],
      links: [
        { source: centerNode, target: 'Trakin Tech', val: 5 },
        { source: centerNode, target: 'Geeky Ranjit', val: 4 },
        { source: centerNode, target: 'TechWiser', val: 3 },
        { source: centerNode, target: 'Technical Guruji', val: 2 },
        { source: 'Trakin Tech', target: 'Gyan Therapy', val: 2 },
        { source: 'TechWiser', target: 'Beebom', val: 4 },
        { source: 'Geeky Ranjit', target: 'C4ETech', val: 3 }
      ]
    };
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call for similar creators network
    setTimeout(() => {
      setData(generateMockGraph(query || 'Creator'));
      setLoading(false);
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

  return (
    <div className="max-w-7xl mx-auto space-y-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Network className="text-primary" /> Similarity Graph
          </h1>
          <p className="text-gray-400">Discover creator clusters and competitor networks interactively.</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search Creator..."
              className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-primary/50 text-white text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary text-sm py-2 px-6" disabled={loading}>
            {loading ? 'Mapping...' : 'Map'}
          </button>
        </form>
      </div>

      <motion.div 
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card flex-1 min-h-[600px] overflow-hidden relative border border-white/10 rounded-2xl flex"
      >
        {dimensions.width > 0 && dimensions.height > 0 && (
          <ForceGraph2D
            ref={fgRef}
            width={dimensions.width}
            height={dimensions.height}
            graphData={data}
            nodeLabel="id"
            nodeColor={node => node.group === 1 ? '#8B5CF6' : '#3B82F6'}
            linkColor={() => 'rgba(255,255,255,0.2)'}
            nodeRelSize={4}
            linkWidth={link => link.val}
            backgroundColor="transparent"
          onNodeClick={(node) => {
            setQuery(node.id);
            handleSearch({ preventDefault: () => {} });
          }}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.id;
            const fontSize = 12/globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); 

            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = node.group === 1 ? '#C084FC' : '#93C5FD';
            ctx.fillText(label, node.x, node.y);

            node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
          }}
          nodePointerAreaPaint={(node, color, ctx) => {
            ctx.fillStyle = color;
            const bckgDimensions = node.__bckgDimensions;
            bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
          }}
        />
        )}
        
        {loading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        )}
      </motion.div>
    </div>
  );
};

export default SimilarityGraph;
