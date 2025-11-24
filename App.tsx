import React, { useState, useMemo } from 'react';
import { ConfigPanel } from './components/ConfigPanel';
import { PreviewCard } from './components/PreviewCard';
import { YamlViewer } from './components/YamlViewer';
import { MagicBuilder } from './components/MagicBuilder';
import { ButtonConfig, DEFAULT_CONFIG } from './types';
import { generateYaml } from './utils/yamlGenerator';
import { Wand2, Eye } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<ButtonConfig>(DEFAULT_CONFIG);
  const [isMagicOpen, setIsMagicOpen] = useState(false);

  const yamlOutput = useMemo(() => generateYaml(config), [config]);

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden selection:bg-blue-500/30">
      {/* Header */}
      <header className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-xs">
            BB
          </div>
          <h1 className="font-bold text-lg tracking-tight text-gray-200">Button Builder</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMagicOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-medium transition-all group"
          >
            <Wand2 size={14} className="group-hover:rotate-12 transition-transform" />
            Magic Build
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left: Configuration */}
        <aside className="w-80 shrink-0 z-10 shadow-xl bg-gray-900 border-r border-gray-800">
          <ConfigPanel config={config} setConfig={setConfig} />
        </aside>

        {/* Center: Workspace */}
        <section className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex">
            {/* Middle: Preview Canvas */}
            <div className="flex-1 bg-[#0a0a0a] relative flex flex-col">
              {/* Background grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px] opacity-50 pointer-events-none" />
              
              <div className="absolute top-0 left-0 z-10 px-6 py-3 flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wider border-b border-gray-800/50 bg-black/20 w-full backdrop-blur-sm">
                <Eye size={14} />
                Live Preview
              </div>

              {/* Content Container - fills space, lets PreviewCard handle centering */}
              <div className="flex-1 relative overflow-hidden">
                <PreviewCard config={config} />
              </div>
            </div>

            {/* Right: YAML Output */}
            <div className="w-96 border-l border-gray-800 bg-[#111] flex flex-col shrink-0">
               {/* Simplified container to ensure full height scrolling */}
              <div className="flex-1 overflow-hidden flex flex-col p-4">
                <YamlViewer yaml={yamlOutput} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <MagicBuilder 
        isOpen={isMagicOpen} 
        onClose={() => setIsMagicOpen(false)}
        onApply={(newConfig) => setConfig(prev => ({ ...prev, ...newConfig }))}
      />
    </div>
  );
};

export default App;