
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ to, label, icon, active }: { to: string, label: string, icon: React.ReactNode, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-3 border-l-2 transition-all duration-200 group ${
      active 
        ? 'border-eburon-500 bg-eburon-800/50 text-white' 
        : 'border-transparent text-gray-500 hover:text-eburon-400 hover:bg-eburon-900 hover:border-eburon-800'
    }`}
  >
    <span className={`transition-colors ${active ? 'text-eburon-500' : 'text-gray-600 group-hover:text-eburon-400'}`}>
      {icon}
    </span>
    <span className="font-mono text-xs font-bold tracking-widest">{label}</span>
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#050508] text-gray-100 overflow-hidden font-sans selection:bg-eburon-500 selection:text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0f] border-r border-eburon-800 flex flex-col z-20 hidden md:flex">
        <div className="p-6 border-b border-eburon-800/50">
          <Link to="/" className="text-xl font-bold tracking-tighter text-white flex items-center gap-3 font-mono hover:text-eburon-400 transition-colors">
            <div className="w-2 h-2 bg-eburon-500 rotate-45"></div>
            EBURON
          </Link>
          <div className="flex justify-between items-center mt-2">
            <p className="text-[10px] text-eburon-500 font-mono tracking-widest uppercase opacity-70">Central Intelligence</p>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>

        <nav className="flex-1 py-6 space-y-1">
          <NavItem 
            to="/" 
            active={location.pathname === '/'}
            label="SYSTEM OVERVIEW" 
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
          />
          <NavItem 
            to="/live" 
            active={location.pathname === '/live'}
            label="LIVE NEXUS" 
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>}
          />
          <NavItem 
            to="/visual" 
            active={location.pathname === '/visual'}
            label="VISUAL FORGE" 
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
          <NavItem 
            to="/intel" 
            active={location.pathname === '/intel'}
            label="INTEL CORE" 
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>}
          />
          <NavItem 
            to="/integrations" 
            active={location.pathname === '/integrations'}
            label="GRID SYNC" 
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          />
        </nav>

        <div className="p-6 border-t border-eburon-800">
          <div className="bg-eburon-900/50 p-3 border border-eburon-800 text-[10px] text-gray-500 font-mono">
             <div className="flex justify-between mb-1">
               <span>CPU</span>
               <span className="text-eburon-400">12%</span>
             </div>
             <div className="w-full bg-black h-1 mb-2">
               <div className="bg-eburon-500 h-1 w-[12%]"></div>
             </div>
             <div className="flex justify-between mb-1">
               <span>MEM</span>
               <span className="text-eburon-400">48%</span>
             </div>
             <div className="w-full bg-black h-1">
               <div className="bg-eburon-500 h-1 w-[48%]"></div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative flex flex-col">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none z-0"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1c2e_1px,transparent_1px),linear-gradient(to_bottom,#1c1c2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0"></div>
        
        <div className="relative z-10 flex-1 h-full">
          {children}
        </div>
      </main>
    </div>
  );
};
