import React, { useState, useEffect } from 'react';

interface AnalogClockProps {
  className?: string;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({ className = '' }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const secondAngle = (time.getSeconds() * 6) - 90; // 6 degrees per second
  const minuteAngle = (time.getMinutes() * 6) + (time.getSeconds() * 0.1) - 90; // 6 degrees per minute + smooth seconds
  const hourAngle = ((time.getHours() % 12) * 30) + (time.getMinutes() * 0.5) - 90; // 30 degrees per hour + smooth minutes

  return (
    <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 ${className}`}>
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 mb-2">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Clock face */}
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="rgba(255, 255, 255, 0.1)"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="2"
            />
            
            {/* Hour markers */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30) - 90;
              const x1 = 50 + 40 * Math.cos(angle * Math.PI / 180);
              const y1 = 50 + 40 * Math.sin(angle * Math.PI / 180);
              const x2 = 50 + 35 * Math.cos(angle * Math.PI / 180);
              const y2 = 50 + 35 * Math.sin(angle * Math.PI / 180);
              
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255, 255, 255, 0.6)"
                  strokeWidth="2"
                />
              );
            })}
            
            {/* Hour hand */}
            <line
              x1="50"
              y1="50"
              x2={50 + 25 * Math.cos(hourAngle * Math.PI / 180)}
              y2={50 + 25 * Math.sin(hourAngle * Math.PI / 180)}
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Minute hand */}
            <line
              x1="50"
              y1="50"
              x2={50 + 35 * Math.cos(minuteAngle * Math.PI / 180)}
              y2={50 + 35 * Math.sin(minuteAngle * Math.PI / 180)}
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            
            {/* Second hand */}
            <line
              x1="50"
              y1="50"
              x2={50 + 38 * Math.cos(secondAngle * Math.PI / 180)}
              y2={50 + 38 * Math.sin(secondAngle * Math.PI / 180)}
              stroke="#ef4444"
              strokeWidth="1"
              strokeLinecap="round"
            />
            
            {/* Center dot */}
            <circle cx="50" cy="50" r="3" fill="white" />
          </svg>
        </div>
        <div className="text-white/80 text-sm">
          {time.toLocaleDateString([], { 
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
};