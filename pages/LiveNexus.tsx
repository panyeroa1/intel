import React, { useEffect, useRef } from 'react';
import { useLiveSession } from '../hooks/useLiveSession';
import VoiceVisualizer from '../components/VoiceVisualizer';

const LiveNexus: React.FC = () => {
  const { connect, disconnect, isActive, status, volume } = useLiveSession();
  
  // Audio Engine Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Initialize Ambient Sound Engine (Generative Audio)
  useEffect(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // Master Gain (Volume Control)
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0; // Start silent
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Layer 1: The "Reactor" (Low Frequency Hum)
      const oscLow = ctx.createOscillator();
      oscLow.type = 'sine';
      oscLow.frequency.value = 55; // A1 approx, deep hum
      const gainLow = ctx.createGain();
      gainLow.gain.value = 0.8;
      oscLow.connect(gainLow);
      gainLow.connect(masterGain);

      // Layer 2: The "Data Stream" (High Ethereal Shimmer)
      const oscHigh = ctx.createOscillator();
      oscHigh.type = 'triangle';
      oscHigh.frequency.value = 400; 
      const gainHigh = ctx.createGain();
      gainHigh.gain.value = 0.05; // Very subtle

      // LFO to modulate the high layer (Drifting effect)
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.15; // Slow drift
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 50; // Modulate frequency by +/- 50Hz
      
      lfo.connect(lfoGain);
      lfoGain.connect(oscHigh.frequency);
      
      oscHigh.connect(gainHigh);
      gainHigh.connect(masterGain);

      // Start Generators
      oscLow.start();
      oscHigh.start();
      lfo.start();

      return () => {
        oscLow.stop();
        oscHigh.stop();
        lfo.stop();
        ctx.close();
      };
    } catch (e) {
      console.warn("Audio Context failed to initialize", e);
    }
  }, []);

  // Manage Audio State based on Connection
  useEffect(() => {
    if (!audioContextRef.current || !masterGainRef.current) return;

    const ctx = audioContextRef.current;
    const gain = masterGainRef.current;

    if (isActive) {
      // Resume context (browsers often suspend until user interaction)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      // Fade In
      gain.gain.setTargetAtTime(0.06, ctx.currentTime, 1.5);
    } else {
      // Fade Out
      gain.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
    }
  }, [isActive]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-eburon-900 to-black relative overflow-hidden">
      {/* Decorative background elements for "clean room" feel */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      
      <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
        <div>
          <h2 className="text-4xl font-bold font-mono text-white tracking-widest mb-2 flex items-center justify-center gap-3">
            <span className={`w-3 h-3 rounded-sm ${isActive ? 'bg-eburon-500 animate-pulse' : 'bg-gray-800'}`}></span>
            LIVE NEXUS
          </h2>
          <p className="text-eburon-400 font-mono text-sm tracking-wider uppercase">{status}</p>
        </div>

        <div className={`relative w-full aspect-video bg-eburon-800/30 rounded-sm border flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-700 ${isActive ? 'border-eburon-500 shadow-[0_0_50px_rgba(59,130,246,0.2)]' : 'border-eburon-800'}`}>
           <VoiceVisualizer isActive={isActive} volume={volume} />
           
           {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
                <div className="flex flex-col items-center gap-4 text-gray-600">
                  <svg className="w-16 h-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <span className="font-mono text-xs uppercase tracking-[0.2em]">Uplink Standby</span>
                </div>
              </div>
           )}
           
           {/* Tech Overlay lines */}
           <div className="absolute inset-0 pointer-events-none border-2 border-eburon-900/50 m-2 rounded-sm"></div>
           <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-eburon-500 opacity-50"></div>
           <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-eburon-500 opacity-50"></div>
           <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-eburon-500 opacity-50"></div>
           <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-eburon-500 opacity-50"></div>
        </div>

        <div className="flex gap-4 justify-center">
          {!isActive ? (
            <button 
              onClick={connect}
              className="px-10 py-4 bg-eburon-500 hover:bg-eburon-400 text-black font-bold rounded-sm transition-all active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] flex items-center gap-3 font-mono text-sm tracking-widest uppercase"
            >
              <span>Initialize Uplink</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </button>
          ) : (
            <button 
              onClick={disconnect}
              className="px-10 py-4 bg-transparent hover:bg-red-900/20 border border-red-500/50 hover:border-red-500 text-red-400 font-bold rounded-sm transition-all active:scale-95 font-mono text-sm tracking-widest uppercase shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              Terminate Sequence
            </button>
          )}
        </div>

        <div className="text-[10px] text-gray-600 font-mono mt-8 uppercase tracking-widest opacity-60">
          SECURE CONNECTION // PROTOCOL: GEMINI-2.5-LIVE // AUDIO: BINAURAL
        </div>
      </div>
    </div>
  );
};

export default LiveNexus;