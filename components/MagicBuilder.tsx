import React, { useState } from 'react';
import { Wand2, X, Loader2, Sparkles, Key, ExternalLink, Trash2 } from 'lucide-react';
import { generateButtonConfig, hasApiKey, setApiKey, getApiKey, clearApiKey } from '../services/geminiService';
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
  const [showApiKeyInput, setShowApiKeyInput] = useState(!hasApiKey());
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKeyManagement, setShowKeyManagement] = useState(false);

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
      if (errorMessage === 'API_KEY_REQUIRED') {
        setShowApiKeyInput(true);
        setError('');
      } else if (errorMessage.includes('API key') || errorMessage.includes('401') || errorMessage.includes('403') || errorMessage.includes('leaked')) {
        setError('Invalid API key. Please check your key and try again.');
        setShowApiKeyInput(true);
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

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setShowApiKeyInput(false);
      setApiKeyInput('');
      setError('');
    }
  };

  const handleRemoveApiKey = () => {
    clearApiKey();
    setShowApiKeyInput(true);
    setShowKeyManagement(false);
  };

  const maskedKey = () => {
    const key = getApiKey();
    if (!key) return '';
    return key.substring(0, 8) + '...' + key.substring(key.length - 4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 w-full max-w-lg rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 flex items-center gap-2">
            <Sparkles size={20} className="text-purple-400" />
            Magic Architect
          </h3>
          <div className="flex items-center gap-2">
            {hasApiKey() && !showApiKeyInput && (
              <button 
                onClick={() => setShowKeyManagement(!showKeyManagement)}
                className="text-gray-500 hover:text-gray-300 p-1"
                title="API Key Settings"
              >
                <Key size={16} />
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {showApiKeyInput ? (
            // API Key Setup View
            <>
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Key size={32} className="text-purple-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Set Up AI Magic</h4>
                <p className="text-gray-400 text-sm">
                  To use AI-powered button generation, you'll need a free Gemini API key from Google.
                </p>
              </div>
              
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors text-sm font-medium"
              >
                <ExternalLink size={16} />
                Get Free API Key from Google AI Studio
              </a>
              
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-wider">Paste your API key</label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none placeholder-gray-600 font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  Your key is stored locally in your browser and never sent to our servers.
                </p>
              </div>
              
              {error && (
                <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
                  <p className="text-red-400 text-xs">{error}</p>
                </div>
              )}
            </>
          ) : showKeyManagement ? (
            // Key Management View
            <div className="py-4">
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Current API Key</p>
                    <p className="text-sm font-mono text-gray-300">{maskedKey()}</p>
                  </div>
                  <button
                    onClick={handleRemoveApiKey}
                    className="flex items-center gap-1 px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors text-sm"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowKeyManagement(false)}
                className="mt-4 text-sm text-gray-400 hover:text-white"
              >
                ← Back to Magic Builder
              </button>
            </div>
          ) : (
            // Main Builder View
            <>
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
            </>
          )}
        </div>

        <div className="p-6 bg-gray-800/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
          >
            Cancel
          </button>
          {showApiKeyInput ? (
            <button 
              onClick={handleSaveApiKey}
              disabled={!apiKeyInput.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-900/20"
            >
              <Key size={16} />
              Save API Key
            </button>
          ) : !showKeyManagement && (
            <button 
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-900/20"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
              {loading ? 'Designing...' : 'Generate Design'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
