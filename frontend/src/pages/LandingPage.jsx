import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Brain, ShieldAlert, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();
  const features = [
    { icon: <Target className="text-primary" size={24} />, title: 'AI Influencer Scoring', desc: 'Proprietary algorithm analyzing engagement, reach, and authenticity.' },
    { icon: <ShieldAlert className="text-secondary" size={24} />, title: 'Fake Follower Detection', desc: 'Identify bot networks and artificially inflated engagement metrics instantly.' },
    { icon: <TrendingUp className="text-accent" size={24} />, title: 'Growth Prediction', desc: 'Forecast audience trajectory with 94% accuracy over a 180-day period.' },
    { icon: <Sparkles className="text-yellow-400" size={24} />, title: 'Brand Matching', desc: 'Find the perfect synergy between creator demographics and brand target audience.' }
  ];

  const steps = [
    { step: '01', title: 'Enter Creator', desc: 'Simply input any Instagram or YouTube handle.' },
    { step: '02', title: 'AI Analysis', desc: 'Our engine processes millions of data points.' },
    { step: '03', title: 'Get ViralMind Score', desc: 'Receive a comprehensive, actionable intelligence report.' }
  ];

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

      {/* Navbar */}
      <nav className="w-full px-8 py-6 flex justify-between items-center z-10 relative">
        <div className="text-2xl font-bold tracking-tighter">
          <span className="text-gradient">VIRALMIND</span> AI
        </div>
        <div className="space-x-6 hidden md:flex text-sm font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#ai" className="hover:text-white transition-colors">AI Capabilities</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
        </div>
        <div className="flex space-x-4">
          <Link to="/auth" className="btn-secondary text-sm px-4 py-2">Log In</Link>
          <Link to="/auth" className="btn-primary text-sm px-4 py-2">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
            <Sparkles size={16} className="text-secondary" />
            <span className="text-sm font-medium text-gray-300">Next-Gen Influencer Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Predict Influence <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Before It Happens
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light">
            AI-powered influencer intelligence for brands, agencies, and creators. Detect fake engagement, predict growth, and find your perfect brand matches instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/analysis" className="btn-primary flex items-center space-x-2 text-lg px-8 py-4 w-full sm:w-auto">
              <span>Analyze Influencer</span>
              <ArrowRight size={20} />
            </Link>
            <Link to="/dashboard" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
              View Demo
            </Link>
          </div>
        </motion.div>
      </div>
      

      {/* Features Section */}
      <section id="features" className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise-Grade Intelligence</h2>
            <p className="text-gray-400">Powered by advanced machine learning models.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card glow-hover hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Seamless Intelligence Flow</h2>
            <p className="text-gray-400">Three steps to complete creator clarity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 z-0"></div>
            {steps.map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="glass-card glow-hover text-center relative z-10 bg-background/80"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-primary/20">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-gray-400">Join the top brands making data-driven creator decisions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah J.", role: "CMO at TechBrand", quote: "VIRALMIND AI saved us over $50k in ad spend by identifying fake engagement rings before we signed the contract." },
              { name: "Michael T.", role: "Agency Director", quote: "The Growth Prediction algorithm is uncanny. It predicted our latest ambassador's viral breakout 3 weeks in advance." },
              { name: "Elena R.", role: "Brand Strategist", quote: "Finally, an intelligence platform that looks as good as it functions. The UI is absolutely breathtaking and the AI is unmatched." }
            ].map((t, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="glass-card p-8 flex flex-col justify-between"
              >
                <div className="mb-6 text-primary">
                  <svg className="w-8 h-8 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/></svg>
                </div>
                <p className="text-gray-300 italic mb-6">"{t.quote}"</p>
                <div>
                  <h4 className="font-bold text-white">{t.name}</h4>
                  <p className="text-sm text-primary">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 relative z-10 bg-background/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold tracking-tighter text-gradient">VIRALMIND AI</span>
            <p className="text-sm text-gray-500 mt-2">© 2026 ViralMind Inc. All rights reserved.</p>
          </div>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
