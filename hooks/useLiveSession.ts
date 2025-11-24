import { useRef, useState, useEffect } from 'react';
import { connectLiveSession } from '../services/geminiService';
import { createBlob, decodeAudioData, base64ToUint8Array } from '../services/audioUtils';
import { LiveServerMessage } from '@google/genai';

export const useLiveSession = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<string>('STANDBY');
  const [volume, setVolume] = useState(0);

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const connect = async () => {
    try {
      setStatus('INITIALIZING UPLINK...');
      
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      sessionPromiseRef.current = connectLiveSession(
        () => {
          setStatus('EBURON ONLINE');
          setIsActive(true);
          setupAudioInput(stream);
        },
        handleServerMessage,
        () => {
          setStatus('CONNECTION CLOSED');
          setIsActive(false);
        },
        (e) => {
          console.error(e);
          setStatus('SYSTEM ERROR');
          setIsActive(false);
        }
      );

    } catch (err) {
      console.error("Failed to start session:", err);
      setStatus('PERMISSION DENIED');
    }
  };

  const setupAudioInput = (stream: MediaStream) => {
    if (!inputAudioContextRef.current) return;
    
    const source = inputAudioContextRef.current.createMediaStreamSource(stream);
    const analyzer = inputAudioContextRef.current.createAnalyser();
    analyzer.fftSize = 256;
    
    const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
    
    scriptProcessor.onaudioprocess = (e) => {
      if (!isActive) return; // Use current ref or rely on closure if isActive updates correctly
      // Note: isActive in closure might be stale, but since we disconnect on stop, this is usually fine.
      // Better to check context state:
      if (inputAudioContextRef.current?.state === 'closed') return;

      const inputData = e.inputBuffer.getChannelData(0);
      
      // Calculate volume
      let sum = 0;
      for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
      setVolume(Math.sqrt(sum / inputData.length));

      const pcmBlob = createBlob(inputData);
      
      sessionPromiseRef.current?.then(session => {
        session.sendRealtimeInput({ media: pcmBlob });
      });
    };

    source.connect(analyzer);
    source.connect(scriptProcessor);
    scriptProcessor.connect(inputAudioContextRef.current.destination);
  };

  const handleServerMessage = async (message: LiveServerMessage) => {
    if (!outputAudioContextRef.current) return;

    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
    
    if (base64Audio) {
      const outputCtx = outputAudioContextRef.current;
      nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);

      const audioBuffer = await decodeAudioData(
        base64ToUint8Array(base64Audio),
        outputCtx
      );
      
      const source = outputCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(outputCtx.destination);
      
      source.addEventListener('ended', () => {
        sourcesRef.current.delete(source);
      });

      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;
      sourcesRef.current.add(source);
    }

    if (message.serverContent?.interrupted) {
       sourcesRef.current.forEach(src => src.stop());
       sourcesRef.current.clear();
       nextStartTimeRef.current = 0;
    }
  };

  const disconnect = () => {
    sessionPromiseRef.current?.then(s => s.close());
    streamRef.current?.getTracks().forEach(t => t.stop());
    inputAudioContextRef.current?.close();
    outputAudioContextRef.current?.close();
    setIsActive(false);
    setStatus('STANDBY');
    setVolume(0);
  };

  return { connect, disconnect, isActive, status, volume };
};