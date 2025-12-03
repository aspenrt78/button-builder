// Bubble Card Config Panel - Enhanced with full customization

import React, { useState } from 'react';
import { 
  BubbleButtonConfig, 
  BubbleSubButton, 
  BubbleAction, 
  BubbleActionType,
  BubbleConfig,
  BubbleCardType,
} from '../types';
import { 
  BUTTON_TYPE_OPTIONS, 
  CARD_LAYOUT_OPTIONS, 
  ACTION_TYPE_OPTIONS,
  COMMON_BUBBLE_ICONS,
  DEFAULT_SUB_BUTTON,
  DEFAULT_ACTION
} from '../constants';
import { ChevronDown, ChevronRight, Plus, Trash2, GripVertical, Palette, Zap, Layout, Eye, Sliders, MousePointer, Sparkles, Search, X, Home, Thermometer, Music, Blinds, Calendar, Layers } from 'lucide-react';

interface ConfigPanelProps {
  config: BubbleConfig;
  updateConfig: (key: string, value: any) => void;
  setConfig: React.Dispatch<React.SetStateAction<BubbleConfig>>;
}

// ============================================
// ICON PICKER COMPONENT
// ============================================

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function IconPicker({ value, onChange, placeholder }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const filteredIcons = COMMON_BUBBLE_ICONS.filter(icon => 
    icon.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="w-10 h-9 flex items-center justify-center bg-gray-800 border border-gray-600 rounded">
          {value ? (
            <span className="text-cyan-400 text-lg">
              {value.startsWith('mdi:') ? '🔹' : '📷'}
            </span>
          ) : (
            <span className="text-gray-500 text-sm">–</span>
          )}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder || "mdi:lightbulb"}
          className="flex-1 bg-gray-800 text-white text-sm px-2 py-1.5 rounded border border-gray-600 focus:border-cyan-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-2 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 text-gray-400"
        >
          <Search size={14} />
        </button>
      </div>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-64 overflow-hidden">
          <div className="p-2 border-b border-gray-700 flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icons..."
              className="flex-1 bg-gray-900 text-white text-sm px-2 py-1 rounded border border-gray-600"
              autoFocus
            />
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto p-2 grid grid-cols-4 gap-1">
            {filteredIcons.map(icon => (
              <button
                key={icon}
                onClick={() => { onChange(icon); setIsOpen(false); }}
                className={`p-2 text-xs rounded hover:bg-gray-700 transition-colors text-center truncate ${
                  value === icon ? 'bg-cyan-700 text-white' : 'text-gray-300'
                }`}
                title={icon}
              >
                {icon.replace('mdi:', '')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// CONTROL INPUT COMPONENT
// ============================================

interface ControlInputProps {
  label: string;
  type: 'text' | 'select' | 'checkbox' | 'number' | 'color' | 'textarea' | 'range';
  value: string | number | boolean | undefined;
  onChange: (value: any) => void;
  options?: { value: string; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}

function ControlInput({ label, type, value, onChange, options, placeholder, min, max, step, hint }: ControlInputProps) {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  
  if (type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 cursor-pointer py-1 group">
        <div className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
          value ? 'bg-cyan-600' : 'bg-gray-600'
        }`}>
          <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
            value ? 'translate-x-4' : 'translate-x-0'
          }`} />
        </div>
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
      </label>
    );
  }

  if (type === 'select') {
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="text-xs text-gray-400 font-medium">{label}</label>
        <select
          id={id}
          value={String(value || '')}
          onChange={(e) => onChange(e.target.value)}
          className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none cursor-pointer hover:border-gray-500 transition-colors"
        >
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {hint && <p className="text-xs text-gray-500">{hint}</p>}
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="text-xs text-gray-400 font-medium">{label}</label>
        <textarea
          id={id}
          value={String(value || '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none font-mono resize-y min-h-[100px]"
        />
        {hint && <p className="text-xs text-gray-500">{hint}</p>}
      </div>
    );
  }

  if (type === 'color') {
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="text-xs text-gray-400 font-medium">{label}</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={String(value || '#ffffff')}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-9 rounded-lg border border-gray-600 cursor-pointer bg-transparent"
          />
          <input
            type="text"
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#ffffff or var(--primary-color)"
            className="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>
    );
  }

  if (type === 'range') {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <label htmlFor={id} className="text-xs text-gray-400 font-medium">{label}</label>
          <span className="text-xs text-cyan-400 font-mono">{value}</span>
        </div>
        <input
          type="range"
          id={id}
          value={Number(value) || 0}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
        <div className="flex justify-between text-[10px] text-gray-500">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs text-gray-400 font-medium">{label}</label>
      <input
        type={type}
        id={id}
        value={value ?? ''}
        onChange={(e) => onChange(type === 'number' ? (e.target.value === '' ? undefined : Number(e.target.value)) : e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none hover:border-gray-500 transition-colors"
      />
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

// ============================================
// SECTION COMPONENT
// ============================================

interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string | number;
}

function Section({ title, icon, children, defaultOpen = true, badge }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-gray-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-400">{icon}</span>}
          <span className="text-sm font-medium text-gray-200">{title}</span>
          {badge !== undefined && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-cyan-600 text-white rounded-full">
              {badge}
            </span>
          )}
        </div>
        <span className="text-gray-500">
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

// ============================================
// ACTION EDITOR COMPONENT
// ============================================

interface ActionEditorProps {
  label: string;
  action: BubbleAction | undefined;
  onChange: (action: BubbleAction | undefined) => void;
}

function ActionEditor({ label, action, onChange }: ActionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentAction = action || DEFAULT_ACTION;
  
  const updateAction = (updates: Partial<BubbleAction>) => {
    onChange({ ...currentAction, ...updates });
  };

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <MousePointer size={14} className="text-gray-400" />
          <span className="text-sm text-gray-300">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-cyan-400 font-mono">
            {currentAction.action}
          </span>
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
      </button>
      
      {isExpanded && (
        <div className="p-3 pt-0 space-y-3 border-t border-gray-700">
          <ControlInput
            label="Action Type"
            type="select"
            value={currentAction.action}
            onChange={(v) => updateAction({ action: v as BubbleActionType })}
            options={ACTION_TYPE_OPTIONS}
          />
          
          {currentAction.action === 'navigate' && (
            <ControlInput
              label="Navigation Path"
              type="text"
              value={currentAction.navigation_path}
              onChange={(v) => updateAction({ navigation_path: v })}
              placeholder="/lovelace/room or #popup"
            />
          )}
          
          {currentAction.action === 'url' && (
            <ControlInput
              label="URL"
              type="text"
              value={currentAction.url_path}
              onChange={(v) => updateAction({ url_path: v })}
              placeholder="https://example.com"
            />
          )}
          
          {currentAction.action === 'call-service' && (
            <>
              <ControlInput
                label="Service"
                type="text"
                value={currentAction.service}
                onChange={(v) => updateAction({ service: v })}
                placeholder="light.toggle"
              />
              <ControlInput
                label="Service Data (JSON)"
                type="textarea"
                value={currentAction.data ? JSON.stringify(currentAction.data, null, 2) : ''}
                onChange={(v) => {
                  try {
                    updateAction({ data: v ? JSON.parse(v) : undefined });
                  } catch (e) {
                    // Invalid JSON, ignore
                  }
                }}
                placeholder='{"entity_id": "light.living_room"}'
              />
            </>
          )}
          
          {currentAction.action !== 'none' && (
            <ControlInput
              label="Confirmation Text (optional)"
              type="text"
              value={currentAction.confirmation?.text}
              onChange={(v) => updateAction({ 
                confirmation: v ? { text: v } : undefined 
              })}
              placeholder="Are you sure?"
            />
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// SUB-BUTTON EDITOR
// ============================================

interface SubButtonEditorProps {
  subButtons: BubbleSubButton[];
  onChange: (subButtons: BubbleSubButton[]) => void;
}

function SubButtonEditor({ subButtons, onChange }: SubButtonEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  
  const addSubButton = () => {
    onChange([...subButtons, { ...DEFAULT_SUB_BUTTON, id: `sub-${Date.now()}` }]);
    setExpandedIndex(subButtons.length);
  };

  const removeSubButton = (index: number) => {
    onChange(subButtons.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const updateSubButton = (index: number, updates: Partial<BubbleSubButton>) => {
    onChange(subButtons.map((sb, i) => i === index ? { ...sb, ...updates } : sb));
  };

  const moveSubButton = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= subButtons.length) return;
    const newSubButtons = [...subButtons];
    [newSubButtons[index], newSubButtons[newIndex]] = [newSubButtons[newIndex], newSubButtons[index]];
    onChange(newSubButtons);
    setExpandedIndex(newIndex);
  };

  return (
    <div className="space-y-2">
      {subButtons.map((sb, index) => (
        <div 
          key={sb.id || index} 
          className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-2 bg-gray-800">
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="flex items-center gap-2 flex-1 text-left"
            >
              <GripVertical size={14} className="text-gray-500" />
              <span className="text-sm text-gray-300">
                {sb.name || sb.icon || sb.entity || `Sub-button ${index + 1}`}
              </span>
            </button>
            <div className="flex gap-1">
              <button
                onClick={() => moveSubButton(index, 'up')}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400"
              >
                ↑
              </button>
              <button
                onClick={() => moveSubButton(index, 'down')}
                disabled={index === subButtons.length - 1}
                className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400"
              >
                ↓
              </button>
              <button
                onClick={() => removeSubButton(index)}
                className="p-1 text-red-400 hover:text-red-300"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          
          {/* Expanded Content */}
          {expandedIndex === index && (
            <div className="p-3 space-y-3 border-t border-gray-700">
              <ControlInput
                label="Entity"
                type="text"
                value={sb.entity}
                onChange={(v) => updateSubButton(index, { entity: v })}
                placeholder="sensor.temperature"
              />
              
              <ControlInput
                label="Name"
                type="text"
                value={sb.name}
                onChange={(v) => updateSubButton(index, { name: v })}
                placeholder="Temperature"
              />
              
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 font-medium">Icon</label>
                <IconPicker
                  value={sb.icon || ''}
                  onChange={(v) => updateSubButton(index, { icon: v })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <ControlInput
                  label="Show Background"
                  type="checkbox"
                  value={sb.show_background !== false}
                  onChange={(v) => updateSubButton(index, { show_background: v })}
                />
                <ControlInput
                  label="Show State"
                  type="checkbox"
                  value={sb.show_state === true}
                  onChange={(v) => updateSubButton(index, { show_state: v })}
                />
                <ControlInput
                  label="Show Icon"
                  type="checkbox"
                  value={sb.show_icon !== false}
                  onChange={(v) => updateSubButton(index, { show_icon: v })}
                />
                <ControlInput
                  label="Show Name"
                  type="checkbox"
                  value={sb.show_name === true}
                  onChange={(v) => updateSubButton(index, { show_name: v })}
                />
                <ControlInput
                  label="Show Attribute"
                  type="checkbox"
                  value={sb.show_attribute === true}
                  onChange={(v) => updateSubButton(index, { show_attribute: v })}
                />
                <ControlInput
                  label="Last Changed"
                  type="checkbox"
                  value={sb.show_last_changed === true}
                  onChange={(v) => updateSubButton(index, { show_last_changed: v })}
                />
              </div>
              
              {sb.show_attribute && (
                <ControlInput
                  label="Attribute Name"
                  type="text"
                  value={sb.attribute}
                  onChange={(v) => updateSubButton(index, { attribute: v })}
                  placeholder="brightness"
                />
              )}
              
              {/* Sub-button Actions */}
              <div className="pt-2 border-t border-gray-700 space-y-2">
                <p className="text-xs text-gray-400 font-medium">Actions</p>
                <ActionEditor
                  label="Tap Action"
                  action={sb.tap_action}
                  onChange={(a) => updateSubButton(index, { tap_action: a })}
                />
                <ActionEditor
                  label="Hold Action"
                  action={sb.hold_action}
                  onChange={(a) => updateSubButton(index, { hold_action: a })}
                />
              </div>
            </div>
          )}
        </div>
      ))}
      
      <button
        onClick={addSubButton}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded-lg border border-cyan-600/30 transition-colors"
      >
        <Plus size={16} />
        Add Sub-button
      </button>
    </div>
  );
}

// ============================================
// STYLES EDITOR WITH CSS VARIABLES
// ============================================

interface StylesEditorProps {
  config: { styles?: string };
  updateConfig: (key: string, value: any) => void;
}

function StylesEditor({ config, updateConfig }: StylesEditorProps) {
  // Parse existing styles to extract CSS variables
  const parseStyles = (styles: string = '') => {
    const vars: Record<string, string> = {};
    const varRegex = /(--bubble-[a-z-]+)\s*:\s*([^;]+);/g;
    let match;
    while ((match = varRegex.exec(styles)) !== null) {
      vars[match[1]] = match[2].trim();
    }
    return vars;
  };
  
  const [cssVars, setCssVars] = useState<Record<string, string>>(parseStyles(config.styles));
  const [customCSS, setCustomCSS] = useState(() => {
    // Extract non-variable CSS
    const styles = config.styles || '';
    return styles.replace(/:host\s*\{[^}]*\}/g, '').trim();
  });
  
  const updateStyles = (newVars: Record<string, string>, newCustom: string) => {
    let styles = '';
    
    // Build :host block with CSS variables
    const varsEntries = Object.entries(newVars).filter(([_, v]) => v);
    if (varsEntries.length > 0) {
      styles += ':host {\n';
      varsEntries.forEach(([key, value]) => {
        styles += `  ${key}: ${value};\n`;
      });
      styles += '}\n';
    }
    
    // Add custom CSS
    if (newCustom.trim()) {
      styles += '\n' + newCustom;
    }
    
    updateConfig('styles', styles.trim());
  };
  
  const updateVar = (name: string, value: string) => {
    const newVars = { ...cssVars, [name]: value };
    setCssVars(newVars);
    updateStyles(newVars, customCSS);
  };
  
  const handleCustomCSSChange = (value: string) => {
    setCustomCSS(value);
    updateStyles(cssVars, value);
  };

  return (
    <div className="space-y-4">
      {/* Quick Style Variables */}
      <div className="space-y-3">
        <p className="text-xs text-gray-400 font-medium flex items-center gap-2">
          <Palette size={12} />
          CSS Variables
        </p>
        
        <ControlInput
          label="Border Radius"
          type="text"
          value={cssVars['--bubble-border-radius'] || ''}
          onChange={(v) => updateVar('--bubble-border-radius', v)}
          placeholder="32px"
          hint="Main card border radius"
        />
        
        <ControlInput
          label="Background Color"
          type="color"
          value={cssVars['--bubble-main-background-color'] || ''}
          onChange={(v) => updateVar('--bubble-main-background-color', v)}
        />
        
        <ControlInput
          label="Secondary Background"
          type="color"
          value={cssVars['--bubble-secondary-background-color'] || ''}
          onChange={(v) => updateVar('--bubble-secondary-background-color', v)}
        />
        
        <ControlInput
          label="Accent Color"
          type="color"
          value={cssVars['--bubble-accent-color'] || ''}
          onChange={(v) => updateVar('--bubble-accent-color', v)}
        />
        
        <ControlInput
          label="Icon Background Color"
          type="color"
          value={cssVars['--bubble-icon-background-color'] || ''}
          onChange={(v) => updateVar('--bubble-icon-background-color', v)}
        />
        
        <ControlInput
          label="Icon Border Radius"
          type="text"
          value={cssVars['--bubble-icon-border-radius'] || ''}
          onChange={(v) => updateVar('--bubble-icon-border-radius', v)}
          placeholder="50%"
        />
        
        <ControlInput
          label="Sub-button Background"
          type="color"
          value={cssVars['--bubble-sub-button-background-color'] || ''}
          onChange={(v) => updateVar('--bubble-sub-button-background-color', v)}
        />
        
        <ControlInput
          label="Sub-button Border Radius"
          type="text"
          value={cssVars['--bubble-sub-button-border-radius'] || ''}
          onChange={(v) => updateVar('--bubble-sub-button-border-radius', v)}
          placeholder="32px"
        />
        
        <ControlInput
          label="Box Shadow"
          type="text"
          value={cssVars['--bubble-box-shadow'] || ''}
          onChange={(v) => updateVar('--bubble-box-shadow', v)}
          placeholder="0 2px 8px rgba(0,0,0,0.3)"
        />
      </div>
      
      {/* Custom CSS */}
      <div className="pt-3 border-t border-gray-700">
        <ControlInput
          label="Custom CSS"
          type="textarea"
          value={customCSS}
          onChange={handleCustomCSSChange}
          placeholder={`.bubble-button-card-container {\n  /* Your custom styles */\n}`}
          hint="Advanced: Add custom CSS rules for fine-grained control"
        />
      </div>
      
      {/* Prebuilt Style Snippets */}
      <div className="pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-400 font-medium mb-2">Quick Styles</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              updateVar('--bubble-border-radius', '16px');
              updateVar('--bubble-icon-border-radius', '12px');
            }}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Rounded
          </button>
          <button
            onClick={() => {
              updateVar('--bubble-border-radius', '0px');
              updateVar('--bubble-icon-border-radius', '0px');
            }}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Square
          </button>
          <button
            onClick={() => {
              updateVar('--bubble-box-shadow', '0 4px 20px rgba(0,0,0,0.5)');
            }}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Deep Shadow
          </button>
          <button
            onClick={() => {
              updateVar('--bubble-main-background-color', 'rgba(0,0,0,0.6)');
              updateVar('--bubble-secondary-background-color', 'rgba(255,255,255,0.1)');
            }}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Glass Effect
          </button>
          <button
            onClick={() => {
              updateVar('--bubble-accent-color', '#00d4ff');
              updateVar('--bubble-icon-background-color', 'rgba(0,212,255,0.2)');
            }}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Neon Cyan
          </button>
          <button
            onClick={() => {
              updateVar('--bubble-accent-color', '#ff6b6b');
              updateVar('--bubble-icon-background-color', 'rgba(255,107,107,0.2)');
            }}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Coral
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN CONFIG PANEL
// ============================================

export function BubbleConfigPanel({ config, updateConfig, setConfig }: ConfigPanelProps) {
  const cardType = config.card_type;
  
  // Type guards for conditional rendering
  const isButton = cardType === 'button';
  const isSeparator = cardType === 'separator';
  const isPopUp = cardType === 'pop-up';
  const isCover = cardType === 'cover';
  const isMediaPlayer = cardType === 'media-player';
  const isClimate = cardType === 'climate';
  const isSelect = cardType === 'select';
  const isCalendar = cardType === 'calendar';
  const isHorizontalStack = cardType === 'horizontal-buttons-stack';
  const isEmptyColumn = cardType === 'empty-column';
  
  // Check if card type has common properties
  const hasEntity = isButton || isCover || isMediaPlayer || isClimate || isSelect;
  const hasNameIcon = !isHorizontalStack && !isEmptyColumn;
  const hasSubButtons = isButton || isSeparator || isCover || isMediaPlayer || isClimate || isSelect || isCalendar;
  const hasLayout = isButton || isSeparator || isCover || isMediaPlayer || isClimate || isSelect || isCalendar;
  const hasVisibility = isButton || isCover || isMediaPlayer || isClimate || isSelect;
  const hasActions = isButton || isCover || isMediaPlayer || isClimate || isSelect;
  const hasStyles = !isEmptyColumn;

  // Empty column has no config options
  if (isEmptyColumn) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <Layers size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-sm">Empty Column</p>
          <p className="text-xs mt-2">No configuration needed.<br/>Used to fill empty space in horizontal stacks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* ============================================ */}
      {/* BUTTON CARD OPTIONS */}
      {/* ============================================ */}
      {isButton && (
        <>
          <Section title="Entity & Display" icon={<Zap size={14} />} defaultOpen={true}>
            <ControlInput
              label="Entity"
              type="text"
              value={(config as any).entity || ''}
              onChange={(v) => updateConfig('entity', v)}
              placeholder="light.living_room"
              hint="Home Assistant entity ID"
            />
            <ControlInput
              label="Button Type"
              type="select"
              value={(config as any).button_type || 'switch'}
              onChange={(v) => updateConfig('button_type', v)}
              options={BUTTON_TYPE_OPTIONS.map(o => ({ value: o.value, label: `${o.label} – ${o.description}` }))}
            />
            <ControlInput
              label="Name"
              type="text"
              value={(config as any).name || ''}
              onChange={(v) => updateConfig('name', v)}
              placeholder="Living Room"
            />
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-medium">Icon</label>
              <IconPicker
                value={(config as any).icon || ''}
                onChange={(v) => updateConfig('icon', v)}
              />
            </div>
            <ControlInput
              label="Force Icon (override entity picture)"
              type="checkbox"
              value={(config as any).force_icon}
              onChange={(v) => updateConfig('force_icon', v)}
            />
          </Section>

          <Section title="Visibility" icon={<Eye size={14} />} defaultOpen={false}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <ControlInput label="Show Name" type="checkbox" value={(config as any).show_name} onChange={(v) => updateConfig('show_name', v)} />
              <ControlInput label="Show Icon" type="checkbox" value={(config as any).show_icon} onChange={(v) => updateConfig('show_icon', v)} />
              <ControlInput label="Show State" type="checkbox" value={(config as any).show_state} onChange={(v) => updateConfig('show_state', v)} />
              <ControlInput label="Use Accent Color" type="checkbox" value={(config as any).use_accent_color} onChange={(v) => updateConfig('use_accent_color', v)} />
              <ControlInput label="Scrolling Effect" type="checkbox" value={(config as any).scrolling_effect} onChange={(v) => updateConfig('scrolling_effect', v)} />
              <ControlInput label="Last Changed" type="checkbox" value={(config as any).show_last_changed} onChange={(v) => updateConfig('show_last_changed', v)} />
              <ControlInput label="Last Updated" type="checkbox" value={(config as any).show_last_updated} onChange={(v) => updateConfig('show_last_updated', v)} />
              <ControlInput label="Show Attribute" type="checkbox" value={(config as any).show_attribute} onChange={(v) => updateConfig('show_attribute', v)} />
            </div>
            {(config as any).show_attribute && (
              <ControlInput label="Attribute Name" type="text" value={(config as any).attribute} onChange={(v) => updateConfig('attribute', v)} placeholder="brightness" />
            )}
          </Section>

          <Section title="Layout" icon={<Layout size={14} />} defaultOpen={false}>
            <ControlInput label="Card Layout" type="select" value={(config as any).card_layout} onChange={(v) => updateConfig('card_layout', v)} options={CARD_LAYOUT_OPTIONS.map(o => ({ value: o.value, label: o.label }))} />
            <ControlInput label="Rows" type="range" value={(config as any).rows || 1} onChange={(v) => updateConfig('rows', v)} min={1} max={4} step={1} />
          </Section>

          {(config as any).button_type === 'slider' && (
            <Section title="Slider Options" icon={<Sliders size={14} />} defaultOpen={true}>
              <div className="grid grid-cols-3 gap-2">
                <ControlInput label="Min" type="number" value={(config as any).min_value} onChange={(v) => updateConfig('min_value', v)} />
                <ControlInput label="Max" type="number" value={(config as any).max_value} onChange={(v) => updateConfig('max_value', v)} />
                <ControlInput label="Step" type="number" value={(config as any).step} onChange={(v) => updateConfig('step', v)} step={0.1} />
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <ControlInput label="Tap to Slide" type="checkbox" value={(config as any).tap_to_slide} onChange={(v) => updateConfig('tap_to_slide', v)} />
                <ControlInput label="Live Update" type="checkbox" value={(config as any).slider_live_update} onChange={(v) => updateConfig('slider_live_update', v)} />
                <ControlInput label="Relative Slide" type="checkbox" value={(config as any).relative_slide} onChange={(v) => updateConfig('relative_slide', v)} />
                <ControlInput label="Read Only" type="checkbox" value={(config as any).read_only_slider} onChange={(v) => updateConfig('read_only_slider', v)} />
                <ControlInput label="Allow 0 for Lights" type="checkbox" value={(config as any).allow_light_slider_to_0} onChange={(v) => updateConfig('allow_light_slider_to_0', v)} />
                <ControlInput label="Light Transition" type="checkbox" value={(config as any).light_transition} onChange={(v) => updateConfig('light_transition', v)} />
              </div>
              {(config as any).light_transition && (
                <ControlInput label="Transition Time (ms)" type="range" value={(config as any).light_transition_time || 500} onChange={(v) => updateConfig('light_transition_time', v)} min={0} max={2000} step={100} />
              )}
            </Section>
          )}

          <Section title="Actions" icon={<MousePointer size={14} />} defaultOpen={false}>
            <ActionEditor label="Tap Action" action={(config as any).tap_action} onChange={(a) => updateConfig('tap_action', a)} />
            <ActionEditor label="Double Tap Action" action={(config as any).double_tap_action} onChange={(a) => updateConfig('double_tap_action', a)} />
            <ActionEditor label="Hold Action" action={(config as any).hold_action} onChange={(a) => updateConfig('hold_action', a)} />
          </Section>

          <Section title="Sub-buttons" icon={<Sparkles size={14} />} defaultOpen={false} badge={(config as any).sub_button?.length || undefined}>
            <SubButtonEditor subButtons={(config as any).sub_button || []} onChange={(subs) => updateConfig('sub_button', subs)} />
          </Section>

          <Section title="Styling" icon={<Palette size={14} />} defaultOpen={false}>
            <StylesEditor config={config as any} updateConfig={updateConfig} />
          </Section>
        </>
      )}

      {/* ============================================ */}
      {/* SEPARATOR CARD OPTIONS */}
      {/* ============================================ */}
      {isSeparator && (
        <>
          <Section title="Display" icon={<Zap size={14} />} defaultOpen={true}>
            <ControlInput label="Name" type="text" value={(config as any).name || ''} onChange={(v) => updateConfig('name', v)} placeholder="Section Name" hint="Text displayed on the separator" />
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-medium">Icon</label>
              <IconPicker value={(config as any).icon || ''} onChange={(v) => updateConfig('icon', v)} />
            </div>
          </Section>

          <Section title="Layout" icon={<Layout size={14} />} defaultOpen={false}>
            <ControlInput label="Card Layout" type="select" value={(config as any).card_layout || 'normal'} onChange={(v) => updateConfig('card_layout', v)} options={CARD_LAYOUT_OPTIONS.map(o => ({ value: o.value, label: o.label }))} />
            <ControlInput label="Rows" type="range" value={(config as any).rows || 1} onChange={(v) => updateConfig('rows', v)} min={1} max={4} step={1} />
          </Section>

          <Section title="Sub-buttons" icon={<Sparkles size={14} />} defaultOpen={false} badge={(config as any).sub_button?.length || undefined}>
            <SubButtonEditor subButtons={(config as any).sub_button || []} onChange={(subs) => updateConfig('sub_button', subs)} />
          </Section>

          <Section title="Styling" icon={<Palette size={14} />} defaultOpen={false}>
            <StylesEditor config={config as any} updateConfig={updateConfig} />
          </Section>
        </>
      )}

      {/* ============================================ */}
      {/* POP-UP CARD OPTIONS */}
      {/* ============================================ */}
      {isPopUp && (
        <>
          <Section title="Pop-up Settings" icon={<Home size={14} />} defaultOpen={true}>
            <ControlInput label="Hash (required)" type="text" value={(config as any).hash || '#room'} onChange={(v) => updateConfig('hash', v)} placeholder="#kitchen" hint="URL hash to trigger this pop-up (e.g., #kitchen)" />
            <ControlInput label="Entity" type="text" value={(config as any).entity || ''} onChange={(v) => updateConfig('entity', v)} placeholder="light.living_room" hint="Optional entity for header display" />
            <ControlInput label="Name" type="text" value={(config as any).name || ''} onChange={(v) => updateConfig('name', v)} placeholder="Kitchen" />
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-medium">Icon</label>
              <IconPicker value={(config as any).icon || ''} onChange={(v) => updateConfig('icon', v)} />
            </div>
          </Section>

          <Section title="Behavior" icon={<MousePointer size={14} />} defaultOpen={false}>
            <ControlInput label="Auto Close (seconds)" type="number" value={(config as any).auto_close} onChange={(v) => updateConfig('auto_close', v)} placeholder="15" hint="Auto-close after X seconds (blank = never)" />
            <ControlInput label="Close on Click" type="checkbox" value={(config as any).close_on_click} onChange={(v) => updateConfig('close_on_click', v)} />
            <ControlInput label="Close by Clicking Outside" type="checkbox" value={(config as any).close_by_clicking_outside !== false} onChange={(v) => updateConfig('close_by_clicking_outside', v)} />
            <ControlInput label="Show Header" type="checkbox" value={(config as any).show_header} onChange={(v) => updateConfig('show_header', v)} />
            <ControlInput label="Background Update" type="checkbox" value={(config as any).background_update} onChange={(v) => updateConfig('background_update', v)} />
          </Section>

          <Section title="Appearance" icon={<Palette size={14} />} defaultOpen={false}>
            <ControlInput label="Width (Desktop)" type="text" value={(config as any).width_desktop || '540px'} onChange={(v) => updateConfig('width_desktop', v)} placeholder="540px" />
            <ControlInput label="Margin" type="text" value={(config as any).margin || '7px'} onChange={(v) => updateConfig('margin', v)} placeholder="7px" />
            <ControlInput label="Margin Top (Mobile)" type="text" value={(config as any).margin_top_mobile} onChange={(v) => updateConfig('margin_top_mobile', v)} placeholder="0px" />
            <ControlInput label="Margin Top (Desktop)" type="text" value={(config as any).margin_top_desktop} onChange={(v) => updateConfig('margin_top_desktop', v)} placeholder="0px" />
            <ControlInput label="Background Color" type="color" value={(config as any).bg_color} onChange={(v) => updateConfig('bg_color', v)} />
            <ControlInput label="Background Opacity" type="range" value={(config as any).bg_opacity ?? 85} onChange={(v) => updateConfig('bg_opacity', v)} min={0} max={100} step={5} />
            <ControlInput label="Background Blur" type="range" value={(config as any).bg_blur ?? 14} onChange={(v) => updateConfig('bg_blur', v)} min={0} max={50} step={1} />
            <ControlInput label="Shadow Opacity" type="range" value={(config as any).shadow_opacity ?? 0} onChange={(v) => updateConfig('shadow_opacity', v)} min={0} max={100} step={5} />
            <ControlInput label="Hide Backdrop" type="checkbox" value={(config as any).hide_backdrop} onChange={(v) => updateConfig('hide_backdrop', v)} />
          </Section>

          <Section title="Trigger" icon={<Zap size={14} />} defaultOpen={false}>
            <ControlInput label="Trigger Entity" type="text" value={(config as any).trigger_entity} onChange={(v) => updateConfig('trigger_entity', v)} placeholder="binary_sensor.motion" hint="Entity that triggers the pop-up" />
            <ControlInput label="Trigger State" type="text" value={(config as any).trigger_state} onChange={(v) => updateConfig('trigger_state', v)} placeholder="on" hint="State value that triggers opening" />
            <ControlInput label="Trigger Close" type="checkbox" value={(config as any).trigger_close} onChange={(v) => updateConfig('trigger_close', v)} />
          </Section>

          <Section title="Styling" icon={<Palette size={14} />} defaultOpen={false}>
            <StylesEditor config={config as any} updateConfig={updateConfig} />
          </Section>
        </>
      )}

      {/* ============================================ */}
      {/* COVER CARD OPTIONS */}
      {/* ============================================ */}
      {isCover && (
        <>
          <Section title="Entity & Display" icon={<Blinds size={14} />} defaultOpen={true}>
            <ControlInput label="Entity (required)" type="text" value={(config as any).entity || ''} onChange={(v) => updateConfig('entity', v)} placeholder="cover.living_room_blinds" hint="Cover entity ID" />
            <ControlInput label="Name" type="text" value={(config as any).name || ''} onChange={(v) => updateConfig('name', v)} placeholder="Living Room Blinds" />
            <ControlInput label="Force Icon" type="checkbox" value={(config as any).force_icon} onChange={(v) => updateConfig('force_icon', v)} />
          </Section>

          <Section title="Custom Icons" icon={<Eye size={14} />} defaultOpen={false}>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-medium">Open Icon</label>
              <IconPicker value={(config as any).icon_open || ''} onChange={(v) => updateConfig('icon_open', v)} placeholder="mdi:blinds-open" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-medium">Close Icon</label>
              <IconPicker value={(config as any).icon_close || ''} onChange={(v) => updateConfig('icon_close', v)} placeholder="mdi:blinds" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-medium">Up Icon</label>
              <IconPicker value={(config as any).icon_up || ''} onChange={(v) => updateConfig('icon_up', v)} placeholder="mdi:arrow-up" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-medium">Down Icon</label>
              <IconPicker value={(config as any).icon_down || ''} onChange={(v) => updateConfig('icon_down', v)} placeholder="mdi:arrow-down" />
            </div>
          </Section>

          <Section title="Custom Services" icon={<Zap size={14} />} defaultOpen={false}>
            <ControlInput label="Open Service" type="text" value={(config as any).open_service} onChange={(v) => updateConfig('open_service', v)} placeholder="cover.open_cover" />
            <ControlInput label="Stop Service" type="text" value={(config as any).stop_service} onChange={(v) => updateConfig('stop_service', v)} placeholder="cover.stop_cover" />
            <ControlInput label="Close Service" type="text" value={(config as any).close_service} onChange={(v) => updateConfig('close_service', v)} placeholder="cover.close_cover" />
          </Section>

          <Section title="Visibility" icon={<Eye size={14} />} defaultOpen={false}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <ControlInput label="Show Name" type="checkbox" value={(config as any).show_name} onChange={(v) => updateConfig('show_name', v)} />
              <ControlInput label="Show Icon" type="checkbox" value={(config as any).show_icon} onChange={(v) => updateConfig('show_icon', v)} />
              <ControlInput label="Show State" type="checkbox" value={(config as any).show_state} onChange={(v) => updateConfig('show_state', v)} />
              <ControlInput label="Scrolling Effect" type="checkbox" value={(config as any).scrolling_effect} onChange={(v) => updateConfig('scrolling_effect', v)} />
              <ControlInput label="Last Changed" type="checkbox" value={(config as any).show_last_changed} onChange={(v) => updateConfig('show_last_changed', v)} />
              <ControlInput label="Show Attribute" type="checkbox" value={(config as any).show_attribute} onChange={(v) => updateConfig('show_attribute', v)} />
            </div>
          </Section>

          <Section title="Layout" icon={<Layout size={14} />} defaultOpen={false}>
            <ControlInput label="Card Layout" type="select" value={(config as any).card_layout || 'normal'} onChange={(v) => updateConfig('card_layout', v)} options={CARD_LAYOUT_OPTIONS.map(o => ({ value: o.value, label: o.label }))} />
            <ControlInput label="Rows" type="range" value={(config as any).rows || 1} onChange={(v) => updateConfig('rows', v)} min={1} max={4} step={1} />
          </Section>

          <Section title="Sub-buttons" icon={<Sparkles size={14} />} defaultOpen={false} badge={(config as any).sub_button?.length || undefined}>
            <SubButtonEditor subButtons={(config as any).sub_button || []} onChange={(subs) => updateConfig('sub_button', subs)} />
          </Section>

          <Section title="Styling" icon={<Palette size={14} />} defaultOpen={false}>
            <StylesEditor config={config as any} updateConfig={updateConfig} />
          </Section>
        </>
      )}

      {/* ============================================ */}
      {/* MEDIA PLAYER CARD OPTIONS */}
      {/* ============================================ */}
      {isMediaPlayer && (
        <>
          <Section title="Entity & Display" icon={<Music size={14} />} defaultOpen={true}>
            <ControlInput label="Entity (required)" type="text" value={(config as any).entity || ''} onChange={(v) => updateConfig('entity', v)} placeholder="media_player.living_room" hint="Media player entity ID" />
            <ControlInput label="Name" type="text" value={(config as any).name || ''} onChange={(v) => updateConfig('name', v)} placeholder="Living Room Speaker" />
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-medium">Icon</label>
              <IconPicker value={(config as any).icon || ''} onChange={(v) => updateConfig('icon', v)} />
            </div>
            <ControlInput label="Force Icon" type="checkbox" value={(config as any).force_icon} onChange={(v) => updateConfig('force_icon', v)} />
            <ControlInput label="Cover Background" type="checkbox" value={(config as any).cover_background !== false} onChange={(v) => updateConfig('cover_background', v)} />
          </Section>

          <Section title="Volume" icon={<Sliders size={14} />} defaultOpen={false}>
            <div className="grid grid-cols-2 gap-2">
              <ControlInput label="Min Volume" type="number" value={(config as any).min_volume ?? 0} onChange={(v) => updateConfig('min_volume', v)} min={0} max={100} />
              <ControlInput label="Max Volume" type="number" value={(config as any).max_volume ?? 100} onChange={(v) => updateConfig('max_volume', v)} min={0} max={100} />
            </div>
          </Section>

          <Section title="Hide Controls" icon={<Eye size={14} />} defaultOpen={false}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <ControlInput label="Hide Play/Pause" type="checkbox" value={(config as any).hide?.play_pause_button} onChange={(v) => updateConfig('hide', { ...(config as any).hide, play_pause_button: v })} />
              <ControlInput label="Hide Volume" type="checkbox" value={(config as any).hide?.volume_button} onChange={(v) => updateConfig('hide', { ...(config as any).hide, volume_button: v })} />
              <ControlInput label="Hide Previous" type="checkbox" value={(config as any).hide?.previous_button} onChange={(v) => updateConfig('hide', { ...(config as any).hide, previous_button: v })} />
              <ControlInput label="Hide Next" type="checkbox" value={(config as any).hide?.next_button} onChange={(v) => updateConfig('hide', { ...(config as any).hide, next_button: v })} />
              <ControlInput label="Hide Power" type="checkbox" value={(config as any).hide?.power_button} onChange={(v) => updateConfig('hide', { ...(config as any).hide, power_button: v })} />
            </div>
          </Section>

          <Section title="Visibility" icon={<Eye size={14} />} defaultOpen={false}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <ControlInput label="Show Name" type="checkbox" value={(config as any).show_name} onChange={(v) => updateConfig('show_name', v)} />
              <ControlInput label="Show Icon" type="checkbox" value={(config as any).show_icon} onChange={(v) => updateConfig('show_icon', v)} />
              <ControlInput label="Show State" type="checkbox" value={(config as any).show_state} onChange={(v) => updateConfig('show_state', v)} />
              <ControlInput label="Scrolling Effect" type="checkbox" value={(config as any).scrolling_effect} onChange={(v) => updateConfig('scrolling_effect', v)} />
            </div>
          </Section>

          <Section title="Layout" icon={<Layout size={14} />} defaultOpen={false}>
            <ControlInput label="Card Layout" type="select" value={(config as any).card_layout || 'normal'} onChange={(v) => updateConfig('card_layout', v)} options={CARD_LAYOUT_OPTIONS.map(o => ({ value: o.value, label: o.label }))} />
            <ControlInput label="Rows" type="range" value={(config as any).rows || 1} onChange={(v) => updateConfig('rows', v)} min={1} max={4} step={1} />
          </Section>

          <Section title="Sub-buttons" icon={<Sparkles size={14} />} defaultOpen={false} badge={(config as any).sub_button?.length || undefined}>
            <SubButtonEditor subButtons={(config as any).sub_button || []} onChange={(subs) => updateConfig('sub_button', subs)} />
          </Section>

          <Section title="Styling" icon={<Palette size={14} />} defaultOpen={false}>
            <StylesEditor config={config as any} updateConfig={updateConfig} />
          </Section>
        </>
      )}

      {/* ============================================ */}
      {/* CLIMATE CARD OPTIONS */}
      {/* ============================================ */}
      {isClimate && (
        <>
          <Section title="Entity & Display" icon={<Thermometer size={14} />} defaultOpen={true}>
            <ControlInput label="Entity (required)" type="text" value={(config as any).entity || ''} onChange={(v) => updateConfig('entity', v)} placeholder="climate.living_room" hint="Climate entity ID" />
            <ControlInput label="Name" type="text" value={(config as any).name || ''} onChange={(v) => updateConfig('name', v)} placeholder="Living Room Thermostat" />
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-medium">Icon</label>
              <IconPicker value={(config as any).icon || ''} onChange={(v) => updateConfig('icon', v)} />
            </div>
            <ControlInput label="Force Icon" type="checkbox" value={(config as any).force_icon} onChange={(v) => updateConfig('force_icon', v)} />
            <ControlInput label="State Color" type="checkbox" value={(config as any).state_color !== false} onChange={(v) => updateConfig('state_color', v)} />
          </Section>

          <Section title="Temperature" icon={<Sliders size={14} />} defaultOpen={false}>
            <div className="grid grid-cols-3 gap-2">
              <ControlInput label="Min Temp" type="number" value={(config as any).min_temp ?? 16} onChange={(v) => updateConfig('min_temp', v)} />
              <ControlInput label="Max Temp" type="number" value={(config as any).max_temp ?? 30} onChange={(v) => updateConfig('max_temp', v)} />
              <ControlInput label="Step" type="number" value={(config as any).step ?? 0.5} onChange={(v) => updateConfig('step', v)} step={0.5} />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <ControlInput label="Hide Target Low" type="checkbox" value={(config as any).hide_target_temp_low} onChange={(v) => updateConfig('hide_target_temp_low', v)} />
              <ControlInput label="Hide Target High" type="checkbox" value={(config as any).hide_target_temp_high} onChange={(v) => updateConfig('hide_target_temp_high', v)} />
            </div>
          </Section>

          <Section title="Visibility" icon={<Eye size={14} />} defaultOpen={false}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <ControlInput label="Show Name" type="checkbox" value={(config as any).show_name} onChange={(v) => updateConfig('show_name', v)} />
              <ControlInput label="Show Icon" type="checkbox" value={(config as any).show_icon} onChange={(v) => updateConfig('show_icon', v)} />
              <ControlInput label="Show State" type="checkbox" value={(config as any).show_state} onChange={(v) => updateConfig('show_state', v)} />
            </div>
          </Section>

          <Section title="Layout" icon={<Layout size={14} />} defaultOpen={false}>
            <ControlInput label="Card Layout" type="select" value={(config as any).card_layout || 'normal'} onChange={(v) => updateConfig('card_layout', v)} options={CARD_LAYOUT_OPTIONS.map(o => ({ value: o.value, label: o.label }))} />
            <ControlInput label="Rows" type="range" value={(config as any).rows || 1} onChange={(v) => updateConfig('rows', v)} min={1} max={4} step={1} />
          </Section>

          <Section title="Sub-buttons" icon={<Sparkles size={14} />} defaultOpen={false} badge={(config as any).sub_button?.length || undefined}>
            <SubButtonEditor subButtons={(config as any).sub_button || []} onChange={(subs) => updateConfig('sub_button', subs)} />
          </Section>

          <Section title="Styling" icon={<Palette size={14} />} defaultOpen={false}>
            <StylesEditor config={config as any} updateConfig={updateConfig} />
          </Section>
        </>
      )}

      {/* ============================================ */}
      {/* SELECT CARD OPTIONS */}
      {/* ============================================ */}
      {isSelect && (
        <>
          <Section title="Entity & Display" icon={<Zap size={14} />} defaultOpen={true}>
            <ControlInput label="Entity (required)" type="text" value={(config as any).entity || ''} onChange={(v) => updateConfig('entity', v)} placeholder="input_select.mode" hint="Select/Input Select entity ID" />
            <ControlInput label="Name" type="text" value={(config as any).name || ''} onChange={(v) => updateConfig('name', v)} placeholder="Mode" />
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-medium">Icon</label>
              <IconPicker value={(config as any).icon || ''} onChange={(v) => updateConfig('icon', v)} />
            </div>
            <ControlInput label="Force Icon" type="checkbox" value={(config as any).force_icon} onChange={(v) => updateConfig('force_icon', v)} />
          </Section>

          <Section title="Visibility" icon={<Eye size={14} />} defaultOpen={false}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <ControlInput label="Show Name" type="checkbox" value={(config as any).show_name} onChange={(v) => updateConfig('show_name', v)} />
              <ControlInput label="Show Icon" type="checkbox" value={(config as any).show_icon} onChange={(v) => updateConfig('show_icon', v)} />
              <ControlInput label="Show State" type="checkbox" value={(config as any).show_state} onChange={(v) => updateConfig('show_state', v)} />
              <ControlInput label="Scrolling Effect" type="checkbox" value={(config as any).scrolling_effect} onChange={(v) => updateConfig('scrolling_effect', v)} />
            </div>
          </Section>

          <Section title="Layout" icon={<Layout size={14} />} defaultOpen={false}>
            <ControlInput label="Card Layout" type="select" value={(config as any).card_layout || 'normal'} onChange={(v) => updateConfig('card_layout', v)} options={CARD_LAYOUT_OPTIONS.map(o => ({ value: o.value, label: o.label }))} />
            <ControlInput label="Rows" type="range" value={(config as any).rows || 1} onChange={(v) => updateConfig('rows', v)} min={1} max={4} step={1} />
          </Section>

          <Section title="Sub-buttons" icon={<Sparkles size={14} />} defaultOpen={false} badge={(config as any).sub_button?.length || undefined}>
            <SubButtonEditor subButtons={(config as any).sub_button || []} onChange={(subs) => updateConfig('sub_button', subs)} />
          </Section>

          <Section title="Styling" icon={<Palette size={14} />} defaultOpen={false}>
            <StylesEditor config={config as any} updateConfig={updateConfig} />
          </Section>
        </>
      )}

      {/* ============================================ */}
      {/* CALENDAR CARD OPTIONS */}
      {/* ============================================ */}
      {isCalendar && (
        <>
          <Section title="Calendar Settings" icon={<Calendar size={14} />} defaultOpen={true}>
            <ControlInput label="Days to Show" type="number" value={(config as any).days ?? 7} onChange={(v) => updateConfig('days', v)} min={1} max={30} hint="Number of days to display" />
            <ControlInput label="Event Limit" type="number" value={(config as any).limit ?? 5} onChange={(v) => updateConfig('limit', v)} min={1} max={20} hint="Maximum events to show" />
            <ControlInput label="Show End Time" type="checkbox" value={(config as any).show_end !== false} onChange={(v) => updateConfig('show_end', v)} />
            <ControlInput label="Show Progress" type="checkbox" value={(config as any).show_progress !== false} onChange={(v) => updateConfig('show_progress', v)} />
            <ControlInput label="Scrolling Effect" type="checkbox" value={(config as any).scrolling_effect} onChange={(v) => updateConfig('scrolling_effect', v)} />
          </Section>

          <Section title="Entities" icon={<Zap size={14} />} defaultOpen={true}>
            <p className="text-xs text-gray-500 mb-2">Add calendar entities to display. Each can have its own color.</p>
            {/* TODO: Add entity list editor */}
            <ControlInput 
              label="Entities (JSON)" 
              type="textarea" 
              value={JSON.stringify((config as any).entities || [], null, 2)} 
              onChange={(v) => {
                try { updateConfig('entities', JSON.parse(v)); } catch {}
              }}
              placeholder='[{"entity": "calendar.home", "color": "#ff0000"}]'
              hint="Array of {entity, color} objects"
            />
          </Section>

          <Section title="Layout" icon={<Layout size={14} />} defaultOpen={false}>
            <ControlInput label="Card Layout" type="select" value={(config as any).card_layout || 'normal'} onChange={(v) => updateConfig('card_layout', v)} options={CARD_LAYOUT_OPTIONS.map(o => ({ value: o.value, label: o.label }))} />
            <ControlInput label="Rows" type="range" value={(config as any).rows || 1} onChange={(v) => updateConfig('rows', v)} min={1} max={4} step={1} />
          </Section>

          <Section title="Sub-buttons" icon={<Sparkles size={14} />} defaultOpen={false} badge={(config as any).sub_button?.length || undefined}>
            <SubButtonEditor subButtons={(config as any).sub_button || []} onChange={(subs) => updateConfig('sub_button', subs)} />
          </Section>

          <Section title="Styling" icon={<Palette size={14} />} defaultOpen={false}>
            <StylesEditor config={config as any} updateConfig={updateConfig} />
          </Section>
        </>
      )}

      {/* ============================================ */}
      {/* HORIZONTAL BUTTONS STACK OPTIONS */}
      {/* ============================================ */}
      {isHorizontalStack && (
        <>
          <Section title="Navigation Buttons" icon={<Layers size={14} />} defaultOpen={true}>
            <p className="text-xs text-gray-500 mb-2">Add navigation buttons. Each needs a link (hash or path).</p>
            <ControlInput 
              label="Buttons (JSON)" 
              type="textarea" 
              value={JSON.stringify((config as any).buttons || [], null, 2)} 
              onChange={(v) => {
                try { updateConfig('buttons', JSON.parse(v)); } catch {}
              }}
              placeholder='[{"link": "#living-room", "name": "Living Room", "icon": "mdi:sofa"}]'
              hint="Array of {link, name, icon, entity, pir_sensor}"
            />
          </Section>

          <Section title="Behavior" icon={<MousePointer size={14} />} defaultOpen={false}>
            <ControlInput label="Auto Order" type="checkbox" value={(config as any).auto_order} onChange={(v) => updateConfig('auto_order', v)} />
            <ControlInput label="Highlight Current View" type="checkbox" value={(config as any).highlight_current_view} onChange={(v) => updateConfig('highlight_current_view', v)} />
            <ControlInput label="Rise Animation" type="checkbox" value={(config as any).rise_animation !== false} onChange={(v) => updateConfig('rise_animation', v)} />
            <ControlInput label="Hide Gradient" type="checkbox" value={(config as any).hide_gradient} onChange={(v) => updateConfig('hide_gradient', v)} />
            <ControlInput label="Is Sidebar Hidden" type="checkbox" value={(config as any).is_sidebar_hidden} onChange={(v) => updateConfig('is_sidebar_hidden', v)} />
          </Section>

          <Section title="Appearance" icon={<Palette size={14} />} defaultOpen={false}>
            <ControlInput label="Width (Desktop)" type="text" value={(config as any).width_desktop || '540px'} onChange={(v) => updateConfig('width_desktop', v)} placeholder="540px" />
            <ControlInput label="Margin" type="text" value={(config as any).margin || '7px'} onChange={(v) => updateConfig('margin', v)} placeholder="7px" />
          </Section>

          <Section title="Styling" icon={<Palette size={14} />} defaultOpen={false}>
            <StylesEditor config={config as any} updateConfig={updateConfig} />
          </Section>
        </>
      )}
    </div>
  );
}

export default BubbleConfigPanel;
