import React, { useState } from 'react';
import { Wand2, X, Loader2, Sparkles } from 'lucide-react';
import { generateButtonConfig } from '../services/geminiService';
import { ButtonConfig } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (config: Partial<ButtonConfig>) => void;
}

export const MagicBuilder: React.FC<Props> = ({ isOpen, onClose, onApply }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const examplePrompts = [
    "Futuristic cyan button for bedroom fan with glow effect",
    "Glassmorphism style for living room lights with purple accent",
    "Minimal dark button for garage door that turns red when open",
    "Elegant gold button for chandelier with soft shadow"
  ];

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    try {
      const config = await generateButtonConfig(prompt);
      onApply(config);
      setPrompt(''); // Clear prompt after successful generation
      onClose();
    } catch (e) {
      console.error('Magic Builder error:', e);
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      if (errorMessage.includes('API key') || errorMessage.includes('401')) {
        setError('Invalid or missing API key. Please configure your Gemini API key.');
      } else if (errorMessage.includes('quota') || errorMessage.includes('429')) {
        setError('API rate limit exceeded. Please try again later.');
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('Failed to generate design. Please try a different description.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 w-full max-w-lg rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 flex items-center gap-2">
            <Sparkles size={20} className="text-purple-400" />
            Magic Architect
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-gray-300 text-sm">
            Describe your ideal button card in plain English. Include details about color, style (e.g., "glassmorphism", "minimal"), and what entity it controls.
          </p>
          
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, i) => (
              <button
                key={i}
                onClick={() => setPrompt(example)}
                className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-full border border-gray-700 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
          
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., A futuristic cyan button for a bedroom fan that glows when on..."
            className="w-full h-32 bg-black/50 border border-gray-700 rounded-lg p-4 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none placeholder-gray-600"
          />
          
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-800/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
          >
            Cancel
          </button>
          <button 
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-900/20"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
            {loading ? 'Designing...' : 'Generate Design'}
          </button>
        </div>
      </div>
    </div>
  );
};
