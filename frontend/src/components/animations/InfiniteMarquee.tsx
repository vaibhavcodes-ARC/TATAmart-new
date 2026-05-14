import React from 'react';

interface InfiniteMarqueeProps {
  items: React.ReactNode[];
  speed?: number; // duration in seconds
  pauseOnHover?: boolean;
  className?: string;
}

export default function InfiniteMarquee({
  items,
  speed = 30,
  pauseOnHover = true,
  className = ''
}: InfiniteMarqueeProps) {
  return (
    <div className={`relative overflow-hidden w-full ${className}`}>
      {/* Gradient fades */}
      <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-white dark:from-[#09090b] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-white dark:from-[#09090b] to-transparent z-10 pointer-events-none"></div>
      
      <div 
        className={`flex w-max animate-infinite-marquee ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {/* Render double for seamless loop */}
        <div className="flex gap-12 px-6 items-center">
          {items.map((item, i) => (
            <div key={`first-${i}`} className="shrink-0">{item}</div>
          ))}
        </div>
        <div className="flex gap-12 px-6 items-center">
          {items.map((item, i) => (
            <div key={`second-${i}`} className="shrink-0">{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
