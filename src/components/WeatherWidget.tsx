import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherWidgetProps {
  className?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ className = '' }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate weather data (in a real app, you'd fetch from an API)
    const fetchWeather = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock weather data
        const mockWeather: WeatherData = {
          temperature: Math.floor(Math.random() * 30) + 10, // 10-40°C
          condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
          location: 'Your Location',
          icon: 'sun'
        };
        
        setWeather(mockWeather);
        setError(null);
      } catch (err) {
        setError('Failed to load weather');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="w-6 h-6 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="w-6 h-6 text-blue-500" />;
      case 'snowy':
        return <CloudSnow className="w-6 h-6 text-blue-300" />;
      default:
        return <Sun className="w-6 h-6 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded mb-2"></div>
          <div className="h-6 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 ${className}`}>
        <div className="flex items-center space-x-2 text-white/80">
          <Wind className="w-5 h-5" />
          <span className="text-sm">Weather unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between text-white">
        <div>
          <div className="text-2xl font-bold">{weather.temperature}°</div>
          <div className="text-sm text-white/80">{weather.condition}</div>
        </div>
        <div className="flex flex-col items-center">
          {getWeatherIcon(weather.condition)}
          <div className="text-xs text-white/60 mt-1">{weather.location}</div>
        </div>
      </div>
    </div>
  );
};