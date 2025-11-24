import React, { useState, useRef, useEffect } from 'react';
import { generateText, generateWithSearch, generateWithMaps, analyzeImage } from '../services/geminiService';
import { ChatMessage, GroundingSource } from '../types';

const IntelCore: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'init', role: 'system', content: 'INTEL CORE ONLINE. READY FOR QUERY OR ANALYSIS.', timestamp: Date.now()
  }]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'STANDARD' | 'SEARCH' | 'MAPS' | 'ANALYZE'>('STANDARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Analysis Image
  const [analysisImg, setAnalysisImg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !analysisImg) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      image: analysisImg || undefined,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAnalysisImg(null); // Clear after send
    setIsProcessing(true);

    try {
      let responseText = '';
      let sources: GroundingSource[] | undefined = undefined;

      if (mode === 'ANALYZE' && userMsg.image) {
        const base64 = userMsg.image.split(',')[1];
        responseText = await analyzeImage(base64, userMsg.content || "Analyze this image.");
      } else if (mode === 'SEARCH') {
        const res = await generateWithSearch(userMsg.content);
        responseText = res.text || "No result.";
        const chunks = res.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
           sources = chunks
             .filter((c: any) => c.web?.uri)
             .map((c: any) => ({ title: c.web.title, uri: c.web.uri, sourceType: 'web' }));
        }
      } else if (mode === 'MAPS') {
        const pos: GeolocationPosition = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const res = await generateWithMaps(userMsg.content, pos.coords.latitude, pos.coords.longitude);
        responseText = res.text || "No result.";
        const chunks = res.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
           sources = chunks
             .filter((c: any) => c.web?.uri)
             .map((c: any) => ({ title: c.web?.title || 'Map Location', uri: c.web?.uri, sourceType: 'map' }));
        }
      } else {
        responseText = await generateText(userMsg.content, true);
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        groundingSources: sources,
        timestamp: Date.now()
      }]);

    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `ERROR: ${err.message}`,
        timestamp: Date.now()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAnalysisImg(ev.target?.result as string);
        setMode('ANALYZE'); // Auto switch
      };
      reader.readAsDataURL(f);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] font-mono text-sm">
      {/* Header / Mode Switcher */}
      <div className="p-4 border-b border-eburon-800 bg-black/80 backdrop-blur flex gap-1 overflow-x-auto z-10">
        {(['STANDARD', 'SEARCH', 'MAPS', 'ANALYZE'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 border text-[10px] font-bold tracking-widest transition-all whitespace-nowrap uppercase ${
              mode === m 
                ? 'bg-eburon-500/10 border-eburon-500 text-eburon-500' 
                : 'bg-transparent border-transparent text-gray-500 hover:text-white hover:border-eburon-800'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] space-y-1 ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
              
              {/* Metadata */}
              <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest px-1">
                {msg.role === 'user' ? 'CMD' : msg.role === 'system' ? 'SYS' : 'EBURON'} 
                <span className="mx-2 opacity-50">|</span> 
                {new Date(msg.timestamp).toLocaleTimeString([], { hour12: false })}
              </div>

              <div className={`p-4 border ${
                msg.role === 'user' 
                  ? 'bg-eburon-900/40 text-gray-100 border-eburon-800' 
                  : msg.role === 'system' 
                    ? 'bg-red-900/10 text-red-400 border-red-900/50'
                    : 'bg-transparent text-eburon-100 border-transparent border-l-eburon-500 pl-4'
              }`}>
                {msg.image && (
                  <img src={msg.image} alt="Attached" className="max-h-48 mb-3 border border-eburon-700 opacity-80" />
                )}
                
                <p className={`whitespace-pre-wrap leading-relaxed ${msg.role === 'model' ? 'font-sans text-gray-300' : ''}`}>
                  {msg.content}
                </p>
              </div>

              {msg.groundingSources && msg.groundingSources.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 pl-4">
                  {msg.groundingSources.map((src, idx) => (
                    <a 
                      key={idx} 
                      href={src.uri} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-1 bg-black border border-eburon-800 hover:border-eburon-500 text-[10px] text-eburon-400 transition-colors uppercase tracking-wider"
                    >
                      <span>{src.sourceType === 'map' ? '⌖' : '↗'}</span>
                      {src.title || "Unknown Source"}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start pl-4">
             <div className="flex items-center gap-2 text-eburon-500 text-xs animate-pulse">
               <div className="w-2 h-2 bg-eburon-500"></div>
               PROCESSING...
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black border-t border-eburon-800">
        {analysisImg && mode === 'ANALYZE' && (
          <div className="mb-2 flex items-center justify-between bg-eburon-900/30 border border-eburon-800 p-2 text-xs">
             <span className="text-eburon-400">IMAGE_BUFFER_LOADED</span>
             <button onClick={() => setAnalysisImg(null)} className="text-red-500 hover:text-white uppercase font-bold text-[10px]">Clear</button>
          </div>
        )}
        <div className="flex gap-0 border border-eburon-700">
          <button 
            onClick={() => fileRef.current?.click()}
            className="p-4 bg-eburon-900/50 hover:bg-eburon-800 text-eburon-500 border-r border-eburon-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </button>
          <input 
            type="file" 
            ref={fileRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFile}
          />
          
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={mode === 'ANALYZE' ? "Analyze visual data..." : "Enter command or query..."}
            className="flex-1 bg-black px-4 text-white focus:outline-none placeholder-gray-700"
          />
          
          <button 
            onClick={handleSend}
            disabled={isProcessing || (!input && !analysisImg)}
            className="p-4 bg-eburon-900/50 hover:bg-eburon-800 text-eburon-500 border-l border-eburon-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntelCore;