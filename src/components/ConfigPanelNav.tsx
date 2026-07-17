import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Target, Grid3X3, Palette, Sparkles, MousePointer, Settings, Type, Layout, ToggleRight, Droplets, BoxSelect, Activity, Hand, AlertCircle, Lock, Shield, MessageSquare, Code, Layers, Variable as VariableIcon, Wand2, Gauge, GitBranch, Search, X } from 'lucide-react';

// ============= NAVIGATION TYPES =============
export type SectionId = 
  | 'core' | 'variables' 
  | 'dimensions' | 'visibility' | 'gridLayout'
  | 'colors' | 'glass' | 'borders' | 'animations' | 'typography' | 'thresholdColors' | 'conditionalStyles'
  | 'cardActions' | 'momentaryActions' | 'iconActions'
  | 'confirmation' | 'lock' | 'protect' | 'tooltip' | 'customFields' | 'advancedSettings'
  | 'presetGallery';

export type CategoryId = 'content' | 'appearance' | 'layout' | 'behavior' | 'states' | 'advanced';

interface SectionDef {
  id: SectionId;
  label: string;
  icon: any;
  keywords?: string[];
}

interface CategoryDef {
  id: CategoryId;
  label: string;
  icon: any;
  sections: SectionDef[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: 'content', label: 'Content', icon: Target,
    sections: [
      { id: 'core', label: 'Entity & Content', icon: Type, keywords: ['entity', 'name', 'icon', 'label', 'state', 'picture'] },
      { id: 'visibility', label: 'Visibility', icon: ToggleRight, keywords: ['show name', 'show icon', 'show state', 'show label'] },
      { id: 'tooltip', label: 'Tooltip', icon: MessageSquare, keywords: ['hover', 'hint'] },
    ]
  },
  {
    id: 'appearance', label: 'Appearance', icon: Palette,
    sections: [
      { id: 'presetGallery', label: 'Style Presets', icon: Wand2, keywords: ['theme', 'template'] },
      { id: 'colors', label: 'Colors & Background', icon: Palette, keywords: ['background', 'gradient', 'color', 'opacity'] },
      { id: 'typography', label: 'Typography', icon: Type, keywords: ['font', 'text', 'weight', 'size'] },
      { id: 'borders', label: 'Borders & Corners', icon: BoxSelect, keywords: ['radius', 'outline', 'border'] },
      { id: 'glass', label: 'Glass & Shadow', icon: Droplets, keywords: ['shadow', 'blur', 'depth', 'glassmorphism'] },
      { id: 'animations', label: 'Animation', icon: Activity, keywords: ['motion', 'pulse', 'spin', 'flash', 'hover'] },
    ]
  },
  { 
    id: 'layout', label: 'Layout', icon: Grid3X3,
    sections: [
      { id: 'dimensions', label: 'Dimensions', icon: Layout, keywords: ['width', 'height', 'aspect ratio', 'padding'] },
      { id: 'gridLayout', label: 'Grid & Positioning', icon: Grid3X3, keywords: ['position', 'areas', 'columns', 'rows', 'alignment'] },
    ]
  },
  {
    id: 'behavior', label: 'Behavior', icon: MousePointer,
    sections: [
      { id: 'cardActions', label: 'Tap, Hold & Double Tap', icon: MousePointer, keywords: ['tap', 'hold', 'double', 'navigate', 'service', 'javascript'] },
      { id: 'momentaryActions', label: 'Momentary Actions', icon: Hand, keywords: ['press', 'release'] },
      { id: 'iconActions', label: 'Icon Actions', icon: Target, keywords: ['icon tap', 'icon hold'] },
      { id: 'confirmation', label: 'Confirmation', icon: AlertCircle, keywords: ['confirm'] },
      { id: 'lock', label: 'Lock', icon: Lock, keywords: ['unlock', 'exemption'] },
      { id: 'protect', label: 'PIN & Protection', icon: Shield, keywords: ['pin', 'password', 'protect'] },
    ]
  },
  {
    id: 'states', label: 'States', icon: Layers,
    sections: [
      { id: 'conditionalStyles', label: 'State-based Styling', icon: GitBranch, keywords: ['condition', 'operator', 'state style', 'conditional'] },
      { id: 'thresholdColors', label: 'Threshold Colors', icon: Gauge, keywords: ['threshold', 'temperature', 'battery', 'range'] },
    ]
  },
  { 
    id: 'advanced', label: 'Advanced', icon: Settings,
    sections: [
      { id: 'variables', label: 'Variables', icon: VariableIcon, keywords: ['variable', 'template'] },
      { id: 'customFields', label: 'Custom Fields', icon: Code, keywords: ['custom field', 'slot'] },
      { id: 'advancedSettings', label: 'Raw CSS & Advanced', icon: Settings, keywords: ['css', 'extra styles', 'javascript', 'template', 'raw'] },
    ]
  },
];

export type NavState = 
  | { level: 'categories' }
  | { level: 'sections'; categoryId: CategoryId }
  | { level: 'content'; categoryId: CategoryId; sectionId: SectionId };

interface NavHeaderProps {
  nav: NavState;
  goBack: () => void;
  activePreset?: { name: string } | null;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  advancedMode: boolean;
  onAdvancedModeChange: (enabled: boolean) => void;
}

const AdvancedModeToggle: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
  <div className="ml-auto flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
    Advanced
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative h-5 w-9 rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-700'}`}
    >
      <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-4' : ''}`} />
    </button>
  </div>
);

export const NavHeader: React.FC<NavHeaderProps> = ({ nav, goBack, activePreset, searchQuery = '', onSearchChange, advancedMode, onAdvancedModeChange }) => {
  const currentCategory = nav.level !== 'categories'
    ? CATEGORIES.find(c => c.id === nav.categoryId)
    : null;
  const currentSection = nav.level === 'content'
    ? currentCategory?.sections.find(s => s.id === nav.sectionId)
    : null;

  if (nav.level === 'categories') {
    return (
      <div className="border-b border-gray-800 shrink-0 bg-gray-900">
        <div className="px-4 pt-4 pb-3 flex items-center gap-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers size={18} className="text-blue-500" />
            Editor
          </h2>
          {activePreset && (
            <span className="ml-2 truncate text-xs font-normal text-purple-400">
              {activePreset.name}
            </span>
          )}
          <AdvancedModeToggle enabled={advancedMode} onChange={onAdvancedModeChange} />
        </div>
        {onSearchChange && (
          <div className="px-3 pb-3 relative">
            <Search size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search settings…"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-8 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button onClick={() => onSearchChange('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  const CategoryIcon = currentCategory?.icon || Settings;
  const SectionIcon = currentSection?.icon || Settings;

  return (
    <div className="border-b border-gray-800 shrink-0 bg-gray-900">
      <button
        onClick={goBack}
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-800/50 transition-colors"
      >
        <ChevronLeft size={18} className="text-blue-400" />
        <span className="text-sm text-gray-400">Back</span>
      </button>
      <div className="px-4 pb-3 flex items-center gap-2">
        <CategoryIcon size={16} className="text-blue-400" />
        <span className="text-sm font-medium text-white">{currentCategory?.label}</span>
        {currentSection && (
          <>
            <ChevronRight size={14} className="text-gray-600" />
            <SectionIcon size={14} className="text-gray-400" />
            <span className="text-sm text-gray-400">{currentSection.label}</span>
          </>
        )}
        <AdvancedModeToggle enabled={advancedMode} onChange={onAdvancedModeChange} />
      </div>
      {onSearchChange && (
        <div className="px-3 pb-3 relative">
          <Search size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Find a setting…"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-8 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          {searchQuery && <button onClick={() => onSearchChange('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white" aria-label="Clear search"><X size={14} /></button>}
        </div>
      )}
    </div>
  );
};

interface CategoryListProps {
  onSelect: (categoryId: CategoryId) => void;
  advancedMode: boolean;
}

export const CategoryList: React.FC<CategoryListProps> = ({ onSelect, advancedMode }) => (
  <div className="flex-1">
    {CATEGORIES.filter(category => advancedMode || category.id !== 'advanced').map((category) => {
      const Icon = category.icon;
      return (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-800/50 border-b border-gray-800 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
            <Icon size={20} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="flex-1">
            <span className="font-medium text-white block">{category.label}</span>
            <span className="text-xs text-gray-500">{category.sections.length} options</span>
          </div>
          <ChevronRight size={18} className="text-gray-600 group-hover:text-gray-400" />
        </button>
      );
    })}
  </div>
);

interface SectionListProps {
  categoryId: CategoryId;
  onSelect: (sectionId: SectionId) => void;
  advancedMode: boolean;
}

export const SectionList: React.FC<SectionListProps> = ({ categoryId, onSelect, advancedMode }) => {
  if (!advancedMode && categoryId === 'advanced') return null;
  const category = CATEGORIES.find(c => c.id === categoryId);
  if (!category) return null;
  
  return (
    <div className="flex-1">
      {category.sections.map((section) => {
        const Icon = section.icon;
        return (
          <button
            key={section.id}
            onClick={() => onSelect(section.id)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800/50 border-b border-gray-800 transition-colors group"
          >
            <Icon size={18} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
            <span className="flex-1 text-sm text-gray-300 group-hover:text-white transition-colors">
              {section.label}
            </span>
            <ChevronRight size={16} className="text-gray-600 group-hover:text-gray-400" />
          </button>
        );
      })}
    </div>
  );
};

interface SearchResultsProps {
  query: string;
  onSelect: (categoryId: CategoryId, sectionId: SectionId) => void;
  advancedMode: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ query, onSelect, advancedMode }) => {
  const normalizedQuery = query.trim().toLowerCase();
  const results = CATEGORIES.filter(cat => advancedMode || cat.id !== 'advanced').flatMap((cat) =>
    cat.sections
      .filter((sec) =>
        sec.label.toLowerCase().includes(normalizedQuery)
        || cat.label.toLowerCase().includes(normalizedQuery)
        || sec.keywords?.some((keyword) => keyword.includes(normalizedQuery))
      )
      .map((sec) => ({ category: cat, section: sec }))
  );

  if (results.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm px-4 py-8">
        No sections match "{query}"
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {results.map(({ category, section }) => {
        const Icon = section.icon;
        const CatIcon = category.icon;
        return (
          <button
            key={section.id}
            onClick={() => onSelect(category.id, section.id)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800/50 border-b border-gray-800 transition-colors group"
          >
            <Icon size={18} className="text-gray-500 group-hover:text-blue-400 shrink-0 transition-colors" />
            <div className="flex-1 min-w-0">
              <span className="text-sm text-gray-300 group-hover:text-white block">{section.label}</span>
              <span className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                <CatIcon size={10} />
                {category.label}
              </span>
            </div>
            <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-400 shrink-0" />
          </button>
        );
      })}
    </div>
  );
};

// Hook for navigation state management
export function useNavigation() {
  const [nav, setNav] = useState<NavState>({ level: 'categories' });
  const [searchQuery, setSearchQuery] = useState('');

  const goBack = () => {
    if (searchQuery) {
      setSearchQuery('');
      return;
    }
    if (nav.level === 'content') {
      setNav({ level: 'sections', categoryId: nav.categoryId });
    } else if (nav.level === 'sections') {
      setNav({ level: 'categories' });
    }
  };

  const selectCategory = (categoryId: CategoryId) => {
    setNav({ level: 'sections', categoryId });
  };

  const selectSection = (sectionId: SectionId) => {
    if (nav.level === 'sections') {
      setNav({ level: 'content', categoryId: nav.categoryId, sectionId });
    }
  };

  const selectFromSearch = (categoryId: CategoryId, sectionId: SectionId) => {
    setSearchQuery('');
    setNav({ level: 'content', categoryId, sectionId });
  };

  const goHome = () => {
    setSearchQuery('');
    setNav({ level: 'categories' });
  };

  return { nav, goBack, goHome, selectCategory, selectSection, selectFromSearch, searchQuery, setSearchQuery };
}
