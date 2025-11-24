import React from 'react';

interface IntegrationCardProps {
  title: string;
  description: string;
  category: 'DEV' | 'OPS' | 'CRM' | 'BOT';
  status: 'CONNECTED' | 'AVAILABLE' | 'MAINTENANCE';
  icon: React.ReactNode;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ title, description, category, status, icon }) => (
  <div className="bg-[#0a0a0f] border border-eburon-800 p-5 flex flex-col gap-4 hover:border-eburon-500 transition-colors group">
    <div className="flex justify-between items-start">
      <div className="p-3 bg-eburon-900/50 rounded-sm text-eburon-400 border border-eburon-800 group-hover:text-white group-hover:border-eburon-600 transition-colors">
        {icon}
      </div>
      <div className={`px-2 py-1 text-[10px] font-mono font-bold tracking-wider border ${
        status === 'CONNECTED' ? 'bg-green-900/20 text-green-400 border-green-900' :
        status === 'AVAILABLE' ? 'bg-eburon-900/20 text-gray-500 border-eburon-800' :
        'bg-yellow-900/20 text-yellow-500 border-yellow-900'
      }`}>
        {status}
      </div>
    </div>
    
    <div>
      <div className="text-xs text-eburon-500 font-mono tracking-widest mb-1">{category}</div>
      <h3 className="text-lg font-bold text-white font-mono">{title}</h3>
      <p className="text-sm text-gray-500 mt-2 leading-relaxed">{description}</p>
    </div>

    <button className={`mt-auto w-full py-2 px-4 text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
      status === 'CONNECTED' 
        ? 'border-green-900 text-green-500 cursor-default'
        : 'border-eburon-700 text-eburon-400 hover:bg-eburon-500 hover:text-black'
    }`}>
      {status === 'CONNECTED' ? 'Active Uplink' : 'Initialize'}
    </button>
  </div>
);

const Integrations: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-8 border-b border-eburon-800 pb-6">
        <h2 className="text-3xl font-bold font-mono text-white tracking-tighter mb-2">GRID SYNCHRONIZATION</h2>
        <p className="text-eburon-400 font-mono text-xs max-w-2xl">
          EBURON Intelligence Layer > External Modules. 
          Connect external systems to unify Conversation, DevOps, and Robotics workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <IntegrationCard 
          title="Salesforce CRM"
          category="CRM"
          description="Injects customer context (tier, history, sentiment) into live CSR voice sessions for personalized handling."
          status="CONNECTED"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        />
        
        <IntegrationCard 
          title="GitHub Enterprise"
          category="DEV"
          description="Enables Eburon to clone repos, generate PRs, and run CI/CD pipelines autonomously."
          status="AVAILABLE"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
        />

        <IntegrationCard 
          title="Linear"
          category="DEV"
          description="Connects planning intelligence to execution. Eburon can read roadmaps and update ticket status."
          status="AVAILABLE"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
        />

        <IntegrationCard 
          title="ROS2 Bridge"
          category="BOT"
          description="WebSocket uplink to Isaac Sim and physical humanoid fleets. Telemetry streaming and command dispatch."
          status="MAINTENANCE"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
        />

        <IntegrationCard 
          title="AWS / GCP"
          category="OPS"
          description="Infrastructure control plane. Eburon can provision containers and monitor power usage."
          status="AVAILABLE"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
        />

        <IntegrationCard 
          title="Twilio Voice"
          category="CRM"
          description="PSTN termination for global call center operations. SIP trunking into Gemini Live API."
          status="AVAILABLE"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
        />
      </div>
    </div>
  );
};

export default Integrations;