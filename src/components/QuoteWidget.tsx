import React, { useState, useEffect } from 'react';
import { Quote as QuoteIcon, RefreshCw } from 'lucide-react';
import { Quote } from '../types';

interface QuoteWidgetProps {
  className?: string;
}

const quotes: Quote[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
  { text: "You learn more from failure than from success.", author: "Unknown" },
  { text: "If you are working on something that you really care about, you don't have to be pushed.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
];

export const QuoteWidget: React.FC<QuoteWidgetProps> = ({ className = '' }) => {
  const [currentQuote, setCurrentQuote] = useState<Quote>(quotes[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Set a random quote on mount
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  const refreshQuote = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote(randomQuote);
      setIsRefreshing(false);
    }, 300);
  };

  return (
    <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <QuoteIcon className="w-6 h-6 text-white/60 flex-shrink-0" />
        <button
          onClick={refreshQuote}
          className="text-white/60 hover:text-white transition-colors"
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <blockquote className="text-white mb-3 text-sm leading-relaxed">
        "{currentQuote.text}"
      </blockquote>
      
      <cite className="text-white/70 text-xs font-medium">
        — {currentQuote.author}
      </cite>
    </div>
  );
};