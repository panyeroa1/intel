import React from 'react';
import { useLiveSession } from '../hooks/useLiveSession';
import VoiceVisualizer from '../components/VoiceVisualizer';

const LiveNexus: React.FC = () => {
  const { connect, disconnect, isActive, status, volume } = useLiveSession();

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-eburon-900 to-black">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div>
          <h2 className="text-4xl font-bold font-mono text-white tracking-widest mb-2">LIVE NEXUS</h2>
          <p className="text-eburon-400 font-mono text-sm">{status}</p>
        </div>

        <div className="relative w-full aspect-video bg-eburon-800/30 rounded-3xl border border-eburon-800 flex items-center justify-center overflow-hidden shadow-2xl">
           <VoiceVisualizer isActive={isActive} volume={volume} />
           
           {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
                <svg className="w-16 h-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
           )}
        </div>

        <div className="flex gap-4 justify-center">
          {!isActive ? (
            <button 
              onClick={connect}
              className="px-8 py-4 bg-eburon-500 hover:bg-eburon-400 text-black font-bold rounded-full transition-transform active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center gap-2 font-mono"
            >
              <span>INITIATE UPLINK</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </button>
          ) : (
            <button 
              onClick={disconnect}
              className="px-8 py-4 bg-red-900/50 hover:bg-red-900 border border-red-500 text-red-100 font-bold rounded-full transition-transform active:scale-95 font-mono"
            >
              TERMINATE
            </button>
          )}
        </div>

        <div className="text-xs text-gray-600 font-mono mt-8">
          Powered by Gemini 2.5 Live API
        </div>
      </div>
    </div>
  );
};

export default LiveNexus;