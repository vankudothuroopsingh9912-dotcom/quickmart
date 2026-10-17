import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface VoiceNotePlayerProps {
  url: string;
  duration?: number;
  isSender?: boolean;
}

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({ url, duration = 15, isSender = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(url);
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [url]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Generate 20 pseudo-waveform bars
  const waveBars = [
    25, 45, 75, 60, 90, 40, 80, 50, 70, 95, 30, 85, 65, 40, 70, 90, 50, 30, 60, 40
  ];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={`flex items-center gap-3 p-2.5 rounded-2xl min-w-[220px] max-w-xs ${
      isSender ? 'bg-indigo-700/60 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
    }`}>
      <button
        type="button"
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-sm ${
          isSender ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'
        }`}
      >
        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
      </button>

      <div className="flex-1 space-y-1">
        {/* Waveform representation */}
        <div className="flex items-center gap-0.5 h-6">
          {waveBars.map((barHeight, idx) => {
            const barProgress = (idx / waveBars.length) * 100;
            const isPlayed = barProgress <= progress;
            return (
              <div
                key={idx}
                style={{ height: `${barHeight}%` }}
                className={`w-1 rounded-full transition-colors ${
                  isPlayed
                    ? isSender ? 'bg-white' : 'bg-indigo-600'
                    : isSender ? 'bg-white/40' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] opacity-80 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};
