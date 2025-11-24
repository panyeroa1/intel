import React, { useState, useRef } from 'react';
import { generateImagePro, editImage } from '../services/geminiService';
import { ImageGenConfig } from '../types';

const VisualForge: React.FC = () => {
  const [mode, setMode] = useState<'GENERATE' | 'EDIT'>('GENERATE');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Configs
  const [aspectRatio, setAspectRatio] = useState<ImageGenConfig['aspectRatio']>('1:1');
  const [size, setSize] = useState<ImageGenConfig['size']>('1K');
  
  // File Input for Edit
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const result = evt.target?.result as string;
        setUploadedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAction = async () => {
    if (!prompt) return;
    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      if (mode === 'GENERATE') {
        const url = await generateImagePro(prompt, { size, aspectRatio });
        if (url) setResultImage(url);
        else throw new Error("No image generated");
      } else {
        if (!uploadedImage) throw new Error("Source required");
        const base64Data = uploadedImage.split(',')[1];
        const url = await editImage(base64Data, prompt);
        if (url) setResultImage(url);
        else throw new Error("Edit failed");
      }
    } catch (e: any) {
      setError(e.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row p-6 gap-6">
      {/* Control Panel */}
      <div className="w-full lg:w-96 bg-[#0a0a0f] border-r border-eburon-800 p-6 flex flex-col gap-6 lg:-my-6 lg:-ml-6 lg:z-10">
        <h2 className="text-xl font-mono font-bold text-white tracking-tighter flex items-center gap-2">
          <span className="text-eburon-500">/</span> VISUAL FORGE
        </h2>
        
        {/* Mode Switch */}
        <div className="flex bg-eburon-900/50 p-1 border border-eburon-800">
          <button 
            onClick={() => setMode('GENERATE')}
            className={`flex-1 py-2 text-[10px] font-bold font-mono uppercase tracking-wider transition-all ${mode === 'GENERATE' ? 'bg-eburon-500 text-black' : 'text-gray-500 hover:text-white'}`}
          >
            Generate
          </button>
          <div className="w-[1px] bg-eburon-800 my-1 mx-1"></div>
          <button 
            onClick={() => setMode('EDIT')}
            className={`flex-1 py-2 text-[10px] font-bold font-mono uppercase tracking-wider transition-all ${mode === 'EDIT' ? 'bg-eburon-500 text-black' : 'text-gray-500 hover:text-white'}`}
          >
            Edit
          </button>
        </div>

        {/* Dynamic Controls */}
        {mode === 'GENERATE' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
            <div>
              <label className="block text-[10px] font-mono font-bold text-eburon-400 mb-2 uppercase tracking-widest">Format</label>
              <div className="grid grid-cols-4 gap-1">
                {['1:1', '16:9', '9:16', '4:3', '3:4', '2:3', '3:2', '21:9'].map(ar => (
                  <button 
                    key={ar} 
                    onClick={() => setAspectRatio(ar as any)}
                    className={`text-[10px] py-2 border font-mono transition-colors ${aspectRatio === ar ? 'border-eburon-500 text-eburon-500 bg-eburon-900/30' : 'border-eburon-800 text-gray-600 hover:border-gray-600'}`}
                  >
                    {ar}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-eburon-400 mb-2 uppercase tracking-widest">Quality</label>
              <div className="flex gap-1">
                {['1K', '2K', '4K'].map(s => (
                  <button 
                    key={s}
                    onClick={() => setSize(s as any)}
                    className={`flex-1 py-2 border font-mono text-[10px] transition-colors ${size === s ? 'border-eburon-500 text-eburon-500 bg-eburon-900/30' : 'border-eburon-800 text-gray-600 hover:border-gray-600'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {mode === 'EDIT' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="border border-dashed border-eburon-700 bg-eburon-900/20 h-32 flex items-center justify-center cursor-pointer hover:border-eburon-500 hover:bg-eburon-900/40 transition-all relative overflow-hidden group"
             >
               {uploadedImage ? (
                 <>
                   <img src={uploadedImage} alt="Source" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity grayscale hover:grayscale-0" />
                   <div className="absolute top-2 right-2 bg-eburon-500 text-black text-[10px] font-bold px-2 py-0.5 font-mono">SOURCE</div>
                 </>
               ) : (
                 <div className="text-center p-4">
                   <div className="text-eburon-500 mb-2">⊕</div>
                   <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Load Source Bitmap</p>
                 </div>
               )}
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
             </div>
          </div>
        )}

        {/* Prompt Input */}
        <div className="flex-1 flex flex-col">
          <label className="block text-[10px] font-mono font-bold text-eburon-400 mb-2 uppercase tracking-widest">Directive</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={mode === 'GENERATE' ? "Describe target output..." : "Describe modification..."}
            className="flex-1 w-full bg-black border border-eburon-800 p-3 text-sm text-gray-300 font-mono focus:outline-none focus:border-eburon-500 resize-none placeholder-gray-800"
          />
        </div>

        {/* Action Button */}
        <button 
          onClick={handleAction}
          disabled={loading || (mode === 'EDIT' && !uploadedImage)}
          className={`w-full py-4 font-bold font-mono tracking-widest uppercase text-xs border transition-all ${
            loading 
              ? 'border-gray-800 bg-gray-900 text-gray-600 cursor-wait' 
              : 'border-eburon-500 bg-eburon-500/10 text-eburon-500 hover:bg-eburon-500 hover:text-black'
          }`}
        >
          {loading ? 'Processing...' : 'Execute'}
        </button>
        
        {error && <div className="text-red-500 text-[10px] font-mono p-2 border border-red-900 bg-red-900/10">ERR: {error}</div>}
      </div>

      {/* Output Viewport */}
      <div className="flex-1 bg-[#050508] border border-eburon-800 flex items-center justify-center p-1 relative overflow-hidden group">
        {/* Decorative Grid Lines */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-eburon-800"></div>
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-eburon-800"></div>
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-eburon-800"></div>
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-eburon-800"></div>

        {resultImage ? (
          <img src={resultImage} alt="Generated Output" className="max-w-full max-h-full border border-eburon-900 shadow-[0_0_50px_rgba(0,0,0,0.5)]" />
        ) : (
          <div className="text-center opacity-20">
            <div className="font-mono text-6xl text-eburon-900 font-bold mb-4">NULL</div>
            <p className="font-mono text-xs text-eburon-700 uppercase tracking-[0.2em]">Awaiting Output</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualForge;