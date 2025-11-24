import React, { useEffect } from 'react';
import { useLiveSession } from '../hooks/useLiveSession';
import VoiceVisualizer from './VoiceVisualizer';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceModal: React.FC<VoiceModalProps> = ({ isOpen, onClose }) => {
  const { connect, disconnect, isActive, status, volume } = useLiveSession();

  useEffect(() => {
    if (isOpen) {
      connect();
    } else {
      disconnect();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl aspect-video bg-black border border-eburon-800 rounded-lg overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.2)]">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 pointer-events-none">
          <div>
            <h2 className="text-2xl font-mono font-bold text-white tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-eburon-500 animate-pulse"></span>
              LIVE UPLINK
            </h2>
            <p className="text-eburon-400 font-mono text-xs mt-1">{status}</p>
          </div>
          <button 
            onClick={onClose}
            className="pointer-events-auto px-4 py-2 bg-eburon-900/80 border border-eburon-800 text-gray-400 hover:text-white hover:border-eburon-500 font-mono text-xs uppercase tracking-widest transition-all"
          >
            Terminate
          </button>
        </div>

        {/* Visualizer */}
        <VoiceVisualizer isActive={isActive} volume={volume} />

        {/* Overlay Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
    </div>
  );
};

export default VoiceModal;