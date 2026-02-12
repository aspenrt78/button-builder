// Bubble Card YAML Viewer Component

import React, { useState } from 'react';

interface YamlViewerProps {
  yaml: string;
}

export function BubbleYamlViewer({ yaml }: YamlViewerProps) {
  const [copied, setCopied] = useState(false);

  const copyText = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Fallback below.
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

  // Simple syntax highlighting
  const highlightYaml = (code: string) => {
    return code.split('\n').map((line, i) => {
      // Highlight keys
      let highlighted = line.replace(
        /^(\s*)([a-z_]+)(:)/gi,
        '$1<span class="text-cyan-400">$2</span><span class="text-gray-400">$3</span>'
      );
      
      // Highlight values
      highlighted = highlighted.replace(
        /: (.+)$/,
        ': <span class="text-green-400">$1</span>'
      );
      
      // Highlight comments
      highlighted = highlighted.replace(
        /(#.*)$/,
        '<span class="text-gray-500">$1</span>'
      );
      
      // Highlight list markers
      highlighted = highlighted.replace(
        /^(\s*)(-)(\s)/,
        '$1<span class="text-yellow-400">$2</span>$3'
      );
      
      // Highlight booleans
      highlighted = highlighted.replace(
        /\b(true|false)\b/g,
        '<span class="text-purple-400">$1</span>'
      );
      
      // Highlight numbers
      highlighted = highlighted.replace(
        /: (\d+)/g,
        ': <span class="text-orange-400">$1</span>'
      );

      return (
        <div 
          key={i} 
          className="leading-relaxed"
          dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }}
        />
      );
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-gray-700 shrink-0">
        <span className="text-xs text-gray-400">Generated YAML</span>
        <button
          onClick={handleCopy}
          className={`
            text-xs px-3 py-1 rounded transition-colors
            ${copied 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }
          `}
        >
          {copied ? '✓ Copied!' : 'Copy YAML'}
        </button>
      </div>

      {/* YAML Content */}
      <div className="flex-1 overflow-auto p-3">
        <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
          {highlightYaml(yaml)}
        </pre>
      </div>

      {/* Footer Info */}
      <div className="p-2 border-t border-gray-700 shrink-0">
        <p className="text-xs text-gray-500">
          Paste this YAML into your Home Assistant dashboard card configuration.
        </p>
      </div>
    </div>
  );
}

export default BubbleYamlViewer;
