// Tile Card YAML Viewer Component

import React from 'react';
import { FileCode } from 'lucide-react';

interface Props {
  yaml: string;
}

export const YamlViewer: React.FC<Props> = ({ yaml }) => {
  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 border-b border-gray-800 flex items-center gap-2">
        <FileCode size={16} className="text-gray-500" />
        <span className="text-sm font-semibold text-gray-300">Generated YAML</span>
      </div>

      {/* YAML Content */}
      <div className="flex-1 overflow-auto p-4">
        <pre className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
          {yaml || '# Configure your tile card to see YAML output'}
        </pre>
      </div>
    </div>
  );
};
