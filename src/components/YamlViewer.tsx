import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, FileCode2, X } from 'lucide-react';
import { ButtonConfig } from '../types';
import { generateGlobalTemplate } from '../utils/yamlGenerator';

interface Props {
  yaml: string;
  className?: string;
  config?: ButtonConfig;
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

export const YamlViewer: React.FC<Props> = ({ yaml, className = '', config }) => {
  const [copied, setCopied] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState('custom_style');
  const [templateCopied, setTemplateCopied] = useState(false);

  const highlightedYaml = useMemo(() => highlightYaml(yaml), [yaml]);
  
  const globalTemplate = useMemo(() => {
    if (!config) return '';
    return generateGlobalTemplate(config, templateName);
  }, [config, templateName]);

  const copyText = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Fall through to execCommand fallback.
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  };

  const handleCopy = async () => {
    const ok = await copyText(yaml);
    if (!ok) return;
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

  const handleCopyTemplate = async () => {
    const ok = await copyText(globalTemplate);
    if (!ok) return;
    setTemplateCopied(true);
    setTimeout(() => setTemplateCopied(false), 2000);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([globalTemplate], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName}-template.yaml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex flex-col h-full min-h-0 bg-[#1e1e1e] text-gray-300 rounded-lg border border-gray-700 shadow-xl ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-700 shrink-0">
        <span className="text-xs font-mono text-gray-400">button-card-config.yaml</span>
        <div className="flex items-center gap-2">
          {config && (
            <button 
              onClick={() => setShowTemplateModal(true)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-purple-400 transition-colors p-1 hover:bg-gray-700 rounded"
              title="Create Global Template"
            >
              <FileCode2 size={14} />
              <span className="hidden sm:inline">Global Template</span>
            </button>
          )}
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
      
      {/* Global Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] rounded-lg border border-gray-700 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-gray-700 rounded-t-lg">
              <div className="flex items-center gap-2">
                <FileCode2 size={18} className="text-purple-400" />
                <span className="font-medium">Create Global Template</span>
              </div>
              <button 
                onClick={() => setShowTemplateModal(false)}
                className="text-gray-400 hover:text-white p-1 hover:bg-gray-700 rounded"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 border-b border-gray-700">
              <p className="text-sm text-gray-400 mb-2">
                This creates a reusable template. <strong className="text-yellow-400">Important:</strong> Add this to the <em>top level</em> of your dashboard's raw YAML config.
              </p>
              <p className="text-xs text-gray-500 mb-3">
                In your dashboard: ⋮ menu → Edit Dashboard → ⋮ menu → Raw configuration editor. Paste the <code className="bg-gray-800 px-1 rounded">button_card_templates:</code> section at the top (before <code className="bg-gray-800 px-1 rounded">views:</code>). Then use <code className="bg-gray-800 px-1 rounded">template: {templateName}</code> in any button card.
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Template Name:</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value.replace(/\s+/g, '_'))}
                  className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:border-purple-500 focus:outline-none"
                  placeholder="custom_style"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-4 min-h-0">
              <pre className="text-sm font-mono bg-[#0d0d0d] p-4 rounded border border-gray-800 overflow-x-auto whitespace-pre">
                {highlightYaml(globalTemplate)}
              </pre>
            </div>
            
            <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-t border-gray-700 rounded-b-lg">
              <p className="text-xs text-gray-500">
                ⚠️ Must be at top level of dashboard YAML (before views:), not inside a card
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadTemplate}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  <Download size={14} />
                  Download
                </button>
                <button
                  onClick={handleCopyTemplate}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-500 text-white rounded transition-colors"
                >
                  {templateCopied ? <Check size={14} /> : <Copy size={14} />}
                  {templateCopied ? 'Copied!' : 'Copy Template'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
