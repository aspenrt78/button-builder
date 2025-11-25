import React, { useState, useMemo } from 'react';
import { Copy, Check, Download } from 'lucide-react';

interface Props {
  yaml: string;
  className?: string;
}

// Simple YAML syntax highlighter
const highlightYaml = (yaml: string): React.ReactNode[] => {
  return yaml.split('\n').map((line, i) => {
    // Comment lines
    if (line.trim().startsWith('#')) {
      return <span key={i} className="text-gray-500 italic">{line}{'\n'}</span>;
    }
    
    // Key-value pairs
    const keyMatch = line.match(/^(\s*)([a-zA-Z_][a-zA-Z0-9_-]*)(:)/);
    if (keyMatch) {
      const [, indent, key, colon] = keyMatch;
      const rest = line.slice(keyMatch[0].length);
      
      // Check for different value types
      let valueElement: React.ReactNode = rest;
      
      // Boolean values
      if (/^\s*(true|false)\s*$/.test(rest)) {
        valueElement = <span className="text-orange-400">{rest}</span>;
      }
      // Numbers
      else if (/^\s*-?\d+\.?\d*\s*$/.test(rest)) {
        valueElement = <span className="text-cyan-400">{rest}</span>;
      }
      // Quoted strings
      else if (/^\s*["'].*["']\s*$/.test(rest)) {
        valueElement = <span className="text-yellow-300">{rest}</span>;
      }
      // Template expressions [[[...]]]
      else if (rest.includes('[[[')) {
        valueElement = <span className="text-purple-400">{rest}</span>;
      }
      // URLs/paths
      else if (/^\s*(\/|http|mdi:)/.test(rest)) {
        valueElement = <span className="text-blue-400">{rest}</span>;
      }
      // Other string values
      else if (rest.trim()) {
        valueElement = <span className="text-green-300">{rest}</span>;
      }
      
      return (
        <span key={i}>
          {indent}
          <span className="text-pink-400">{key}</span>
          <span className="text-gray-400">{colon}</span>
          {valueElement}
          {'\n'}
        </span>
      );
    }
    
    // Array items (- value)
    const arrayMatch = line.match(/^(\s*)(-)(\s+)(.*)$/);
    if (arrayMatch) {
      const [, indent, dash, space, value] = arrayMatch;
      return (
        <span key={i}>
          {indent}
          <span className="text-gray-500">{dash}</span>
          {space}
          <span className="text-green-300">{value}</span>
          {'\n'}
        </span>
      );
    }
    
    // Default - plain text
    return <span key={i}>{line}{'\n'}</span>;
  });
};

export const YamlViewer: React.FC<Props> = ({ yaml, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const highlightedYaml = useMemo(() => highlightYaml(yaml), [yaml]);

  const handleCopy = () => {
    navigator.clipboard.writeText(yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'button-card-config.yaml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex flex-col h-full min-h-0 bg-[#1e1e1e] text-gray-300 rounded-lg border border-gray-700 shadow-xl ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-700 shrink-0">
        <span className="text-xs font-mono text-gray-400">button-card-config.yaml</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded"
            title="Download YAML"
          >
            <Download size={14} />
          </button>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 text-xs hover:text-white transition-colors"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      <pre className="flex-1 p-4 text-sm font-mono overflow-y-auto overflow-x-auto custom-scrollbar leading-relaxed whitespace-pre min-h-0">
        {highlightedYaml}
      </pre>
    </div>
  );
};