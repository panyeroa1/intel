import React, { useRef, useEffect } from 'react';

interface VoiceVisualizerProps {
  isActive: boolean;
  volume: number;
}

const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ isActive, volume }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  const drawVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Eburon Eye Effect
    const radius = 50 + (volume * 150); // increased sensitivity
    
    // Outer Glow
    const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius * 1.5);
    gradient.addColorStop(0, isActive ? 'rgba(59, 130, 246, 0.4)' : 'rgba(100,100,100, 0.1)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.5, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Core Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, isActive ? 40 + (volume * 30) : 40, 0, 2 * Math.PI);
    ctx.strokeStyle = isActive ? '#06b6d4' : '#333';
    ctx.lineWidth = isActive ? 3 : 1;
    ctx.stroke();

    // Pupil
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = isActive ? '#fff' : '#333';
    ctx.fill();
    
    // Tech lines (Scanning)
    if (isActive) {
       ctx.beginPath();
       ctx.moveTo(0, centerY);
       ctx.lineTo(canvas.width, centerY);
       ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
       ctx.lineWidth = 1;
       ctx.stroke();
    }

    animationRef.current = requestAnimationFrame(drawVisualizer);
  };

  useEffect(() => {
    drawVisualizer();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, volume]);

  return (
    <canvas 
      ref={canvasRef} 
      width={800} 
      height={450} 
      className="w-full h-full absolute inset-0 object-cover"
    />
  );
};

export default VoiceVisualizer;