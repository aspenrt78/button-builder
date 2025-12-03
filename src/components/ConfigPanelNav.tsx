import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Target, Grid3X3, Palette, Sparkles, MousePointer, Settings, Type, Layout, ToggleRight, Droplets, BoxSelect, Activity, Zap, Hand, AlertCircle, Lock, Shield, MessageSquare, Code, Layers, Variable as VariableIcon, Wand2, Gauge } from 'lucide-react';

// ============= NAVIGATION TYPES =============
export type SectionId = 
  | 'core' | 'variables' 
  | 'dimensions' | 'visibility' | 'gridLayout'
  | 'colors' | 'glass' | 'borders' | 'animations' | 'typography' | 'thresholdColors'
  | 'stateStyles'
  | 'cardActions' | 'momentaryActions' | 'iconActions'
  | 'confirmation' | 'lock' | 'protect' | 'tooltip' | 'customFields' | 'advancedSettings'
  | 'presetGallery' | 'presetConditions';

export type CategoryId = 'presets' | 'entity' | 'layout' | 'appearance' | 'effects' | 'actions' | 'advanced';

interface SectionDef {
  id: SectionId;
  label: string;
  icon: any;
}

interface CategoryDef {
  id: CategoryId;
  label: string;
  icon: any;
  sections: SectionDef[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: 'presets', label: 'Presets', icon: Wand2,
    sections: [
      { id: 'presetGallery', label: 'Style Presets', icon: Palette },
      { id: 'presetConditions', label: 'State Conditions', icon: Layers },
    ]
  },
  { 
    id: 'entity', label: 'Entity', icon: Target,
    sections: [
      { id: 'core', label: 'Core Configuration', icon: Type },
      { id: 'variables', label: 'Variables', icon: VariableIcon },
    ]
  },
  { 
    id: 'layout', label: 'Layout', icon: Grid3X3,
    sections: [
      { id: 'dimensions', label: 'Dimensions', icon: Layout },
      { id: 'visibility', label: 'Visibility', icon: ToggleRight },
      { id: 'gridLayout', label: 'Grid Layout', icon: Grid3X3 },
    ]
  },
  { 
    id: 'appearance', label: 'Style', icon: Palette,
    sections: [
      { id: 'colors', label: 'Colors & Theming', icon: Palette },
      { id: 'borders', label: 'Borders', icon: BoxSelect },
      { id: 'typography', label: 'Typography', icon: Type },
      { id: 'stateStyles', label: 'State Colors & Styles', icon: Zap },
      { id: 'thresholdColors', label: 'Threshold Alerts', icon: Gauge },
    ]
  },
  { 
    id: 'effects', label: 'Effects', icon: Sparkles,
    sections: [
      { id: 'glass', label: 'Glass & Depth', icon: Droplets },
      { id: 'animations', label: 'Animations', icon: Activity },
    ]
  },
  { 
    id: 'actions', label: 'Actions', icon: MousePointer,
    sections: [
      { id: 'cardActions', label: 'Card Actions', icon: MousePointer },
      { id: 'momentaryActions', label: 'Momentary Actions', icon: Hand },
      { id: 'iconActions', label: 'Icon Actions', icon: Target },
    ]
  },
  { 
    id: 'advanced', label: 'Advanced', icon: Settings,
    sections: [
      { id: 'confirmation', label: 'Confirmation', icon: AlertCircle },
      { id: 'lock', label: 'Lock', icon: Lock },
      { id: 'protect', label: 'PIN/Password', icon: Shield },
      { id: 'tooltip', label: 'Tooltip', icon: MessageSquare },
      { id: 'customFields', label: 'Custom Fields', icon: Code },
      { id: 'advancedSettings', label: 'Extra Settings', icon: Settings },
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
}

export const NavHeader: React.FC<NavHeaderProps> = ({ nav, goBack, activePreset }) => {
  const currentCategory = nav.level !== 'categories' 
    ? CATEGORIES.find(c => c.id === nav.categoryId) 
    : null;
  const currentSection = nav.level === 'content' 
    ? currentCategory?.sections.find(s => s.id === nav.sectionId)
    : null;

  if (nav.level === 'categories') {
    return (
      <div className="p-4 border-b border-gray-800 shrink-0 bg-gray-900">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers size={18} className="text-blue-500" />
          Editor
          {activePreset && (
            <span className="text-xs font-normal text-purple-400 ml-auto">
              {activePreset.name}
            </span>
          )}
        </h2>
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
      </div>
    </div>
  );
};

interface CategoryListProps {
  onSelect: (categoryId: CategoryId) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ onSelect }) => (
  <div className="flex-1">
    {CATEGORIES.map((category) => {
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
}

export const SectionList: React.FC<SectionListProps> = ({ categoryId, onSelect }) => {
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

// Hook for navigation state management
export function useNavigation() {
  const [nav, setNav] = useState<NavState>({ level: 'categories' });

  const goBack = () => {
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

  return { nav, goBack, selectCategory, selectSection };
}
