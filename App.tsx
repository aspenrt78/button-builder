// Main App - Card Type Selector Wrapper
// Allows switching between Button Card Builder and Bubble Card Builder

import React, { useState, useEffect } from 'react';
import { ButtonCardApp } from './ButtonCardApp';
import { BubbleCardApp } from './bubble-card/BubbleCardApp';
import { Layers } from 'lucide-react';

type CardType = 'button-card' | 'bubble-card';

const CARD_TYPE_STORAGE_KEY = 'button-builder-card-type';

const loadSavedCardType = (): CardType => {
  try {
    const saved = localStorage.getItem(CARD_TYPE_STORAGE_KEY);
    if (saved === 'button-card' || saved === 'bubble-card') {
      return saved;
    }
  } catch (e) {
    console.warn('Failed to load saved card type:', e);
  }
  return 'button-card';
};

const App: React.FC = () => {
  const [cardType, setCardType] = useState<CardType>(loadSavedCardType);

  useEffect(() => {
    try {
      localStorage.setItem(CARD_TYPE_STORAGE_KEY, cardType);
    } catch (e) {
      console.warn('Failed to save card type:', e);
    }
  }, [cardType]);

  return (
    <div className="h-screen w-screen flex flex-col bg-black text-white overflow-hidden">
      {/* Card Type Selector Header */}
      <div className="shrink-0 h-10 bg-gray-950 border-b border-gray-800 flex items-center justify-center gap-1 px-4">
        <div className="flex items-center gap-2 mr-4">
          <Layers size={16} className="text-gray-500" />
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:inline">Card Type</span>
        </div>
        <div className="flex bg-gray-900 rounded-lg p-0.5 border border-gray-800">
          <button
            onClick={() => setCardType('button-card')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              cardType === 'button-card'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <span className="hidden sm:inline">custom:</span>button-card
          </button>
          <button
            onClick={() => setCardType('bubble-card')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              cardType === 'bubble-card'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <span><span className="hidden sm:inline">custom:</span>bubble-card</span>
            <span className="text-[9px] px-1 py-0.5 rounded bg-amber-500/80 text-amber-950 font-bold uppercase">Beta</span>
          </button>
        </div>
      </div>

      {/* Selected Card Builder */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {cardType === 'button-card' ? (
          <ButtonCardApp />
        ) : (
          <BubbleCardApp />
        )}
      </div>
    </div>
  );
};

export default App;
