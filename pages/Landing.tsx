import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import VoiceModal from '../components/VoiceModal';

const FeatureCard = ({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: string }) => (
  <div className={`group relative p-6 bg-[#0a0a0f] border border-eburon-800 hover:border-eburon-500 transition-all duration-300 overflow-hidden animate-in fade-in slide-in-from-bottom-4 ${delay}`}>
    <div className="absolute inset-0 bg-eburon-900/0 group-hover:bg-eburon-900/20 transition-colors"></div>
    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-eburon-800 group-hover:border-eburon-500 transition-colors"></div>
    <div className="relative z-10">
      <div className="w-12 h-12 mb-4 text-eburon-500 bg-eburon-900/50 rounded-sm flex items-center justify-center border border-eburon-800 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold font-mono text-white mb-2 tracking-wide uppercase">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-300 transition-colors">{desc}</p>
    </div>
  </div>
);

const StatBlock = ({ value, label }: { value: string, label: string }) => (
  <div className="border-l border-eburon-800 pl-6">
    <div className="text-3xl font-bold font-mono text-white mb-1">{value}</div>
    <div className="text-xs text-eburon-500 font-mono uppercase tracking-widest">{label}</div>
  </div>
);

const Landing: React.FC = () => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  return (
    <div className="relative min-h-full flex flex-col">
      <VoiceModal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)} />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-eburon-900/50 border border-eburon-500/30 text-eburon-400 text-[10px] font-mono font-bold uppercase tracking-widest mb-6 animate-pulse">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            System Operational • v2.5.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6 font-mono leading-tight">
            THE CENTRAL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-eburon-500 to-eburon-accent">INTELLIGENCE LAYER</span>
          </h1>
          
          <p className="text-lg text-gray-400 max-w-2xl mb-10 leading-relaxed border-l-2 border-eburon-800 pl-6 font-mono">
            Eburon unifies conversational AI, infrastructure orchestration, and robotics into a single continuum. 
            Replace fragmented tools with one authoritative loop.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setIsVoiceModalOpen(true)}
              className="px-8 py-4 bg-eburon-500 text-black font-bold font-mono text-sm uppercase tracking-widest hover:bg-eburon-400 transition-colors flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            >
              <span>Initiate Uplink</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </button>
            <Link to="/integrations" className="px-8 py-4 bg-transparent border border-eburon-700 text-eburon-500 font-bold font-mono text-sm uppercase tracking-widest hover:bg-eburon-900 hover:border-eburon-500 transition-colors flex items-center justify-center">
              View Grid Status
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-80">
            <StatBlock value="<500ms" label="Response Latency" />
            <StatBlock value="50,000+" label="Active Nodes" />
            <StatBlock value="99.99%" label="Uptime Guarantee" />
            <StatBlock value="24/7" label="Temporal Coverage" />
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-eburon-900/20 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-eburon-800 to-transparent"></div>
      </section>

      {/* Capabilities Grid */}
      <section className="px-8 py-20 bg-[#050508] relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-bold font-mono text-white tracking-tighter">
              <span className="text-eburon-500">/</span> MODULE CAPABILITIES
            </h2>
            <div className="hidden md:flex gap-2">
              <div className="w-2 h-2 bg-eburon-800"></div>
              <div className="w-2 h-2 bg-eburon-700"></div>
              <div className="w-2 h-2 bg-eburon-600"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              delay="delay-0"
              title="Omnipresent Voice"
              desc="Deploy Gemini 2.5 Live agents that handle calls with human cadence, interruptions, and emotional nuance. 24/7 availability without fatigue."
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>}
            />
            <FeatureCard 
              delay="delay-100"
              title="Instant Scaling"
              desc="Scale from 10 pilot units to 50,000 active concurrent sessions instantly. Elastic infrastructure that adapts to load spikes."
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            />
            <FeatureCard 
              delay="delay-200"
              title="Cost Compression"
              desc="Reduce operational expenditure by 60% compared to traditional human call centers while increasing resolution accuracy."
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <FeatureCard 
              delay="delay-300"
              title="Grid Integration"
              desc="Seamlessly read/write to CRMs (Salesforce), Dev tools (GitHub), and Physical Ops (ROS2). Eburon acts, it doesn't just talk."
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
            />
            <FeatureCard 
              delay="delay-400"
              title="Mission Memory"
              desc="Persistent context retention across sessions. Eburon remembers previous interactions, deployments, and directives."
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            />
            <FeatureCard 
              delay="delay-500"
              title="Visual Intelligence"
              desc="Multimodal input processing. Analyze schematics, edit footage, and inspect visual data in real-time."
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
            />
          </div>
        </div>
      </section>

      {/* Footer / Status */}
      <footer className="mt-auto px-8 py-6 border-t border-eburon-800 flex justify-between items-center text-[10px] font-mono text-gray-600 uppercase tracking-widest">
        <div>Eburon Intelligence Systems © 2025</div>
        <div className="flex gap-4">
          <span>Status: <span className="text-green-500">Nominal</span></span>
          <span>Region: <span className="text-white">Global-1</span></span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;