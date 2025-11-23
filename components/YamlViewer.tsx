import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Props {
  yaml: string;
}

export const YamlViewer: React.FC<Props> = ({ yaml }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-300 rounded-lg overflow-hidden border border-gray-700 shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-700 shrink-0">
        <span className="text-xs font-mono text-gray-400">button-card-config.yaml</span>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs hover:text-white transition-colors"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy YAML'}
        </button>
      </div>
      <pre className="flex-1 p-4 text-sm font-mono overflow-auto custom-scrollbar text-green-400 leading-relaxed whitespace-pre">
        {yaml}
      </pre>
    </div>
  );
};