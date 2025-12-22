// Bubble Card Config Panel - Enhanced with full customization

import React, { useState, useEffect } from 'react';
import { 
  BubbleButtonConfig, 
  BubbleSubButton, 
  BubbleAction, 
  BubbleActionType,
  BubbleConfig,
  BubbleCardType,
  BubbleHorizontalButton,
} from '../types';
import { 
  BUTTON_TYPE_OPTIONS, 
  CARD_LAYOUT_OPTIONS, 
  ACTION_TYPE_OPTIONS,
  COMMON_BUBBLE_ICONS,
  DEFAULT_SUB_BUTTON,
  DEFAULT_ACTION
} from '../constants';
import { ChevronDown, ChevronRight, Plus, Trash2, GripVertical, Palette, Zap, Layout, Eye, Sliders, MousePointer, Sparkles, Search, X, Home, Thermometer, Music, Blinds, Calendar, Layers, Puzzle } from 'lucide-react';
import { EntitySelector } from '../../components/EntitySelector';
import { haService } from '../../services/homeAssistantService';

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
        value={typeof value === 'boolean' ? String(value) : (value ?? '')}
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
        <div className="px-4 pb-4 space-y-3">
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
              
              <ControlInput
                label="Visibility (JS template)"
                type="text"
                value={sb.visibility}
                onChange={(v) => updateSubButton(index, { visibility: v })}
                placeholder="state === 'on'"
                hint="JavaScript condition to show/hide sub-button"
              />
              
              <div className="grid grid-cols-2 gap-2">
                <ControlInput
                  label="Show Background"
                  type="checkbox"
                  value={sb.show_background !== false}
                  onChange={(v) => updateSubButton(index, { show_background: v })}
                />
                <ControlInput
                  label="State Background"
                  type="checkbox"
                  value={sb.state_background !== false}
                  onChange={(v) => updateSubButton(index, { state_background: v })}
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
                <ControlInput
                  label="Show Arrow"
                  type="checkbox"
                  value={sb.show_arrow !== false}
                  onChange={(v) => updateSubButton(index, { show_arrow: v })}
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
              
              <ControlInput
                label="Select Attribute"
                type="text"
                value={sb.select_attribute}
                onChange={(v) => updateSubButton(index, { select_attribute: v })}
                placeholder="source"
                hint="For select entities - shows current value"
              />
              
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 font-medium">Dropdown Options (comma-separated)</label>
                <input
                  type="text"
                  className="w-full px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded outline-none focus:border-cyan-500"
                  value={(sb.dropdown || []).join(', ')}
                  onChange={(e) => updateSubButton(index, { dropdown: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  placeholder="option1, option2, option3"
                />
                <span className="text-xs text-gray-500">For select entities - creates dropdown menu</span>
              </div>
              
              <ControlInput
                label="Footer Entity"
                type="text"
                value={sb.footer_entity}
                onChange={(v) => updateSubButton(index, { footer_entity: v })}
                placeholder="sensor.additional_info"
                hint="Optional entity to display in footer"
              />
              
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

function formatModulesInput(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map(v => v.trim())
    .filter(Boolean);
}

// ============================================
// CALENDAR ENTITIES EDITOR
// ============================================

interface CalendarEntityEditorProps {
  entities: { entity: string; color?: string }[];
  onChange: (entities: { entity: string; color?: string }[]) => void;
}

function CalendarEntityEditor({ entities, onChange }: CalendarEntityEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addEntity = () => {
    onChange([...entities, { entity: '', color: '' }]);
    setExpandedIndex(entities.length);
  };

  const removeEntity = (index: number) => {
    onChange(entities.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const updateEntity = (index: number, updates: Partial<{ entity: string; color?: string }>) => {
    onChange(entities.map((ent, i) => (i === index ? { ...ent, ...updates } : ent)));
  };

  const moveEntity = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= entities.length) return;
    const next = [...entities];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    onChange(next);
    setExpandedIndex(newIndex);
  };

  return (
    <div className="space-y-2">
      {entities.map((ent, index) => (
        <div key={`${ent.entity || 'calendar'}-${index}`} className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between p-2 bg-gray-800">
            <button onClick={() => setExpandedIndex(expandedIndex === index ? null : index)} className="flex items-center gap-2 flex-1 text-left">
              <GripVertical size={14} className="text-gray-500" />
              <span className="text-sm text-gray-300 truncate">{ent.entity || `Calendar ${index + 1}`}</span>
            </button>
            <div className="flex gap-1">
              <button onClick={() => moveEntity(index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400">↑</button>
              <button onClick={() => moveEntity(index, 'down')} disabled={index === entities.length - 1} className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400">↓</button>
              <button onClick={() => removeEntity(index)} className="p-1 text-red-400 hover:text-red-300">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {expandedIndex === index && (
            <div className="p-3 space-y-3 border-t border-gray-700">
              <ControlInput
                label="Entity"
                type="text"
                value={ent.entity}
                onChange={(v) => updateEntity(index, { entity: v })}
                placeholder="calendar.home"
              />
              <ControlInput
                label="Color"
                type="color"
                value={ent.color || ''}
                onChange={(v) => updateEntity(index, { color: v || undefined })}
              />
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addEntity}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded-lg border border-cyan-600/30 transition-colors"
      >
        <Plus size={16} />
        Add Calendar Entity
      </button>
    </div>
  );
}

// ============================================
// HORIZONTAL BUTTONS EDITOR
// ============================================

interface HorizontalButtonsEditorProps {
  buttons: BubbleHorizontalButton[];
  onChange: (buttons: BubbleHorizontalButton[]) => void;
}

function HorizontalButtonsEditor({ buttons, onChange }: HorizontalButtonsEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addButton = () => {
    onChange([...buttons, { link: '', name: '', icon: '', entity: '', pir_sensor: '' }]);
    setExpandedIndex(buttons.length);
  };

  const removeButton = (index: number) => {
    onChange(buttons.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const updateButton = (index: number, updates: Partial<BubbleHorizontalButton>) => {
    onChange(buttons.map((btn, i) => (i === index ? { ...btn, ...updates } : btn)));
  };

  const moveButton = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= buttons.length) return;
    const next = [...buttons];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    onChange(next);
    setExpandedIndex(newIndex);
  };

  return (
    <div className="space-y-2">
      {buttons.map((btn, index) => (
        <div key={`${btn.link || 'button'}-${index}`} className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between p-2 bg-gray-800">
            <button onClick={() => setExpandedIndex(expandedIndex === index ? null : index)} className="flex items-center gap-2 flex-1 text-left">
              <GripVertical size={14} className="text-gray-500" />
              <span className="text-sm text-gray-300 truncate">{btn.name || btn.link || `Button ${index + 1}`}</span>
            </button>
            <div className="flex gap-1">
              <button onClick={() => moveButton(index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400">↑</button>
              <button onClick={() => moveButton(index, 'down')} disabled={index === buttons.length - 1} className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400">↓</button>
              <button onClick={() => removeButton(index)} className="p-1 text-red-400 hover:text-red-300">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {expandedIndex === index && (
            <div className="p-3 space-y-3 border-t border-gray-700">
              <ControlInput
                label="Link (hash or path)"
                type="text"
                value={btn.link}
                onChange={(v) => updateButton(index, { link: v })}
                placeholder="#kitchen or /lovelace/room"
              />
              <ControlInput
                label="Name"
                type="text"
                value={btn.name}
                onChange={(v) => updateButton(index, { name: v })}
                placeholder="Kitchen"
              />
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 font-medium">Icon</label>
                <IconPicker value={btn.icon || ''} onChange={(v) => updateButton(index, { icon: v })} />
              </div>
              <ControlInput
                label="Entity (for color)"
                type="text"
                value={btn.entity}
                onChange={(v) => updateButton(index, { entity: v })}
                placeholder="light.living_room"
              />
              <ControlInput
                label="PIR Sensor (for auto order)"
                type="text"
                value={btn.pir_sensor}
                onChange={(v) => updateButton(index, { pir_sensor: v })}
                placeholder="binary_sensor.motion"
              />
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addButton}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded-lg border border-cyan-600/30 transition-colors"
      >
        <Plus size={16} />
        Add Navigation Button
      </button>
    </div>
  );
}

// ============================================
// STATE APPEARANCE BUILDER
// ============================================

interface StateAppearanceBuilderProps {
  entityId: string;
  appendSnippet: (snippet: string) => void;
}

interface StateConfig {
  color?: string;
  icon?: string;
  backgroundColor?: string;
  borderColor?: string;
}

function StateAppearanceBuilder({ entityId, appendSnippet }: StateAppearanceBuilderProps) {
  const [states, setStates] = useState<Record<string, StateConfig>>({});
  const [currentState, setCurrentState] = useState('on');
  const [showConfig, setShowConfig] = useState(false);

  const commonStates = ['on', 'off', 'unavailable', 'unknown', 'idle', 'playing', 'paused', 'locked', 'unlocked', 'open', 'closed', 'home', 'away'];

  const applyStateStyles = () => {
    const stateEntries = Object.entries(states).filter(([_, config]: [string, StateConfig]) => 
      config.color || config.icon || config.backgroundColor || config.borderColor
    );

    if (stateEntries.length === 0) return;

    let snippet = '';
    
    // Generate icon color conditions
    const colorStates = stateEntries.filter(([_, c]: [string, StateConfig]) => c.color);
    if (colorStates.length > 0) {
      snippet += '.bubble-icon {\n  color:';
      colorStates.forEach(([state, config]: [string, StateConfig], idx) => {
        const condition = `hass.states["${entityId}"]?.state === "${state}"`;
        snippet += ` \${${condition} ? "${config.color}"`;
      });
      snippet += ' : ""}';
      for (let i = 0; i < colorStates.length; i++) snippet += '}';
      snippet += ' !important;\n}\n\n';
    }

    // Generate background color conditions
    const bgStates = stateEntries.filter(([_, c]: [string, StateConfig]) => c.backgroundColor);
    if (bgStates.length > 0) {
      snippet += '.bubble-button-background {\n  background:';
      bgStates.forEach(([state, config]: [string, StateConfig], idx) => {
        const condition = `hass.states["${entityId}"]?.state === "${state}"`;
        snippet += ` \${${condition} ? "${config.backgroundColor}"`;
      });
      snippet += ' : ""}';
      for (let i = 0; i < bgStates.length; i++) snippet += '}';
      snippet += ' !important;\n}\n\n';
    }

    // Generate border color conditions
    const borderStates = stateEntries.filter(([_, c]: [string, StateConfig]) => c.borderColor);
    if (borderStates.length > 0) {
      snippet += '.bubble-button-card-container {\n  border:';
      borderStates.forEach(([state, config]: [string, StateConfig], idx) => {
        const condition = `hass.states["${entityId}"]?.state === "${state}"`;
        snippet += ` \${${condition} ? "2px solid ${config.borderColor}"`;
      });
      snippet += ' : "2px solid transparent"}';
      for (let i = 0; i < borderStates.length; i++) snippet += '}';
      snippet += ' !important;\n}';
    }

    if (snippet) {
      appendSnippet(snippet.trim());
    }
  };

  const updateStateConfig = (state: string, key: string, value: string) => {
    setStates({
      ...states,
      [state]: {
        ...states[state],
        [key]: value || undefined,
      }
    });
  };

  const removeState = (state: string) => {
    const newStates = { ...states };
    delete newStates[state];
    setStates(newStates);
  };

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-gray-500">
        {entityId ? `Configure appearance for different states of ${entityId}` : 'Set an entity to configure state-based appearance'}
      </p>

      {!entityId && (
        <div className="p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg text-xs text-yellow-200">
          Please set an entity on the card to use state-based appearance
        </div>
      )}

      {entityId && (
        <>
          {/* State Selector */}
          <div className="flex gap-2">
            <select
              value={currentState}
              onChange={(e) => setCurrentState(e.target.value)}
              className="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
            >
              <optgroup label="Common States">
                {commonStates.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </optgroup>
              <option value="custom">Custom State...</option>
            </select>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium"
            >
              {showConfig ? 'Hide' : 'Configure'}
            </button>
          </div>

          {/* State Configuration */}
          {showConfig && (
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 space-y-3">
              {currentState === 'custom' ? (
                <input
                  type="text"
                  placeholder="Enter custom state (e.g., playing, heating)"
                  onBlur={(e) => {
                    if (e.target.value) {
                      setCurrentState(e.target.value);
                    }
                  }}
                  className="w-full bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
                />
              ) : (
                <>
                  <p className="text-xs font-medium text-gray-300">Styling for "{currentState}" state</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Icon Color</label>
                      <input
                        type="text"
                        value={states[currentState]?.color || ''}
                        onChange={(e) => updateStateConfig(currentState, 'color', e.target.value)}
                        placeholder="red, #ff0000"
                        className="w-full bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Background</label>
                      <input
                        type="text"
                        value={states[currentState]?.backgroundColor || ''}
                        onChange={(e) => updateStateConfig(currentState, 'backgroundColor', e.target.value)}
                        placeholder="rgba(255,0,0,0.2)"
                        className="w-full bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-xs text-gray-400 mb-1 block">Border Color</label>
                      <input
                        type="text"
                        value={states[currentState]?.borderColor || ''}
                        onChange={(e) => updateStateConfig(currentState, 'borderColor', e.target.value)}
                        placeholder="red, #ff0000"
                        className="w-full bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {states[currentState] && Object.values(states[currentState]).some(v => v) && (
                    <button
                      onClick={() => removeState(currentState)}
                      className="w-full px-2 py-1 text-xs bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded"
                    >
                      Clear "{currentState}" Styles
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Configured States */}
          {Object.keys(states).length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400 font-medium">Configured States ({Object.keys(states).length})</p>
                <button
                  onClick={applyStateStyles}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-xs font-medium"
                >
                  Generate Styles
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(states).map(([state, config]: [string, StateConfig]) => (
                  <div key={state} className="p-2 bg-gray-800/50 rounded border border-gray-700">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-cyan-400">{state}</span>
                      <button
                        onClick={() => removeState(state)}
                        className="p-0.5 hover:bg-red-900/30 rounded text-red-400"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div className="space-y-0.5 text-[10px] text-gray-400">
                      {config.color && <div>Icon: <span className="text-gray-300">{config.color}</span></div>}
                      {config.backgroundColor && <div>BG: <span className="text-gray-300">{config.backgroundColor}</span></div>}
                      {config.borderColor && <div>Border: <span className="text-gray-300">{config.borderColor}</span></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Presets */}
          <div className="pt-2 border-t border-gray-700">
            <p className="text-xs text-gray-400 font-medium mb-2">Quick Presets</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setStates({
                    on: { color: 'var(--bubble-accent-color)', backgroundColor: 'var(--bubble-accent-color)' },
                    off: { color: 'var(--primary-text-color)', backgroundColor: '' }
                  });
                }}
                className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
              >
                On/Off Basic
              </button>
              <button
                onClick={() => {
                  setStates({
                    on: { borderColor: 'green' },
                    off: { borderColor: 'gray' },
                    unavailable: { borderColor: 'red' }
                  });
                }}
                className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
              >
                Status Borders
              </button>
              <button
                onClick={() => {
                  setStates({
                    home: { color: 'green', borderColor: 'green' },
                    away: { color: 'orange', borderColor: 'orange' },
                    unknown: { color: 'gray', borderColor: 'gray' }
                  });
                }}
                className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
              >
                Presence
              </button>
              <button
                onClick={() => setStates({})}
                className="px-2 py-1 text-xs bg-red-800/40 hover:bg-red-800/60 text-red-200 rounded"
              >
                Clear All
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================
// CONDITIONAL STYLING BUILDER
// ============================================

interface ConditionalRule {
  id: string;
  entity: string;
  attribute?: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: string;
  cssTarget: string;
  cssProperty: string;
  cssValue: string;
  elseValue?: string;
}

interface ConditionalStylingBuilderProps {
  appendSnippet: (snippet: string) => void;
}

function ConditionalStylingBuilder({ appendSnippet }: ConditionalStylingBuilderProps) {
  const [rules, setRules] = useState<ConditionalRule[]>([]);
  const [currentRule, setCurrentRule] = useState<Partial<ConditionalRule>>({
    entity: '',
    operator: 'equals',
    value: '',
    cssTarget: '.bubble-button-card-container',
    cssProperty: 'background',
    cssValue: '',
  });
  const [entityAttributes, setEntityAttributes] = useState<string[]>([]);

  useEffect(() => {
    if (currentRule.entity) {
      loadEntityAttributes(currentRule.entity);
    }
  }, [currentRule.entity]);

  const loadEntityAttributes = async (entityId: string) => {
    try {
      const attrs = await haService.getEntityAttributes(entityId);
      setEntityAttributes(attrs);
    } catch (error) {
      setEntityAttributes([]);
    }
  };

  const generateCondition = (rule: ConditionalRule): string => {
    const entityRef = `hass.states["${rule.entity}"]`;
    const valueRef = rule.attribute ? `${entityRef}?.attributes?.${rule.attribute}` : `${entityRef}?.state`;
    
    let condition = '';
    switch (rule.operator) {
      case 'equals':
        condition = `${valueRef} === "${rule.value}"`;
        break;
      case 'not_equals':
        condition = `${valueRef} !== "${rule.value}"`;
        break;
      case 'greater_than':
        condition = `Number(${valueRef}) > ${rule.value}`;
        break;
      case 'less_than':
        condition = `Number(${valueRef}) < ${rule.value}`;
        break;
      case 'contains':
        condition = `String(${valueRef}).includes("${rule.value}")`;
        break;
    }
    
    return condition;
  };

  const generateSnippet = (rule: ConditionalRule): string => {
    const condition = generateCondition(rule);
    const elseVal = rule.elseValue || '""';
    return `${rule.cssTarget} {\n  ${rule.cssProperty}: \${${condition} ? "${rule.cssValue}" : ${elseVal}} !important;\n}`;
  };

  const addRule = () => {
    if (!currentRule.entity || !currentRule.value || !currentRule.cssProperty || !currentRule.cssValue) {
      return;
    }

    const rule: ConditionalRule = {
      id: Date.now().toString(),
      entity: currentRule.entity,
      attribute: currentRule.attribute,
      operator: currentRule.operator || 'equals',
      value: currentRule.value,
      cssTarget: currentRule.cssTarget || '.bubble-button-card-container',
      cssProperty: currentRule.cssProperty,
      cssValue: currentRule.cssValue,
      elseValue: currentRule.elseValue,
    };

    const snippet = generateSnippet(rule);
    appendSnippet(snippet);
    setRules([...rules, rule]);
    
    // Reset form
    setCurrentRule({
      entity: '',
      operator: 'equals',
      value: '',
      cssTarget: '.bubble-button-card-container',
      cssProperty: 'background',
      cssValue: '',
    });
    setEntityAttributes([]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const cssTargets = [
    { value: '.bubble-button-card-container', label: 'Card Container' },
    { value: '.bubble-icon', label: 'Icon' },
    { value: '.bubble-name', label: 'Name' },
    { value: '.bubble-state', label: 'State' },
    { value: '.bubble-button-background', label: 'Background' },
    { value: '.bubble-sub-button', label: 'All Sub-buttons' },
    { value: '.bubble-sub-button-1', label: 'Sub-button 1' },
    { value: '.bubble-sub-button-2', label: 'Sub-button 2' },
    { value: '.bubble-sub-button-3', label: 'Sub-button 3' },
    { value: '.bubble-sub-button-4', label: 'Sub-button 4' },
  ];

  const cssProperties = [
    { value: 'background', label: 'Background' },
    { value: 'color', label: 'Color' },
    { value: 'border', label: 'Border' },
    { value: 'box-shadow', label: 'Shadow' },
    { value: 'opacity', label: 'Opacity' },
    { value: 'display', label: 'Display' },
    { value: 'filter', label: 'Filter' },
    { value: 'transform', label: 'Transform' },
  ];

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-gray-500">Style the card based on other entity states and attributes</p>
      
      {/* Rule Builder */}
      <div className="p-3 bg-gray-800/50 rounded-lg space-y-3 border border-gray-700">
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2">
            <label className="text-xs text-gray-400 mb-1 block">Condition Entity</label>
            <EntitySelector
              value={currentRule.entity || ''}
              onChange={(v) => setCurrentRule({ ...currentRule, entity: v })}
              placeholder="sensor.temperature"
              allowAll={true}
            />
          </div>

          {entityAttributes.length > 0 && (
            <div className="col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">Attribute (optional - leave empty for state)</label>
              <select
                value={currentRule.attribute || ''}
                onChange={(e) => setCurrentRule({ ...currentRule, attribute: e.target.value || undefined })}
                className="w-full bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
              >
                <option value="">Use entity state</option>
                {entityAttributes.map(attr => (
                  <option key={attr} value={attr}>{attr}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Operator</label>
            <select
              value={currentRule.operator || 'equals'}
              onChange={(e) => setCurrentRule({ ...currentRule, operator: e.target.value as any })}
              className="w-full bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
            >
              <option value="equals">Equals</option>
              <option value="not_equals">Not Equals</option>
              <option value="greater_than">Greater Than</option>
              <option value="less_than">Less Than</option>
              <option value="contains">Contains</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Value</label>
            <input
              type="text"
              value={currentRule.value || ''}
              onChange={(e) => setCurrentRule({ ...currentRule, value: e.target.value })}
              placeholder="on, 25, etc"
              className="w-full bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Target Element</label>
            <select
              value={currentRule.cssTarget || '.bubble-button-card-container'}
              onChange={(e) => setCurrentRule({ ...currentRule, cssTarget: e.target.value })}
              className="w-full bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
            >
              {cssTargets.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">CSS Property</label>
            <select
              value={currentRule.cssProperty || 'background'}
              onChange={(e) => setCurrentRule({ ...currentRule, cssProperty: e.target.value })}
              className="w-full bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
            >
              {cssProperties.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Value When True</label>
            <input
              type="text"
              value={currentRule.cssValue || ''}
              onChange={(e) => setCurrentRule({ ...currentRule, cssValue: e.target.value })}
              placeholder="red, none, 1, etc"
              className="w-full bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Value When False (optional)</label>
            <input
              type="text"
              value={currentRule.elseValue || ''}
              onChange={(e) => setCurrentRule({ ...currentRule, elseValue: e.target.value })}
              placeholder="Leave empty or specify"
              className="w-full bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={addRule}
          disabled={!currentRule.entity || !currentRule.value || !currentRule.cssProperty || !currentRule.cssValue}
          className="w-full px-3 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={14} />
          Add Conditional Style
        </button>
      </div>

      {/* Active Rules */}
      {rules.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 font-medium">Active Conditionals ({rules.length})</p>
          {rules.map(rule => (
            <div key={rule.id} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded border border-gray-700">
              <div className="flex-1 text-xs text-gray-300">
                <span className="text-cyan-400">{rule.entity}</span>
                {rule.attribute && <span className="text-gray-500">.{rule.attribute}</span>}
                {' '}<span className="text-gray-500">{rule.operator}</span>{' '}
                <span className="text-yellow-400">"{rule.value}"</span>
                {' → '}
                <span className="text-purple-400">{rule.cssProperty}</span>
                {': '}
                <span className="text-green-400">{rule.cssValue}</span>
              </div>
              <button
                onClick={() => removeRule(rule.id)}
                className="p-1 hover:bg-red-900/30 rounded text-red-400"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Quick Examples */}
      <div className="pt-2 border-t border-gray-700">
        <p className="text-xs text-gray-400 font-medium mb-2">Quick Examples</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setCurrentRule({
                entity: 'binary_sensor.front_door',
                operator: 'equals',
                value: 'on',
                cssTarget: '.bubble-button-card-container',
                cssProperty: 'border',
                cssValue: '2px solid red',
              });
            }}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Red Border When Door Open
          </button>
          <button
            onClick={() => {
              setCurrentRule({
                entity: 'sensor.temperature',
                attribute: '',
                operator: 'greater_than',
                value: '25',
                cssTarget: '.bubble-icon',
                cssProperty: 'color',
                cssValue: 'orange',
              });
            }}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Orange Icon When Hot
          </button>
          <button
            onClick={() => {
              setCurrentRule({
                entity: 'person.home',
                operator: 'equals',
                value: 'home',
                cssTarget: '.bubble-button-card-container',
                cssProperty: 'display',
                cssValue: 'block',
                elseValue: 'none',
              });
            }}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Show Only When Home
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STYLES EDITOR WITH CSS VARIABLES
// ============================================

interface StylesEditorProps {
  config: BubbleConfig;
  updateConfig: (key: string, value: any) => void;
}

function StylesEditor({ config, updateConfig }: StylesEditorProps) {
  // Get the entity ID from config
  const entityId = (config as any).entity || '';
  
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
  
  const [cssVars, setCssVars] = useState<Record<string, string>>(() => {
    if ('styles' in config && config.styles) {
      return parseStyles(config.styles);
    }
    return {};
  });
  const [customCSS, setCustomCSS] = useState(() => {
    // Extract non-variable CSS
    const styles = 'styles' in config ? (config.styles || '') : '';
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

  const appendSnippet = (snippet: string) => {
    // Check if snippet already exists to prevent duplicates
    if (customCSS.includes(snippet.trim())) {
      return; // Snippet already exists, don't add it again
    }
    const next = customCSS.trim() ? `${customCSS.trim()}\n\n${snippet}` : snippet;
    setCustomCSS(next);
    updateStyles(cssVars, next);
  };

  const resetStyles = () => {
    setCssVars({});
    setCustomCSS('');
    updateStyles({}, '');
  };

  return (
    <div className="space-y-2">
      {/* Global Styles */}
      <Section title="Global Styles" icon={<Palette size={12} />} defaultOpen={true}>
        <div className="space-y-3">
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
      </Section>

      {/* Card-specific variables */}
      <Section title="Button / Slider" icon={<MousePointer size={12} />} defaultOpen={false}>
        <div className="space-y-3">
        <ControlInput label="Button Background" type="color" value={cssVars['--bubble-button-main-background-color'] || ''} onChange={(v) => updateVar('--bubble-button-main-background-color', v)} />
        <ControlInput label="Button Border Radius" type="text" value={cssVars['--bubble-button-border-radius'] || ''} onChange={(v) => updateVar('--bubble-button-border-radius', v)} placeholder="24px" />
        <ControlInput label="Icon Background" type="color" value={cssVars['--bubble-button-icon-background-color'] || ''} onChange={(v) => updateVar('--bubble-button-icon-background-color', v)} />
        <ControlInput label="Light Color" type="color" value={cssVars['--bubble-light-color'] || ''} onChange={(v) => updateVar('--bubble-light-color', v)} />
        <ControlInput label="Light White Color" type="color" value={cssVars['--bubble-light-white-color'] || ''} onChange={(v) => updateVar('--bubble-light-white-color', v)} />
        </div>
      </Section>

      <Section title="Pop-up" icon={<Layers size={12} />} defaultOpen={false}>
        <div className="space-y-3">
        <ControlInput label="Pop-up Background" type="color" value={cssVars['--bubble-pop-up-background-color'] || ''} onChange={(v) => updateVar('--bubble-pop-up-background-color', v)} />
        <ControlInput label="Pop-up Main Background" type="color" value={cssVars['--bubble-pop-up-main-background-color'] || ''} onChange={(v) => updateVar('--bubble-pop-up-main-background-color', v)} />
        <ControlInput label="Backdrop Background" type="color" value={cssVars['--bubble-backdrop-background-color'] || ''} onChange={(v) => updateVar('--bubble-backdrop-background-color', v)} />
        <ControlInput label="Pop-up Border Radius" type="text" value={cssVars['--bubble-pop-up-border-radius'] || ''} onChange={(v) => updateVar('--bubble-pop-up-border-radius', v)} placeholder="24px" />
        </div>
      </Section>

      <Section title="Media Player" icon={<Music size={12} />} defaultOpen={false}>
        <div className="space-y-3">
        <ControlInput label="Media Background" type="color" value={cssVars['--bubble-media-player-main-background-color'] || ''} onChange={(v) => updateVar('--bubble-media-player-main-background-color', v)} />
        <ControlInput label="Media Border Radius" type="text" value={cssVars['--bubble-media-player-border-radius'] || ''} onChange={(v) => updateVar('--bubble-media-player-border-radius', v)} placeholder="24px" />
        <ControlInput label="Media Buttons Radius" type="text" value={cssVars['--bubble-media-player-buttons-border-radius'] || ''} onChange={(v) => updateVar('--bubble-media-player-buttons-border-radius', v)} placeholder="14px" />
        <ControlInput label="Slider Background" type="color" value={cssVars['--bubble-media-player-slider-background-color'] || ''} onChange={(v) => updateVar('--bubble-media-player-slider-background-color', v)} />
        <ControlInput label="Media Icon Background" type="color" value={cssVars['--bubble-media-player-icon-background-color'] || ''} onChange={(v) => updateVar('--bubble-media-player-icon-background-color', v)} />
        </div>
      </Section>

      <Section title="Select" icon={<ChevronDown size={12} />} defaultOpen={false}>
        <div className="space-y-3">
        <ControlInput label="Select Background" type="color" value={cssVars['--bubble-select-main-background-color'] || ''} onChange={(v) => updateVar('--bubble-select-main-background-color', v)} />
        <ControlInput label="Dropdown Background" type="color" value={cssVars['--bubble-select-list-background-color'] || ''} onChange={(v) => updateVar('--bubble-select-list-background-color', v)} />
        <ControlInput label="Dropdown Width" type="text" value={cssVars['--bubble-select-list-width'] || ''} onChange={(v) => updateVar('--bubble-select-list-width', v)} placeholder="220px" />
        <ControlInput label="Item Accent Color" type="color" value={cssVars['--bubble-select-list-item-accent-color'] || ''} onChange={(v) => updateVar('--bubble-select-list-item-accent-color', v)} />
        <ControlInput label="Select Border Radius" type="text" value={cssVars['--bubble-select-border-radius'] || ''} onChange={(v) => updateVar('--bubble-select-border-radius', v)} placeholder="24px" />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              updateVar('--bubble-select-main-background-color', '#0f172a');
              updateVar('--bubble-select-list-background-color', '#0b1220');
              updateVar('--bubble-select-list-width', '200px');
              updateVar('--bubble-select-border-radius', '20px');
            }}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Compact Dropdown
          </button>
          <button
            onClick={() => {
              updateVar('--bubble-select-main-background-color', '#111827');
              updateVar('--bubble-select-list-background-color', '#1f2937');
              updateVar('--bubble-select-list-width', '280px');
              updateVar('--bubble-select-border-radius', '28px');
            }}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Wide Dropdown
          </button>
          <button
            onClick={() => {
              updateVar('--bubble-select-main-background-color', 'rgba(255,255,255,0.06)');
              updateVar('--bubble-select-list-background-color', 'rgba(0,0,0,0.6)');
              updateVar('--bubble-select-list-width', '240px');
              updateVar('--bubble-select-border-radius', '24px');
              setCustomCSS((prev) => `${prev}\n.bubble-select-list { backdrop-filter: blur(10px); }`.trim());
            }}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Glass Dropdown
          </button>
        </div>
        </div>
      </Section>

      <Section title="Climate" icon={<Thermometer size={12} />} defaultOpen={false}>
        <div className="space-y-3">
        <ControlInput label="Climate Background" type="color" value={cssVars['--bubble-climate-main-background-color'] || ''} onChange={(v) => updateVar('--bubble-climate-main-background-color', v)} />
        <ControlInput label="Climate Border Radius" type="text" value={cssVars['--bubble-climate-border-radius'] || ''} onChange={(v) => updateVar('--bubble-climate-border-radius', v)} placeholder="24px" />
        <ControlInput label="Climate Button Background" type="color" value={cssVars['--bubble-climate-button-background-color'] || ''} onChange={(v) => updateVar('--bubble-climate-button-background-color', v)} />
        <ControlInput label="Climate Accent" type="color" value={cssVars['--bubble-climate-accent-color'] || ''} onChange={(v) => updateVar('--bubble-climate-accent-color', v)} />
        <div className="grid grid-cols-2 gap-2">
          <ControlInput label="Heat Color" type="color" value={cssVars['--bubble-state-climate-heat-color'] || ''} onChange={(v) => updateVar('--bubble-state-climate-heat-color', v)} />
          <ControlInput label="Cool Color" type="color" value={cssVars['--bubble-state-climate-cool-color'] || ''} onChange={(v) => updateVar('--bubble-state-climate-cool-color', v)} />
          <ControlInput label="Auto Color" type="color" value={cssVars['--bubble-state-climate-auto-color'] || ''} onChange={(v) => updateVar('--bubble-state-climate-auto-color', v)} />
          <ControlInput label="Fan-only Color" type="color" value={cssVars['--bubble-state-climate-fan-only-color'] || ''} onChange={(v) => updateVar('--bubble-state-climate-fan-only-color', v)} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              updateVar('--bubble-state-climate-heat-color', '#ff7043');
              updateVar('--bubble-state-climate-cool-color', '#4fc3f7');
              updateVar('--bubble-state-climate-auto-color', '#26c6da');
              updateVar('--bubble-state-climate-fan-only-color', '#9ccc65');
            }}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Warm/Cool Palette
          </button>
          <button
            onClick={() => {
              updateVar('--bubble-state-climate-heat-color', '#ff5252');
              updateVar('--bubble-state-climate-cool-color', '#40c4ff');
              updateVar('--bubble-state-climate-auto-color', '#64ffda');
              updateVar('--bubble-state-climate-fan-only-color', '#cddc39');
            }}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            High Contrast
          </button>
          <button
            onClick={() => {
              updateVar('--bubble-state-climate-heat-color', '');
              updateVar('--bubble-state-climate-cool-color', '');
              updateVar('--bubble-state-climate-auto-color', '');
              updateVar('--bubble-state-climate-fan-only-color', '');
            }}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Reset Colors
          </button>
        </div>
        </div>
      </Section>

      <Section title="Cover" icon={<Blinds size={12} />} defaultOpen={false}>
        <div className="space-y-3">
        <ControlInput label="Cover Background" type="color" value={cssVars['--bubble-cover-main-background-color'] || ''} onChange={(v) => updateVar('--bubble-cover-main-background-color', v)} />
        <ControlInput label="Cover Border Radius" type="text" value={cssVars['--bubble-cover-border-radius'] || ''} onChange={(v) => updateVar('--bubble-cover-border-radius', v)} placeholder="24px" />
        <ControlInput label="Cover Icon Background" type="color" value={cssVars['--bubble-cover-icon-background-color'] || ''} onChange={(v) => updateVar('--bubble-cover-icon-background-color', v)} />
        </div>
      </Section>

      <Section title="Other Card Types" icon={<Layers size={12} />} defaultOpen={false}>
        <div className="space-y-3">
          <p className="text-xs text-gray-400 font-medium">Horizontal Stack</p>
        <ControlInput label="Stack Background" type="color" value={cssVars['--bubble-horizontal-buttons-stack-background-color'] || ''} onChange={(v) => updateVar('--bubble-horizontal-buttons-stack-background-color', v)} />
        <ControlInput label="Stack Border Radius" type="text" value={cssVars['--bubble-horizontal-buttons-stack-border-radius'] || ''} onChange={(v) => updateVar('--bubble-horizontal-buttons-stack-border-radius', v)} placeholder="24px" />
          
          <p className="text-xs text-gray-400 font-medium pt-2">Separator</p>
        <ControlInput label="Line Background" type="color" value={cssVars['--bubble-line-background-color'] || ''} onChange={(v) => updateVar('--bubble-line-background-color', v)} />
        </div>
      </Section>
      
      {/* Custom CSS */}
      <Section title="Custom CSS" icon={<Puzzle size={12} />} defaultOpen={false}>
        <ControlInput
          label="Custom CSS"
          type="textarea"
          value={customCSS}
          onChange={handleCustomCSSChange}
          placeholder={`.bubble-button-card-container {\n  /* Your custom styles */\n}`}
          hint="Advanced: Add custom CSS rules for fine-grained control"
        />
      </Section>

      <Section title="JS Templates" icon={<Sparkles size={12} />} defaultOpen={false}>
        <p className="text-[11px] text-gray-500 mb-2">Insert JS templates into styles. Adjust entity ids/icons.</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => appendSnippet('${icon.setAttribute("icon", state === "on" ? "mdi:lightbulb" : "mdi:lightbulb-off")}')}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Toggle Icon on State
          </button>
          <button
            onClick={() => appendSnippet('.bubble-icon {\n  animation: ${state === "on" ? "slow-rotate 2s linear infinite" : ""};\n}\n@keyframes slow-rotate {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}')}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Spin Fan When On
          </button>
          <button
            onClick={() => appendSnippet('.bubble-sub-button-1 {\n  display: ${hass.states["vacuum.downstairs"].state === "error" ? "" : "none"} !important;\n}')}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Show Sub-button on Error
          </button>
          <button
            onClick={() => appendSnippet('.bubble-button-card-container {\n  box-shadow: ${state === "on" ? "0 0 18px rgba(0,200,255,0.6)" : ""} !important;\n}')}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Glow When On
          </button>
          <button
            onClick={() => appendSnippet('.bubble-line {\n  background: ${hass.formatEntityState(hass.states["weather.home"]) === "Rain" ? "#4fc3f7" : "#888"};\n  opacity: 1;\n}')}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Weather-Based Separator
          </button>
        </div>
      </Section>

      <Section title="State-based Styling" icon={<Eye size={12} />} defaultOpen={false}>
        <p className="text-[11px] text-gray-500 mb-2">Styles based on the card's main entity state. {entityId ? `Entity: ${entityId}` : 'Set entity to use these snippets'}</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => appendSnippet(`.bubble-button-background {\n  opacity: 1 !important;\n  background: \${hass.states["${entityId}"]?.state === "on" ? "var(--bubble-accent-color)" : ""} !important;\n}`)}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
            disabled={!entityId}
          >
            Accent When On
          </button>
          <button
            onClick={() => appendSnippet(`.bubble-button-card-container {\n  filter: \${hass.states["${entityId}"]?.state === "off" ? "grayscale(0.55) brightness(0.85)" : "none"};\n  transition: filter 160ms ease;\n}`)}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
            disabled={!entityId}
          >
            Dim When Off
          </button>
          <button
            onClick={() => appendSnippet(`.bubble-icon {\n  animation: \${hass.states["${entityId}"]?.state === "on" ? "slow-pulse 1.4s ease-in-out infinite" : ""};\n}\n@keyframes slow-pulse {\n  0% { transform: scale(1); opacity: 1; }\n  50% { transform: scale(1.08); opacity: 0.8; }\n  100% { transform: scale(1); opacity: 1; }\n}`)}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
            disabled={!entityId}
          >
            Pulse When On
          </button>
          <button
            onClick={() => appendSnippet(`.bubble-icon {\n  animation: \${hass.states["${entityId}"]?.state === "on" ? "rotate 2s linear infinite" : ""};\n}\n@keyframes rotate {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}`)}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
            disabled={!entityId}
          >
            Spin When On
          </button>
          <button
            onClick={() => appendSnippet(`.bubble-button-card-container {\n  box-shadow: \${hass.states["${entityId}"]?.state === "on" ? "0 0 18px var(--bubble-accent-color)" : ""} !important;\n}`)}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
            disabled={!entityId}
          >
            Glow When On
          </button>
          <button
            onClick={() => appendSnippet(`.bubble-button-card-container {\n  border: \${hass.states["${entityId}"]?.state === "on" ? "2px solid var(--bubble-accent-color)" : "2px solid transparent"} !important;\n}`)}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
            disabled={!entityId}
          >
            Border When On
          </button>
          <button
            onClick={() => appendSnippet(`.bubble-icon {\n  color: \${hass.states["${entityId}"]?.state === "on" ? "var(--bubble-accent-color)" : "var(--primary-text-color)"} !important;\n}`)}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
            disabled={!entityId}
          >
            Icon Color Change
          </button>
          <button
            onClick={() => appendSnippet(`.bubble-name {\n  color: \${hass.states["${entityId}"]?.state === "on" ? "var(--bubble-accent-color)" : ""} !important;\n}`)}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
            disabled={!entityId}
          >
            Name Color When On
          </button>
          <button
            onClick={() => appendSnippet(`.bubble-button-card-container {\n  opacity: \${hass.states["${entityId}"]?.state === "unavailable" ? "0.5" : "1"};\n}`)}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
            disabled={!entityId}
          >
            Fade When Unavailable
          </button>
          <button
            onClick={() => appendSnippet(`.bubble-button-card-container {\n  box-shadow: \${Number(hass.states["${entityId}"]?.attributes?.battery ?? 100) < 25 ? "0 0 16px rgba(239,68,68,0.65)" : ""} !important;\n}`)}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
            disabled={!entityId}
          >
            Low Battery Alert
          </button>
          <button
            onClick={() => appendSnippet(`.bubble-button-card-container {\n  transform: \${hass.states["${entityId}"]?.state === "on" ? "scale(1.02)" : "scale(1)"};\n  transition: transform 200ms ease;\n}`)}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
            disabled={!entityId}
          >
            Scale When On
          </button>
          <button
            onClick={() => appendSnippet(`.bubble-icon {\n  filter: \${hass.states["${entityId}"]?.state === "on" ? "drop-shadow(0 0 6px var(--bubble-accent-color))" : ""};\n}`)}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
            disabled={!entityId}
          >
            Icon Glow When On
          </button>
        </div>
      </Section>

      <Section title="State Appearance" icon={<Eye size={12} />} defaultOpen={false}>
        <StateAppearanceBuilder entityId={entityId} appendSnippet={appendSnippet} />
      </Section>

      <Section title="Conditional Styling" icon={<Layers size={12} />} defaultOpen={false}>
        <ConditionalStylingBuilder appendSnippet={appendSnippet} />
      </Section>
    </div>
  );
}

// ============================================
// MAIN CONFIG PANEL
// ============================================

export function BubbleConfigPanel({ config, updateConfig, setConfig }: ConfigPanelProps) {
  const cardType = config.card_type;
  const [moduleDraft, setModuleDraft] = useState('');
  
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

  const modules = (config as any).modules || [];

  const addModule = () => {
    const value = moduleDraft.trim();
    if (!value) return;
    updateConfig('modules', [...modules, value]);
    setModuleDraft('');
  };

  const removeModule = (id: string) => {
    updateConfig('modules', modules.filter((m: string) => m !== id));
  };

  const toggleExclude = (id: string) => {
    const next = id.startsWith('!') ? id.slice(1) : `!${id}`;
    updateConfig('modules', modules.map((m: string) => (m === id ? next : m)));
  };

  const mediaHidePresets: Record<string, { play_pause_button?: boolean; volume_button?: boolean; previous_button?: boolean; next_button?: boolean; power_button?: boolean }> = {
    showAll: {},
    transportOnly: { volume_button: true, power_button: true },
    noTransport: { play_pause_button: true, previous_button: true, next_button: true },
    minimal: { play_pause_button: true, previous_button: true, next_button: true, volume_button: true, power_button: true },
    noVolume: { volume_button: true },
  };

  const applyMediaHidePreset = (key: keyof typeof mediaHidePresets) => {
    updateConfig('hide', { ...mediaHidePresets[key] });
  };

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
    <div className="h-full">
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
              label="Entity Picture URL (optional)"
              type="text"
              value={(config as any).entity_picture || ''}
              onChange={(v) => updateConfig('entity_picture', v)}
              placeholder="https://example.com/image.jpg"
            />
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

          <Section title="Badge & Footer" icon={<Palette size={14} />} defaultOpen={false}>
            <ControlInput label="Badge Text" type="text" value={(config as any).badge_text || ''} onChange={(v) => updateConfig('badge_text', v)} placeholder="New" hint="Small pill shown on the card" />
            <ControlInput label="Badge Color" type="color" value={(config as any).badge_color || ''} onChange={(v) => updateConfig('badge_color', v)} />
            <ControlInput label="Footer Text" type="text" value={(config as any).footer_text || ''} onChange={(v) => updateConfig('footer_text', v)} placeholder="Secondary label under content" />
          </Section>

          <Section title="Layout" icon={<Layout size={14} />} defaultOpen={false}>
            <ControlInput label="Card Layout" type="select" value={(config as any).card_layout} onChange={(v) => updateConfig('card_layout', v)} options={CARD_LAYOUT_OPTIONS.map(o => ({ value: o.value, label: o.label }))} />
            <ControlInput label="Rows" type="range" value={(config as any).rows || 1} onChange={(v) => updateConfig('rows', v)} min={1} max={4} step={1} />
            {(config as any).card_layout === 'large-sub-buttons-grid' && (
              <div className="grid grid-cols-2 gap-2">
                <ControlInput
                  label="Grid Rows"
                  type="number"
                  value={(config as any).grid_options?.rows ?? 2}
                  onChange={(v) => updateConfig('grid_options', { ...(config as any).grid_options, rows: v })}
                  min={1}
                  max={6}
                  step={1}
                />
                <ControlInput
                  label="Grid Columns"
                  type="number"
                  value={(config as any).grid_options?.columns ?? 3}
                  onChange={(v) => updateConfig('grid_options', { ...(config as any).grid_options, columns: v })}
                  min={1}
                  max={6}
                  step={1}
                />
              </div>
            )}
          </Section>

          <Section title="Effects" icon={<Sparkles size={14} />} defaultOpen={false}>
            <ControlInput label="Ripple Effect" type="checkbox" value={(config as any).ripple_effect} onChange={(v) => updateConfig('ripple_effect', v)} />
            <ControlInput label="Glow Effect" type="color" value={(config as any).glow_effect || ''} onChange={(v) => updateConfig('glow_effect', v)} hint="Adds soft outer glow" />
            <ControlInput label="Background Gradient" type="text" value={(config as any).background_gradient || ''} onChange={(v) => updateConfig('background_gradient', v)} placeholder="linear-gradient(135deg, #1e1e2f, #0f172a)" />
            
            <div className="mt-3 mb-2 text-xs text-gray-400 font-medium">Card Animation</div>
            <div className="grid grid-cols-2 gap-2">
              <ControlInput 
                label="Type" 
                type="select" 
                value={(config as any).card_animation || 'none'} 
                onChange={(v) => updateConfig('card_animation', v)}
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'flash', label: 'Flash' },
                  { value: 'pulse', label: 'Pulse' },
                  { value: 'jiggle', label: 'Jiggle' },
                  { value: 'shake', label: 'Shake' },
                  { value: 'bounce', label: 'Bounce' },
                  { value: 'glow', label: 'Glow' },
                  { value: 'float', label: 'Float' },
                  { value: 'swing', label: 'Swing' },
                  { value: 'rubberBand', label: 'Rubber Band' },
                  { value: 'tada', label: 'Tada' },
                  { value: 'heartbeat', label: 'Heartbeat' },
                  { value: 'flip', label: 'Flip' },
                  { value: 'wobble', label: 'Wobble' },
                  { value: 'breathe', label: 'Breathe' },
                  { value: 'ripple', label: 'Ripple' },
                ]}
              />
              <ControlInput 
                label="Trigger" 
                type="select" 
                value={(config as any).card_animation_trigger || 'always'} 
                onChange={(v) => updateConfig('card_animation_trigger', v)}
                options={[
                  { value: 'always', label: 'Always' },
                  { value: 'on', label: 'When On' },
                  { value: 'off', label: 'When Off' },
                ]}
              />
            </div>
            <ControlInput 
              label="Speed" 
              type="text" 
              value={(config as any).card_animation_speed || '2s'} 
              onChange={(v) => updateConfig('card_animation_speed', v)} 
              placeholder="2s"
              hint="CSS duration (e.g., 2s, 500ms)"
            />
            
            <div className="mt-3 mb-2 text-xs text-gray-400 font-medium">Icon Animation</div>
            <div className="grid grid-cols-2 gap-2">
              <ControlInput 
                label="Type" 
                type="select" 
                value={(config as any).icon_animation_type || 'none'} 
                onChange={(v) => updateConfig('icon_animation_type', v)}
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'flash', label: 'Flash' },
                  { value: 'pulse', label: 'Pulse' },
                  { value: 'spin', label: 'Spin' },
                  { value: 'shake', label: 'Shake' },
                  { value: 'bounce', label: 'Bounce' },
                  { value: 'swing', label: 'Swing' },
                  { value: 'wobble', label: 'Wobble' },
                  { value: 'flip', label: 'Flip' },
                  { value: 'heartbeat', label: 'Heartbeat' },
                ]}
              />
              <ControlInput 
                label="Trigger" 
                type="select" 
                value={(config as any).icon_animation_trigger || 'always'} 
                onChange={(v) => updateConfig('icon_animation_trigger', v)}
                options={[
                  { value: 'always', label: 'Always' },
                  { value: 'on', label: 'When On' },
                  { value: 'off', label: 'When Off' },
                ]}
              />
            </div>
            <ControlInput 
              label="Speed" 
              type="text" 
              value={(config as any).icon_animation_speed || '2s'} 
              onChange={(v) => updateConfig('icon_animation_speed', v)} 
              placeholder="2s"
              hint="CSS duration (e.g., 2s, 500ms)"
            />
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
                <ControlInput label="Show Slider Value" type="checkbox" value={(config as any).show_slider_value} onChange={(v) => updateConfig('show_slider_value', v)} />
              </div>
              {(config as any).light_transition && (
                <ControlInput label="Transition Time (ms)" type="range" value={(config as any).light_transition_time || 500} onChange={(v) => updateConfig('light_transition_time', v)} min={0} max={2000} step={100} />
              )}
            </Section>
          )}

          <Section title="Icon & Text" icon={<Eye size={14} />} defaultOpen={false}>
            <ControlInput label="Icon Size" type="number" value={(config as any).icon_size ?? 24} onChange={(v) => updateConfig('icon_size', v)} min={12} max={64} step={1} />
            <ControlInput label="Name Weight" type="select" value={(config as any).name_weight || 'medium'} onChange={(v) => updateConfig('name_weight', v)} options={[{ value: 'normal', label: 'Normal' }, { value: 'medium', label: 'Medium' }, { value: 'bold', label: 'Bold' }]} />
            <ControlInput label="Icon Animation" type="text" value={(config as any).icon_animation || ''} onChange={(v) => updateConfig('icon_animation', v)} placeholder="spin 2s linear infinite" hint="CSS animation value (e.g., spin 2s linear infinite)" />
          </Section>

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
            <ControlInput label="Columns" type="number" value={(config as any).columns ?? 1} onChange={(v) => updateConfig('columns', v)} min={1} max={4} step={1} />
            {(config as any).card_layout === 'large-sub-buttons-grid' && (
              <div className="grid grid-cols-2 gap-2">
                <ControlInput
                  label="Grid Rows"
                  type="number"
                  value={(config as any).grid_options?.rows ?? 2}
                  onChange={(v) => updateConfig('grid_options', { ...(config as any).grid_options, rows: v })}
                  min={1}
                  max={6}
                  step={1}
                />
                <ControlInput
                  label="Grid Columns"
                  type="number"
                  value={(config as any).grid_options?.columns ?? 3}
                  onChange={(v) => updateConfig('grid_options', { ...(config as any).grid_options, columns: v })}
                  min={1}
                  max={6}
                  step={1}
                />
              </div>
            )}
          </Section>

          <Section title="Sub-buttons" icon={<Sparkles size={14} />} defaultOpen={false} badge={(config as any).sub_button?.length || undefined}>
            <SubButtonEditor subButtons={(config as any).sub_button || []} onChange={(subs) => updateConfig('sub_button', subs)} />
          </Section>

          <Section title="Actions" icon={<MousePointer size={14} />} defaultOpen={false}>
            <ActionEditor label="Tap Action" action={(config as any).tap_action} onChange={(a) => updateConfig('tap_action', a)} />
            <ActionEditor label="Double Tap Action" action={(config as any).double_tap_action} onChange={(a) => updateConfig('double_tap_action', a)} />
            <ActionEditor label="Hold Action" action={(config as any).hold_action} onChange={(a) => updateConfig('hold_action', a)} />
            <div className="pt-2 border-t border-gray-700 space-y-2">
              <p className="text-xs text-gray-400 font-medium">Button Actions (icon area)</p>
              <ActionEditor label="Button Tap" action={(config as any).button_action?.tap_action} onChange={(a) => updateConfig('button_action', { ...(config as any).button_action || {}, tap_action: a })} />
              <ActionEditor label="Button Double Tap" action={(config as any).button_action?.double_tap_action} onChange={(a) => updateConfig('button_action', { ...(config as any).button_action || {}, double_tap_action: a })} />
              <ActionEditor label="Button Hold" action={(config as any).button_action?.hold_action} onChange={(a) => updateConfig('button_action', { ...(config as any).button_action || {}, hold_action: a })} />
            </div>
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
            <ControlInput label="Auto Close (ms)" type="number" value={(config as any).auto_close} onChange={(v) => updateConfig('auto_close', v)} placeholder="1500" hint="Milliseconds before auto-close (blank = never)" />
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
            <div className="flex flex-wrap gap-2 mb-2">
              {["on", "off", "open", "closed", "detected", "playing"].map((state) => (
                <button
                  key={state}
                  onClick={() => updateConfig('trigger_state', state)}
                  className={`px-2 py-1 text-xs rounded border ${((config as any).trigger_state || '') === state ? 'bg-cyan-700 border-cyan-500 text-white' : 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200'}`}
                >
                  {state}
                </button>
              ))}
              <button
                onClick={() => { updateConfig('trigger_state', ''); updateConfig('trigger_entity', ''); }}
                className="px-2 py-1 text-xs rounded border bg-gray-800 hover:bg-gray-700 border-gray-600 text-gray-300"
              >
                Clear
              </button>
            </div>
            <ControlInput label="Trigger Entity" type="text" value={(config as any).trigger_entity} onChange={(v) => updateConfig('trigger_entity', v)} placeholder="binary_sensor.motion" hint="Entity that triggers the pop-up" />
            <ControlInput label="Trigger State" type="text" value={(config as any).trigger_state} onChange={(v) => updateConfig('trigger_state', v)} placeholder="on" hint="State value that triggers opening" />
            <ControlInput label="Trigger Close" type="checkbox" value={(config as any).trigger_close} onChange={(v) => updateConfig('trigger_close', v)} />
            <p className="text-[11px] text-gray-500">When a trigger entity is set, a trigger state is typically required by Bubble Card.</p>
          </Section>

          <Section title="Actions" icon={<MousePointer size={14} />} defaultOpen={false}>
            <ActionEditor label="On Open" action={(config as any).open_action} onChange={(a) => updateConfig('open_action', a)} />
            <ActionEditor label="On Close" action={(config as any).close_action} onChange={(a) => updateConfig('close_action', a)} />
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
            <ControlInput
              label="Entity Picture URL (optional)"
              type="text"
              value={(config as any).entity_picture || ''}
              onChange={(v) => updateConfig('entity_picture', v)}
              placeholder="https://example.com/image.jpg"
            />
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
              <ControlInput label="Last Updated" type="checkbox" value={(config as any).show_last_updated} onChange={(v) => updateConfig('show_last_updated', v)} />
              <ControlInput label="Show Attribute" type="checkbox" value={(config as any).show_attribute} onChange={(v) => updateConfig('show_attribute', v)} />
              {(config as any).show_attribute && (
                <ControlInput label="Attribute" type="text" value={(config as any).attribute || ''} onChange={(v) => updateConfig('attribute', v)} placeholder="brightness" />
              )}
            </div>
          </Section>

          <Section title="Actions" icon={<MousePointer size={14} />} defaultOpen={false}>
            <ActionEditor label="Tap Action" action={(config as any).tap_action} onChange={(a) => updateConfig('tap_action', a)} />
            <ActionEditor label="Double Tap Action" action={(config as any).double_tap_action} onChange={(a) => updateConfig('double_tap_action', a)} />
            <ActionEditor label="Hold Action" action={(config as any).hold_action} onChange={(a) => updateConfig('hold_action', a)} />
            <div className="pt-2 border-t border-gray-700 space-y-2">
              <p className="text-xs text-gray-400 font-medium">Button Actions (icon area)</p>
              <ActionEditor label="Button Tap" action={(config as any).button_action?.tap_action} onChange={(a) => updateConfig('button_action', { ...(config as any).button_action || {}, tap_action: a })} />
              <ActionEditor label="Button Double Tap" action={(config as any).button_action?.double_tap_action} onChange={(a) => updateConfig('button_action', { ...(config as any).button_action || {}, double_tap_action: a })} />
              <ActionEditor label="Button Hold" action={(config as any).button_action?.hold_action} onChange={(a) => updateConfig('button_action', { ...(config as any).button_action || {}, hold_action: a })} />
            </div>
          </Section>

          <Section title="Layout" icon={<Layout size={14} />} defaultOpen={false}>
            <ControlInput label="Card Layout" type="select" value={(config as any).card_layout || 'normal'} onChange={(v) => updateConfig('card_layout', v)} options={CARD_LAYOUT_OPTIONS.map(o => ({ value: o.value, label: o.label }))} />
            <ControlInput label="Rows" type="range" value={(config as any).rows || 1} onChange={(v) => updateConfig('rows', v)} min={1} max={4} step={1} />
            <ControlInput label="Columns" type="number" value={(config as any).columns ?? 1} onChange={(v) => updateConfig('columns', v)} min={1} max={4} step={1} />
            {(config as any).card_layout === 'large-sub-buttons-grid' && (
              <div className="grid grid-cols-2 gap-2">
                <ControlInput
                  label="Grid Rows"
                  type="number"
                  value={(config as any).grid_options?.rows ?? 2}
                  onChange={(v) => updateConfig('grid_options', { ...(config as any).grid_options, rows: v })}
                  min={1}
                  max={6}
                  step={1}
                />
                <ControlInput
                  label="Grid Columns"
                  type="number"
                  value={(config as any).grid_options?.columns ?? 3}
                  onChange={(v) => updateConfig('grid_options', { ...(config as any).grid_options, columns: v })}
                  min={1}
                  max={6}
                  step={1}
                />
              </div>
            )}
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
            <ControlInput
              label="Entity Picture URL (optional)"
              type="text"
              value={(config as any).entity_picture || ''}
              onChange={(v) => updateConfig('entity_picture', v)}
              placeholder="https://example.com/image.jpg"
            />
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
            <div className="flex flex-wrap gap-2 mb-2">
              <button onClick={() => applyMediaHidePreset('showAll')} className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded">Show All</button>
              <button onClick={() => applyMediaHidePreset('transportOnly')} className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded">Transport Only</button>
              <button onClick={() => applyMediaHidePreset('noTransport')} className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded">Hide Transport</button>
              <button onClick={() => applyMediaHidePreset('noVolume')} className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded">Hide Volume</button>
              <button onClick={() => applyMediaHidePreset('minimal')} className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded">Minimal</button>
            </div>
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
              <ControlInput label="Last Changed" type="checkbox" value={(config as any).show_last_changed} onChange={(v) => updateConfig('show_last_changed', v)} />
              <ControlInput label="Last Updated" type="checkbox" value={(config as any).show_last_updated} onChange={(v) => updateConfig('show_last_updated', v)} />
              <ControlInput label="Show Attribute" type="checkbox" value={(config as any).show_attribute} onChange={(v) => updateConfig('show_attribute', v)} />
              {(config as any).show_attribute && (
                <ControlInput label="Attribute" type="text" value={(config as any).attribute || ''} onChange={(v) => updateConfig('attribute', v)} placeholder="volume_level" />
              )}
            </div>
          </Section>

          <Section title="Layout" icon={<Layout size={14} />} defaultOpen={false}>
            <ControlInput label="Card Layout" type="select" value={(config as any).card_layout || 'normal'} onChange={(v) => updateConfig('card_layout', v)} options={CARD_LAYOUT_OPTIONS.map(o => ({ value: o.value, label: o.label }))} />
            <ControlInput label="Rows" type="range" value={(config as any).rows || 1} onChange={(v) => updateConfig('rows', v)} min={1} max={4} step={1} />
            <ControlInput label="Columns" type="number" value={(config as any).columns ?? 1} onChange={(v) => updateConfig('columns', v)} min={1} max={4} step={1} hint="Number of columns for media controls" />
            {(config as any).card_layout === 'large-sub-buttons-grid' && (
              <div className="grid grid-cols-2 gap-2">
                <ControlInput
                  label="Grid Rows"
                  type="number"
                  value={(config as any).grid_options?.rows ?? 2}
                  onChange={(v) => updateConfig('grid_options', { ...(config as any).grid_options, rows: v })}
                  min={1}
                  max={6}
                  step={1}
                />
                <ControlInput
                  label="Grid Columns"
                  type="number"
                  value={(config as any).grid_options?.columns ?? 3}
                  onChange={(v) => updateConfig('grid_options', { ...(config as any).grid_options, columns: v })}
                  min={1}
                  max={6}
                  step={1}
                />
              </div>
            )}
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
            <ControlInput
              label="Entity Picture URL (optional)"
              type="text"
              value={(config as any).entity_picture || ''}
              onChange={(v) => updateConfig('entity_picture', v)}
              placeholder="https://example.com/image.jpg"
            />
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
              <ControlInput label="Dual Setpoint Mode" type="checkbox" value={(config as any).dual_setpoint} onChange={(v) => updateConfig('dual_setpoint', v)} />
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

          <Section title="Actions" icon={<MousePointer size={14} />} defaultOpen={false}>
            <ActionEditor label="Tap Action" action={(config as any).tap_action} onChange={(a) => updateConfig('tap_action', a)} />
            <ActionEditor label="Double Tap Action" action={(config as any).double_tap_action} onChange={(a) => updateConfig('double_tap_action', a)} />
            <ActionEditor label="Hold Action" action={(config as any).hold_action} onChange={(a) => updateConfig('hold_action', a)} />
            <div className="pt-2 border-t border-gray-700 space-y-2">
              <p className="text-xs text-gray-400 font-medium">Button Actions (icon area)</p>
              <ActionEditor label="Button Tap" action={(config as any).button_action?.tap_action} onChange={(a) => updateConfig('button_action', { ...(config as any).button_action || {}, tap_action: a })} />
              <ActionEditor label="Button Double Tap" action={(config as any).button_action?.double_tap_action} onChange={(a) => updateConfig('button_action', { ...(config as any).button_action || {}, double_tap_action: a })} />
              <ActionEditor label="Button Hold" action={(config as any).button_action?.hold_action} onChange={(a) => updateConfig('button_action', { ...(config as any).button_action || {}, hold_action: a })} />
            </div>
          </Section>

          <Section title="Layout" icon={<Layout size={14} />} defaultOpen={false}>
            <ControlInput label="Card Layout" type="select" value={(config as any).card_layout || 'normal'} onChange={(v) => updateConfig('card_layout', v)} options={CARD_LAYOUT_OPTIONS.map(o => ({ value: o.value, label: o.label }))} />
            <ControlInput label="Rows" type="range" value={(config as any).rows || 1} onChange={(v) => updateConfig('rows', v)} min={1} max={4} step={1} />
            {(config as any).card_layout === 'large-sub-buttons-grid' && (
              <div className="grid grid-cols-2 gap-2">
                <ControlInput
                  label="Grid Rows"
                  type="number"
                  value={(config as any).grid_options?.rows ?? 2}
                  onChange={(v) => updateConfig('grid_options', { ...(config as any).grid_options, rows: v })}
                  min={1}
                  max={6}
                  step={1}
                />
                <ControlInput
                  label="Grid Columns"
                  type="number"
                  value={(config as any).grid_options?.columns ?? 3}
                  onChange={(v) => updateConfig('grid_options', { ...(config as any).grid_options, columns: v })}
                  min={1}
                  max={6}
                  step={1}
                />
              </div>
            )}
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
            <ControlInput
              label="Entity Picture URL (optional)"
              type="text"
              value={(config as any).entity_picture || ''}
              onChange={(v) => updateConfig('entity_picture', v)}
              placeholder="https://example.com/image.jpg"
            />
            <ControlInput label="Force Icon" type="checkbox" value={(config as any).force_icon} onChange={(v) => updateConfig('force_icon', v)} />
          </Section>

          <Section title="Visibility" icon={<Eye size={14} />} defaultOpen={false}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <ControlInput label="Show Name" type="checkbox" value={(config as any).show_name} onChange={(v) => updateConfig('show_name', v)} />
              <ControlInput label="Show Icon" type="checkbox" value={(config as any).show_icon} onChange={(v) => updateConfig('show_icon', v)} />
              <ControlInput label="Show State" type="checkbox" value={(config as any).show_state} onChange={(v) => updateConfig('show_state', v)} />
              <ControlInput label="Scrolling Effect" type="checkbox" value={(config as any).scrolling_effect} onChange={(v) => updateConfig('scrolling_effect', v)} />
              <ControlInput label="Last Changed" type="checkbox" value={(config as any).show_last_changed} onChange={(v) => updateConfig('show_last_changed', v)} />
              <ControlInput label="Last Updated" type="checkbox" value={(config as any).show_last_updated} onChange={(v) => updateConfig('show_last_updated', v)} />
              <ControlInput label="Show Attribute" type="checkbox" value={(config as any).show_attribute} onChange={(v) => updateConfig('show_attribute', v)} />
              {(config as any).show_attribute && (
                <ControlInput label="Attribute" type="text" value={(config as any).attribute || ''} onChange={(v) => updateConfig('attribute', v)} placeholder="effect_list" />
              )}
            </div>
          </Section>

          <Section title="Actions" icon={<MousePointer size={14} />} defaultOpen={false}>
            <ActionEditor label="Tap Action" action={(config as any).tap_action} onChange={(a) => updateConfig('tap_action', a)} />
            <ActionEditor label="Double Tap Action" action={(config as any).double_tap_action} onChange={(a) => updateConfig('double_tap_action', a)} />
            <ActionEditor label="Hold Action" action={(config as any).hold_action} onChange={(a) => updateConfig('hold_action', a)} />
          </Section>

          <Section title="Layout" icon={<Layout size={14} />} defaultOpen={false}>
            <ControlInput label="Card Layout" type="select" value={(config as any).card_layout || 'normal'} onChange={(v) => updateConfig('card_layout', v)} options={CARD_LAYOUT_OPTIONS.map(o => ({ value: o.value, label: o.label }))} />
            <ControlInput label="Rows" type="range" value={(config as any).rows || 1} onChange={(v) => updateConfig('rows', v)} min={1} max={4} step={1} />
            {(config as any).card_layout === 'large-sub-buttons-grid' && (
              <div className="grid grid-cols-2 gap-2">
                <ControlInput
                  label="Grid Rows"
                  type="number"
                  value={(config as any).grid_options?.rows ?? 2}
                  onChange={(v) => updateConfig('grid_options', { ...(config as any).grid_options, rows: v })}
                  min={1}
                  max={6}
                  step={1}
                />
                <ControlInput
                  label="Grid Columns"
                  type="number"
                  value={(config as any).grid_options?.columns ?? 3}
                  onChange={(v) => updateConfig('grid_options', { ...(config as any).grid_options, columns: v })}
                  min={1}
                  max={6}
                  step={1}
                />
              </div>
            )}
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
            <div className="flex flex-wrap gap-2 mb-2">
              <button onClick={() => { updateConfig('days', 3); updateConfig('limit', 6); }} className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded">3 days / 6 events</button>
              <button onClick={() => { updateConfig('days', 7); updateConfig('limit', 10); }} className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded">7 days / 10 events</button>
              <button onClick={() => { updateConfig('days', 14); updateConfig('limit', 20); }} className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded">14 days / 20 events</button>
            </div>
            <ControlInput label="Days to Show" type="number" value={(config as any).days ?? 7} onChange={(v) => updateConfig('days', v)} min={1} max={30} hint="Number of days to display" />
            <ControlInput label="Event Limit" type="number" value={(config as any).limit ?? 5} onChange={(v) => updateConfig('limit', v)} min={1} max={20} hint="Maximum events to show" />
            <ControlInput label="Show End Time" type="checkbox" value={(config as any).show_end !== false} onChange={(v) => updateConfig('show_end', v)} />
            <ControlInput label="Show Progress" type="checkbox" value={(config as any).show_progress !== false} onChange={(v) => updateConfig('show_progress', v)} />
            <ControlInput label="Scrolling Effect" type="checkbox" value={(config as any).scrolling_effect} onChange={(v) => updateConfig('scrolling_effect', v)} />
          </Section>

          <Section title="Entities" icon={<Zap size={14} />} defaultOpen={true}>
            <p className="text-xs text-gray-500 mb-2">Add calendar entities with optional chip colors.</p>
            <CalendarEntityEditor
              entities={(config as any).entities || []}
              onChange={(entities) => updateConfig('entities', entities)}
            />
          </Section>

          <Section title="Event Actions" icon={<MousePointer size={14} />} defaultOpen={false}>
            <ActionEditor
              label="Event Tap Action"
              action={(config as any).event_action?.tap_action}
              onChange={(a) => updateConfig('event_action', { ...(config as any).event_action || {}, tap_action: a })}
            />
            <ActionEditor
              label="Event Double Tap Action"
              action={(config as any).event_action?.double_tap_action}
              onChange={(a) => updateConfig('event_action', { ...(config as any).event_action || {}, double_tap_action: a })}
            />
            <ActionEditor
              label="Event Hold Action"
              action={(config as any).event_action?.hold_action}
              onChange={(a) => updateConfig('event_action', { ...(config as any).event_action || {}, hold_action: a })}
            />
          </Section>

          <Section title="Layout" icon={<Layout size={14} />} defaultOpen={false}>
            <ControlInput label="Card Layout" type="select" value={(config as any).card_layout || 'normal'} onChange={(v) => updateConfig('card_layout', v)} options={CARD_LAYOUT_OPTIONS.map(o => ({ value: o.value, label: o.label }))} />
            <ControlInput label="Rows" type="range" value={(config as any).rows || 1} onChange={(v) => updateConfig('rows', v)} min={1} max={4} step={1} />
            {(config as any).card_layout === 'large-sub-buttons-grid' && (
              <div className="grid grid-cols-2 gap-2">
                <ControlInput
                  label="Grid Rows"
                  type="number"
                  value={(config as any).grid_options?.rows ?? 2}
                  onChange={(v) => updateConfig('grid_options', { ...(config as any).grid_options, rows: v })}
                  min={1}
                  max={6}
                  step={1}
                />
                <ControlInput
                  label="Grid Columns"
                  type="number"
                  value={(config as any).grid_options?.columns ?? 3}
                  onChange={(v) => updateConfig('grid_options', { ...(config as any).grid_options, columns: v })}
                  min={1}
                  max={6}
                  step={1}
                />
              </div>
            )}
          </Section>

          <Section title="Sub-buttons" icon={<Sparkles size={14} />} defaultOpen={false} badge={(config as any).sub_button?.length || undefined}>
            <SubButtonEditor subButtons={(config as any).sub_button || []} onChange={(subs) => updateConfig('sub_button', subs)} />
          </Section>

          <Section title="Card Actions" icon={<MousePointer size={14} />} defaultOpen={false}>
            <ActionEditor label="Tap Action" action={(config as any).tap_action} onChange={(a) => updateConfig('tap_action', a)} />
            <ActionEditor label="Double Tap Action" action={(config as any).double_tap_action} onChange={(a) => updateConfig('double_tap_action', a)} />
            <ActionEditor label="Hold Action" action={(config as any).hold_action} onChange={(a) => updateConfig('hold_action', a)} />
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
            <p className="text-xs text-gray-500 mb-2">Add navigation buttons (hash or path, optional entity and PIR sensor for auto-order).</p>
            <HorizontalButtonsEditor
              buttons={(config as any).buttons || []}
              onChange={(buttons) => updateConfig('buttons', buttons)}
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

      {/* ============================================ */}
      {/* MODULES (ALL CARDS) */}
      {/* ============================================ */}
      <Section title="Modules" icon={<Puzzle size={14} />} defaultOpen={false}>
        <div className="space-y-3">
          <ControlInput
            label="Module IDs"
            type="textarea"
            value={(config as any).modules?.join('\n') || ''}
            onChange={(text) => updateConfig('modules', formatModulesInput(String(text)))}
            hint="One module id per line. Use !module_id to exclude a global module."
          />

          <div className="space-y-2">
            <p className="text-xs text-gray-400">Quick add</p>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded bg-gray-800 border border-gray-700 px-2 py-1 text-sm"
                value={moduleDraft}
                onChange={(e) => setModuleDraft(e.target.value)}
                placeholder="module_id or !module_id"
              />
              <button
                onClick={addModule}
                className="px-3 py-1 text-sm bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 rounded border border-cyan-600/30"
              >
                Add
              </button>
            </div>
          </div>

          {modules.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-400">Current modules</p>
              <div className="flex flex-wrap gap-2">
                {modules.map((mod: string, idx: number) => (
                  <div key={`${mod}-${idx}`} className="flex items-center gap-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-xs">
                    <span className="text-gray-200">{mod}</span>
                    <button
                      className="text-cyan-300 hover:text-cyan-100"
                      title={mod.startsWith('!') ? 'Include module' : 'Exclude module globally'}
                      onClick={() => toggleExclude(mod)}
                    >
                      {mod.startsWith('!') ? 'Include' : 'Exclude'}
                    </button>
                    <button
                      className="text-red-300 hover:text-red-100"
                      title="Remove"
                      onClick={() => removeModule(mod)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}

export default BubbleConfigPanel;
