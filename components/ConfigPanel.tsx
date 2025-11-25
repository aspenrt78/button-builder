
import React, { useState } from 'react';
import { ButtonConfig, CustomField, Variable, StateStyleConfig, DEFAULT_LOCK_CONFIG, DEFAULT_PROTECT_CONFIG, DEFAULT_TOOLTIP_CONFIG, DEFAULT_TOAST_CONFIG } from '../types';
import { ControlInput } from './ControlInput';
import { EntitySelector } from './EntitySelector';
import { LAYOUT_OPTIONS, ACTION_OPTIONS, TRANSFORM_OPTIONS, WEIGHT_OPTIONS, BORDER_STYLE_OPTIONS, ANIMATION_OPTIONS, BLUR_OPTIONS, SHADOW_SIZE_OPTIONS, TRIGGER_OPTIONS, LOCK_UNLOCK_OPTIONS, STATE_OPERATOR_OPTIONS, COLOR_TYPE_OPTIONS, PROTECT_TYPE_OPTIONS, FONT_FAMILY_OPTIONS, LETTER_SPACING_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants';
import { Layers, Type, MousePointer, Palette, Zap, ChevronDown, ChevronRight, Layout, ToggleRight, BoxSelect, Droplets, Activity, Settings, Lock, AlertCircle, Code, Plus, X, Shield, MessageSquare, Variable as VariableIcon, Target, Hand, Image } from 'lucide-react';

interface Props {
  config: ButtonConfig;
  setConfig: React.Dispatch<React.SetStateAction<ButtonConfig>>;
}

const Section = ({ title, icon: Icon, children, defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-800">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-blue-400" />
          {title}
        </div>
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {isOpen && <div className="p-4 space-y-4 bg-gray-900/50 animate-in slide-in-from-top-2">{children}</div>}
    </div>
  );
};

const ColorPairInput = ({ label, colorValue, setColor, autoValue, setAuto }: any) => (
  <div className="flex flex-col gap-1.5">
     <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex justify-between items-center">
       {label}
       <div className="flex items-center gap-1.5 cursor-pointer group" onClick={() => setAuto(!autoValue)}>
         <div className={`w-2 h-2 rounded-full transition-colors ${autoValue ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]' : 'bg-gray-600 group-hover:bg-gray-500'}`} />
         <span className={`text-[9px] transition-colors ${autoValue ? 'text-green-400' : 'text-gray-500 group-hover:text-gray-400'}`}>Match Entity</span>
       </div>
     </label>
     <div className="relative">
       {autoValue ? (
         <div className="h-[38px] w-full bg-gray-800 border border-gray-700 border-dashed rounded flex items-center justify-center text-xs text-gray-400 italic">
           Using Entity Color
         </div>
       ) : (
         <div className="flex items-center gap-2">
            <div 
              className="w-8 h-[38px] rounded border border-gray-600 overflow-hidden shrink-0 relative"
              style={{ backgroundColor: colorValue }}
            >
              <input 
                type="color" 
                value={colorValue} 
                onChange={(e) => setColor(e.target.value)}
                className="opacity-0 w-full h-full cursor-pointer absolute inset-0"
              />
            </div>
            <input
               type="text"
               value={colorValue}
               placeholder="#FFFFFF"
               onChange={(e) => setColor(e.target.value)}
               className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white w-full focus:outline-none focus:border-blue-500 h-[38px] font-mono"
             />
         </div>
       )}
     </div>
  </div>
);

export const ConfigPanel: React.FC<Props> = ({ config, setConfig }) => {
  
  const update = (key: keyof ButtonConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-900 border-r border-gray-800 flex flex-col custom-scrollbar">
      <div className="p-4 border-b border-gray-800 shrink-0 bg-gray-900 z-10">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers size={18} className="text-blue-500" />
          Editor
        </h2>
      </div>

      <div className="flex-1">
        {/* 1. Core Information */}
        <Section title="Core Configuration" icon={Type} defaultOpen={true}>
          <EntitySelector label="Entity ID" value={config.entity} onChange={(v) => update('entity', v)} />
          <ControlInput label="Name" value={config.name} onChange={(v) => update('name', v)} />
          <ControlInput label="Icon (mdi:...)" value={config.icon} onChange={(v) => update('icon', v)} />
          <ControlInput label="State Display (Custom)" value={config.stateDisplay} onChange={(v) => update('stateDisplay', v)} placeholder="Custom state text" />
          <ControlInput label="Entity Picture URL" value={config.entityPicture} onChange={(v) => update('entityPicture', v)} placeholder="https://..." />
          <ControlInput label="Units Override" value={config.units} onChange={(v) => update('units', v)} placeholder="°C, kW, etc." />
          
          <div className="pt-3 border-t border-gray-800">
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Label Configuration</p>
            <div className="space-y-3">
              <ControlInput label="Static Label" value={config.label} onChange={(v) => update('label', v)} placeholder="My Label Text" />
              <p className="text-[10px] text-gray-500 -mt-1">Or display another entity's value:</p>
              <EntitySelector label="Label Entity" value={config.labelEntity} onChange={(v) => update('labelEntity', v)} />
              <ControlInput label="Attribute (optional)" value={config.labelAttribute} onChange={(v) => update('labelAttribute', v)} placeholder="temperature, brightness, etc." />
              <p className="text-[10px] text-gray-500 -mt-1">Leave attribute empty to show entity state</p>
            </div>
          </div>
          
          <div className="pt-3 border-t border-gray-800">
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Templates (Advanced)</p>
            <div className="space-y-3">
              <ControlInput label="Name Template" value={config.nameTemplate} onChange={(v) => update('nameTemplate', v)} placeholder="[[[ return entity.state ]]]" />
              <ControlInput label="Label Template" value={config.labelTemplate} onChange={(v) => update('labelTemplate', v)} placeholder="[[[ return entity.attributes.temperature + '°C' ]]]" />
              <ControlInput label="Icon Template" value={config.iconTemplate} onChange={(v) => update('iconTemplate', v)} placeholder="[[[ return entity.state === 'on' ? 'mdi:lightbulb-on' : 'mdi:lightbulb-off' ]]]" />
              <ControlInput label="State Display Template" value={config.stateDisplayTemplate} onChange={(v) => update('stateDisplayTemplate', v)} placeholder="[[[ return entity.state.toUpperCase() ]]]" />
            </div>
          </div>
        </Section>

        {/* 2. Variables */}
        <Section title="Variables" icon={VariableIcon}>
          <div className="space-y-4">
            <p className="text-xs text-gray-400">Define variables for use in templates</p>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-400 uppercase">Variable List</p>
              <button
                onClick={() => update('variables', [...config.variables, { name: 'var' + (config.variables.length + 1), value: '' }])}
                className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white"
              >
                <Plus size={12} /> Add Variable
              </button>
            </div>
            
            {config.variables.length === 0 ? (
              <div className="text-xs text-gray-500 italic text-center py-2">No variables defined</div>
            ) : (
              <div className="space-y-3">
                {config.variables.map((variable, idx) => (
                  <div key={idx} className="p-3 bg-gray-800 rounded border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-400">Variable {idx + 1}</span>
                      <button
                        onClick={() => update('variables', config.variables.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <ControlInput label="Name" value={variable.name} onChange={(v) => {
                        const updated = [...config.variables];
                        updated[idx] = { ...variable, name: v };
                        update('variables', updated);
                      }} />
                      <ControlInput label="Value" value={variable.value} onChange={(v) => {
                        const updated = [...config.variables];
                        updated[idx] = { ...variable, value: v };
                        update('variables', updated);
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* 3. Layout & Dimensions */}
        <Section title="Layout & Dimensions" icon={Layout}>
          <div className="grid grid-cols-2 gap-4">
            <ControlInput 
              label="Layout" 
              type="select" 
              value={config.layout} 
              options={LAYOUT_OPTIONS} 
              onChange={(v) => update('layout', v)} 
            />
            <ControlInput label="Aspect Ratio (e.g 1/1)" value={config.aspectRatio} onChange={(v) => update('aspectRatio', v)} placeholder="1/1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ControlInput label="Card Height" value={config.height} onChange={(v) => update('height', v)} />
            <ControlInput label="Icon Size" value={config.size} onChange={(v) => update('size', v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <ControlInput label="Border Radius" value={config.borderRadius} onChange={(v) => update('borderRadius', v)} />
             <ControlInput label="Padding" value={config.padding} onChange={(v) => update('padding', v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <ControlInput label="Card Size (1-6)" value={config.cardSize.toString()} onChange={(v) => update('cardSize', Number(v) || 3)} placeholder="3" />
             <ControlInput type="checkbox" label="Section Mode" value={config.sectionMode} onChange={(v) => update('sectionMode', v)} />
          </div>
          {config.sectionMode && (
            <div className="grid grid-cols-2 gap-4">
               <ControlInput label="Grid Rows" value={config.gridRows.toString()} onChange={(v) => update('gridRows', Number(v) || 2)} />
               <ControlInput label="Grid Columns" value={config.gridColumns.toString()} onChange={(v) => update('gridColumns', Number(v) || 6)} />
            </div>
          )}
        </Section>

        {/* 4. Visibility Toggles */}
        <Section title="Visibility" icon={ToggleRight}>
          <div className="grid grid-cols-2 gap-3">
            <ControlInput type="checkbox" label="Show Name" value={config.showName} onChange={(v) => update('showName', v)} />
            <ControlInput type="checkbox" label="Show Icon" value={config.showIcon} onChange={(v) => update('showIcon', v)} />
            <ControlInput type="checkbox" label="Show State" value={config.showState} onChange={(v) => update('showState', v)} />
            <ControlInput type="checkbox" label="Show Label" value={config.showLabel} onChange={(v) => update('showLabel', v)} />
            <ControlInput type="checkbox" label="Show Last Chg." value={config.showLastChanged} onChange={(v) => update('showLastChanged', v)} />
            <ControlInput type="checkbox" label="Entity Picture" value={config.showEntityPicture} onChange={(v) => update('showEntityPicture', v)} />
            <ControlInput type="checkbox" label="Show Units" value={config.showUnits} onChange={(v) => update('showUnits', v)} />
            <ControlInput type="checkbox" label="Show Ripple" value={config.showRipple} onChange={(v) => update('showRipple', v)} />
            <ControlInput type="checkbox" label="Live Stream" value={config.showLiveStream} onChange={(v) => update('showLiveStream', v)} />
            <ControlInput type="checkbox" label="Hidden" value={config.hidden} onChange={(v) => update('hidden', v)} />
          </div>
          {config.showLiveStream && (
            <ControlInput label="Stream Aspect Ratio" value={config.liveStreamAspectRatio} onChange={(v) => update('liveStreamAspectRatio', v)} placeholder="16x9, 50%, 1.78" className="mt-2" />
          )}
          {config.hidden && (
            <ControlInput label="Hidden Template" value={config.hiddenTemplate} onChange={(v) => update('hiddenTemplate', v)} placeholder="[[[ return entity.state === 'off' ]]]" />
          )}
        </Section>

        {/* 5. Colors & Theming */}
        <Section title="Colors & Theming" icon={Palette}>
           <div className="space-y-6">
             {/* Global Settings */}
             <div className="space-y-4">
                <ControlInput type="select" label="Color Type" value={config.colorType} options={COLOR_TYPE_OPTIONS} onChange={(v) => update('colorType', v)} />
                
                <div className="grid grid-cols-2 gap-4">
                   <ControlInput type="checkbox" label="Auto Color (Light)" value={config.colorAuto} onChange={(v) => update('colorAuto', v)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                        <ControlInput label="Card Background" type="color" value={config.backgroundColor} onChange={(v) => update('backgroundColor', v)} />
                          <ControlInput label="Opacity" type="slider" value={config.backgroundColorOpacity} min={0} max={100} onChange={(v) => update('backgroundColorOpacity', v)} />
                   </div>
                   <ControlInput label="Default Text Color" type="color" value={config.color} onChange={(v) => update('color', v)} />
                </div>
             </div>
             
             <div className="h-px bg-gray-700/50" />

             {/* Element Colors */}
             <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase">Element Colors</p>
                
                <ColorPairInput 
                  label="Icon Color"
                  colorValue={config.iconColor}
                  setColor={(v: string) => update('iconColor', v)}
                  autoValue={config.iconColorAuto}
                  setAuto={(v: boolean) => update('iconColorAuto', v)}
                />

                <ColorPairInput 
                  label="Name Color"
                  colorValue={config.nameColor}
                  setColor={(v: string) => update('nameColor', v)}
                  autoValue={config.nameColorAuto}
                  setAuto={(v: boolean) => update('nameColorAuto', v)}
                />

                <ColorPairInput 
                  label="State Color"
                  colorValue={config.stateColor}
                  setColor={(v: string) => update('stateColor', v)}
                  autoValue={config.stateColorAuto}
                  setAuto={(v: boolean) => update('stateColorAuto', v)}
                />

                <ColorPairInput 
                  label="Label Color"
                  colorValue={config.labelColor}
                  setColor={(v: string) => update('labelColor', v)}
                  autoValue={config.labelColorAuto}
                  setAuto={(v: boolean) => update('labelColorAuto', v)}
                />
             </div>
           </div>
        </Section>
        
        {/* 6. Glass & Depth */}
        <Section title="Glass & Depth" icon={Droplets}>
           <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <ControlInput label="Backdrop Blur" type="select" value={config.backdropBlur} options={BLUR_OPTIONS} onChange={(v) => update('backdropBlur', v)} />
                 <ControlInput label="Shadow Size" type="select" value={config.shadowSize} options={SHADOW_SIZE_OPTIONS} onChange={(v) => update('shadowSize', v)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <ControlInput label="Shadow Color" type="color" value={config.shadowColor} onChange={(v) => update('shadowColor', v)} />
                  <ControlInput label="Shadow Opacity" type="slider" value={config.shadowOpacity} min={0} max={100} onChange={(v) => update('shadowOpacity', v)} />
              </div>
           </div>
        </Section>

        {/* 7. Borders */}
        <Section title="Borders" icon={BoxSelect}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <ControlInput label="Border Width" value={config.borderWidth} onChange={(v) => update('borderWidth', v)} placeholder="1px" />
               <ControlInput label="Border Style" type="select" value={config.borderStyle} options={BORDER_STYLE_OPTIONS} onChange={(v) => update('borderStyle', v)} />
            </div>

            <ColorPairInput 
               label="Border Color"
               colorValue={config.borderColor}
               setColor={(v: string) => update('borderColor', v)}
               autoValue={config.borderColorAuto}
               setAuto={(v: boolean) => update('borderColorAuto', v)}
            />
          </div>
        </Section>

        {/* 8. Animations */}
        <Section title="Animations" icon={Activity}>
          <div className="space-y-6">
             {/* Card Animation */}
             <div className="space-y-3">
                <p className="text-xs font-bold text-blue-400 uppercase">Card Animation</p>
                <div className="grid grid-cols-2 gap-4">
                  <ControlInput label="Type" type="select" value={config.cardAnimation} options={ANIMATION_OPTIONS} onChange={(v) => update('cardAnimation', v)} />
                  <ControlInput label="Condition" type="select" value={config.cardAnimationTrigger} options={TRIGGER_OPTIONS} onChange={(v) => update('cardAnimationTrigger', v)} />
                </div>
                <ControlInput label="Speed/Duration" value={config.cardAnimationSpeed} onChange={(v) => update('cardAnimationSpeed', v)} placeholder="2s" />
             </div>

             <div className="h-px bg-gray-700/50" />

             {/* Icon Animation */}
             <div className="space-y-3">
                <p className="text-xs font-bold text-blue-400 uppercase">Icon Animation</p>
                <div className="grid grid-cols-2 gap-4">
                  <ControlInput label="Type" type="select" value={config.iconAnimation} options={ANIMATION_OPTIONS} onChange={(v) => update('iconAnimation', v)} />
                  <ControlInput label="Condition" type="select" value={config.iconAnimationTrigger} options={TRIGGER_OPTIONS} onChange={(v) => update('iconAnimationTrigger', v)} />
                </div>
                <ControlInput label="Speed/Duration" value={config.iconAnimationSpeed} onChange={(v) => update('iconAnimationSpeed', v)} placeholder="2s" />
                <ControlInput type="checkbox" label="Rotate Icon" value={config.rotate} onChange={(v) => update('rotate', v)} />
             </div>
          </div>
        </Section>

        {/* 9. Typography */}
        <Section title="Typography" icon={Type}>
           <ControlInput label="Font Family" type="select" value={config.fontFamily} options={FONT_FAMILY_OPTIONS} onChange={(v) => update('fontFamily', v)} />
           <div className="grid grid-cols-2 gap-4 mt-3">
              <ControlInput label="Font Size" value={config.fontSize} onChange={(v) => update('fontSize', v)} placeholder="14px" />
              <ControlInput label="Transform" type="select" value={config.textTransform} options={TRANSFORM_OPTIONS} onChange={(v) => update('textTransform', v)} />
           </div>
           <div className="grid grid-cols-2 gap-4 mt-3">
             <ControlInput label="Font Weight" type="select" value={config.fontWeight} options={WEIGHT_OPTIONS} onChange={(v) => update('fontWeight', v)} />
             <ControlInput label="Letter Spacing" type="select" value={config.letterSpacing} options={LETTER_SPACING_OPTIONS} onChange={(v) => update('letterSpacing', v)} />
           </div>
           <div className="grid grid-cols-2 gap-4 mt-3">
             <ControlInput label="Line Height" type="select" value={config.lineHeight} options={LINE_HEIGHT_OPTIONS} onChange={(v) => update('lineHeight', v)} />
             <ControlInput label="Numeric Precision" value={config.numericPrecision.toString()} onChange={(v) => update('numericPrecision', Number(v))} placeholder="-1 = auto" />
           </div>
        </Section>

        {/* 10. State Logic */}
        <Section title="State Colors & Styles" icon={Zap}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <ControlInput label="ON: Color" type="color" value={config.stateOnColor} onChange={(v) => update('stateOnColor', v)} />
                 <ControlInput label="Opacity" type="slider" value={config.stateOnOpacity} min={0} max={100} onChange={(v) => update('stateOnOpacity', v)} />
              </div>
              <div className="space-y-2">
                 <ControlInput label="OFF: Color" type="color" value={config.stateOffColor} onChange={(v) => update('stateOffColor', v)} />
                 <ControlInput label="Opacity" type="slider" value={config.stateOffOpacity} min={0} max={100} onChange={(v) => update('stateOffOpacity', v)} />
              </div>
            </div>
            
            <div className="h-px bg-gray-700/50" />
            
            {/* State Styles / Conditionals */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-400 uppercase">Conditionals (State-Based Styling)</p>
                <button
                  onClick={() => update('stateStyles', [...config.stateStyles, { 
                    id: 'state_' + (config.stateStyles.length + 1), 
                    operator: 'equals', 
                    value: 'on',
                    name: '',
                    icon: '',
                    color: '',
                    entityPicture: '',
                    label: '',
                    stateDisplay: '',
                    spin: false,
                    styles: '',
                    backgroundColor: '',
                    iconColor: '',
                    nameColor: '',
                    labelColor: '',
                    borderColor: '',
                    cardAnimation: 'none',
                    cardAnimationSpeed: '2s',
                    iconAnimation: 'none',
                    iconAnimationSpeed: '2s',
                  } as StateStyleConfig])}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white"
                >
                  <Plus size={12} /> Add Conditional
                </button>
              </div>
              
              <p className="text-[10px] text-gray-500 mb-3">Define conditions to change colors, animations, or properties based on entity state.</p>
              
              {config.stateStyles.length === 0 ? (
                <div className="text-xs text-gray-500 italic text-center py-2">No conditionals defined</div>
              ) : (
                <div className="space-y-3">
                  {config.stateStyles.map((style, idx) => (
                    <div key={idx} className="p-3 bg-gray-800 rounded border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-400">Condition {idx + 1}</span>
                        <button
                          onClick={() => update('stateStyles', config.stateStyles.filter((_, i) => i !== idx))}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {/* Condition */}
                        <div className="grid grid-cols-2 gap-2">
                          <ControlInput label="Operator" type="select" value={style.operator} options={STATE_OPERATOR_OPTIONS} onChange={(v) => {
                            const updated = [...config.stateStyles];
                            updated[idx] = { ...style, operator: v };
                            update('stateStyles', updated);
                          }} />
                          <ControlInput label="Value" value={style.value} onChange={(v) => {
                            const updated = [...config.stateStyles];
                            updated[idx] = { ...style, value: v };
                            update('stateStyles', updated);
                          }} placeholder="on, off, 50, etc." />
                        </div>
                        
                        {/* Basic Overrides */}
                        <div className="pt-2 border-t border-gray-700">
                          <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Overrides</p>
                          <div className="grid grid-cols-2 gap-2">
                            <ControlInput label="Name" value={style.name} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, name: v };
                              update('stateStyles', updated);
                            }} />
                            <ControlInput label="Icon" value={style.icon} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, icon: v };
                              update('stateStyles', updated);
                            }} placeholder="mdi:..." />
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <ControlInput label="Label" value={style.label} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, label: v };
                              update('stateStyles', updated);
                            }} />
                            <ControlInput label="State Display" value={style.stateDisplay} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, stateDisplay: v };
                              update('stateStyles', updated);
                            }} />
                          </div>
                        </div>
                        
                        {/* Conditional Colors */}
                        <div className="pt-2 border-t border-gray-700">
                          <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Conditional Colors</p>
                          <div className="grid grid-cols-3 gap-2">
                            <ControlInput label="Entity Color" type="color" value={style.color} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, color: v };
                              update('stateStyles', updated);
                            }} />
                            <ControlInput label="Background" type="color" value={style.backgroundColor || ''} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, backgroundColor: v };
                              update('stateStyles', updated);
                            }} />
                            <ControlInput label="Border" type="color" value={style.borderColor || ''} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, borderColor: v };
                              update('stateStyles', updated);
                            }} />
                          </div>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            <ControlInput label="Icon Color" type="color" value={style.iconColor || ''} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, iconColor: v };
                              update('stateStyles', updated);
                            }} />
                            <ControlInput label="Name Color" type="color" value={style.nameColor || ''} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, nameColor: v };
                              update('stateStyles', updated);
                            }} />
                            <ControlInput label="Label Color" type="color" value={style.labelColor || ''} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, labelColor: v };
                              update('stateStyles', updated);
                            }} />
                          </div>
                        </div>
                        
                        {/* Conditional Animations */}
                        <div className="pt-2 border-t border-gray-700">
                          <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Conditional Animations</p>
                          <div className="grid grid-cols-2 gap-2">
                            <ControlInput label="Card Animation" type="select" value={style.cardAnimation || 'none'} options={ANIMATION_OPTIONS} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, cardAnimation: v };
                              update('stateStyles', updated);
                            }} />
                            <ControlInput label="Card Speed" value={style.cardAnimationSpeed || '2s'} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, cardAnimationSpeed: v };
                              update('stateStyles', updated);
                            }} placeholder="2s" />
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <ControlInput label="Icon Animation" type="select" value={style.iconAnimation || 'none'} options={ANIMATION_OPTIONS} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, iconAnimation: v };
                              update('stateStyles', updated);
                            }} />
                            <ControlInput label="Icon Speed" value={style.iconAnimationSpeed || '2s'} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, iconAnimationSpeed: v };
                              update('stateStyles', updated);
                            }} placeholder="2s" />
                          </div>
                          <div className="mt-2">
                            <ControlInput type="checkbox" label="Spin Icon (Legacy)" value={style.spin} onChange={(v) => {
                              const updated = [...config.stateStyles];
                              updated[idx] = { ...style, spin: v };
                              update('stateStyles', updated);
                            }} />
                          </div>
                        </div>
                        
                        {/* Raw Styles */}
                        <div className="pt-2 border-t border-gray-700">
                          <ControlInput label="Additional Styles (YAML)" value={style.styles} onChange={(v) => {
                            const updated = [...config.stateStyles];
                            updated[idx] = { ...style, styles: v };
                            update('stateStyles', updated);
                          }} placeholder="card:\n  - opacity: 0.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* 11. Card Actions */}
        <Section title="Card Actions" icon={MousePointer}>
          <div className="space-y-4">
            <div>
              <ControlInput label="Tap Action" type="select" value={config.tapAction} options={ACTION_OPTIONS} onChange={(v) => update('tapAction', v)} />
              {(config.tapAction === 'call-service') && (
                <div className="mt-2">
                  <ControlInput label="Service Data (JSON)" value={config.tapActionData} onChange={(v) => update('tapActionData', v)} placeholder='{"service": "light.turn_on"}' />
                </div>
              )}
              {(config.tapAction === 'navigate' || config.tapAction === 'url') && (
                <div className="mt-2">
                  <ControlInput label="Path/URL" value={config.tapActionNavigation} onChange={(v) => update('tapActionNavigation', v)} placeholder="/lovelace/0" />
                </div>
              )}
              {(config.tapAction === 'javascript') && (
                <div className="mt-2">
                  <ControlInput label="JavaScript Code" value={config.tapActionJavascript} onChange={(v) => update('tapActionJavascript', v)} placeholder="alert('Hello!')" />
                </div>
              )}
              {(config.tapAction === 'toast') && (
                <div className="mt-2 space-y-2">
                  <ControlInput label="Toast Message" value={config.tapActionToast.message} onChange={(v) => update('tapActionToast', { ...config.tapActionToast, message: v })} />
                  <ControlInput label="Duration (ms)" value={config.tapActionToast.duration.toString()} onChange={(v) => update('tapActionToast', { ...config.tapActionToast, duration: Number(v) || 3000 })} />
                </div>
              )}
            </div>
            
            <div>
              <ControlInput label="Hold Action" type="select" value={config.holdAction} options={ACTION_OPTIONS} onChange={(v) => update('holdAction', v)} />
              {(config.holdAction === 'call-service') && (
                <div className="mt-2">
                  <ControlInput label="Service Data (JSON)" value={config.holdActionData} onChange={(v) => update('holdActionData', v)} placeholder='{"service": "light.turn_on"}' />
                </div>
              )}
              {(config.holdAction === 'navigate' || config.holdAction === 'url') && (
                <div className="mt-2">
                  <ControlInput label="Path/URL" value={config.holdActionNavigation} onChange={(v) => update('holdActionNavigation', v)} placeholder="/lovelace/0" />
                </div>
              )}
              {(config.holdAction === 'javascript') && (
                <div className="mt-2">
                  <ControlInput label="JavaScript Code" value={config.holdActionJavascript} onChange={(v) => update('holdActionJavascript', v)} placeholder="alert('Held!')" />
                </div>
              )}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <ControlInput label="Repeat (ms)" value={config.holdActionRepeat.toString()} onChange={(v) => update('holdActionRepeat', Number(v) || 0)} placeholder="0 = disabled" />
                <ControlInput label="Repeat Limit" value={config.holdActionRepeatLimit.toString()} onChange={(v) => update('holdActionRepeatLimit', Number(v) || 0)} placeholder="0 = unlimited" />
              </div>
            </div>
            
            <div>
              <ControlInput label="Double Tap Action" type="select" value={config.doubleTapAction} options={ACTION_OPTIONS} onChange={(v) => update('doubleTapAction', v)} />
              {(config.doubleTapAction === 'call-service') && (
                <div className="mt-2">
                  <ControlInput label="Service Data (JSON)" value={config.doubleTapActionData} onChange={(v) => update('doubleTapActionData', v)} placeholder='{"service": "light.turn_on"}' />
                </div>
              )}
              {(config.doubleTapAction === 'navigate' || config.doubleTapAction === 'url') && (
                <div className="mt-2">
                  <ControlInput label="Path/URL" value={config.doubleTapActionNavigation} onChange={(v) => update('doubleTapActionNavigation', v)} placeholder="/lovelace/0" />
                </div>
              )}
              {(config.doubleTapAction === 'javascript') && (
                <div className="mt-2">
                  <ControlInput label="JavaScript Code" value={config.doubleTapActionJavascript} onChange={(v) => update('doubleTapActionJavascript', v)} placeholder="alert('Double!')" />
                </div>
              )}
            </div>
            
            <div className="h-px bg-gray-700/50" />
            
            <p className="text-xs font-bold text-gray-400 uppercase">Action Sounds</p>
            <div className="grid grid-cols-3 gap-2">
              <ControlInput label="Tap Sound" value={config.tapActionSound} onChange={(v) => update('tapActionSound', v)} placeholder="/local/..." />
              <ControlInput label="Hold Sound" value={config.holdActionSound} onChange={(v) => update('holdActionSound', v)} placeholder="/local/..." />
              <ControlInput label="Dbl Tap Sound" value={config.doubleTapActionSound} onChange={(v) => update('doubleTapActionSound', v)} placeholder="/local/..." />
            </div>
          </div>
        </Section>
        
        {/* 12. Momentary Actions */}
        <Section title="Momentary Actions" icon={Hand}>
          <p className="text-xs text-gray-400 mb-4">Press/release actions for momentary switches (e.g., garage doors)</p>
          <div className="space-y-4">
            <div>
              <ControlInput label="Press Action" type="select" value={config.pressAction} options={ACTION_OPTIONS} onChange={(v) => update('pressAction', v)} />
              {(config.pressAction === 'call-service') && (
                <div className="mt-2">
                  <ControlInput label="Service Data (JSON)" value={config.pressActionData} onChange={(v) => update('pressActionData', v)} placeholder='{"service": "switch.turn_on"}' />
                </div>
              )}
              {(config.pressAction === 'javascript') && (
                <div className="mt-2">
                  <ControlInput label="JavaScript Code" value={config.pressActionJavascript} onChange={(v) => update('pressActionJavascript', v)} />
                </div>
              )}
            </div>
            
            <div>
              <ControlInput label="Release Action" type="select" value={config.releaseAction} options={ACTION_OPTIONS} onChange={(v) => update('releaseAction', v)} />
              {(config.releaseAction === 'call-service') && (
                <div className="mt-2">
                  <ControlInput label="Service Data (JSON)" value={config.releaseActionData} onChange={(v) => update('releaseActionData', v)} placeholder='{"service": "switch.turn_off"}' />
                </div>
              )}
              {(config.releaseAction === 'javascript') && (
                <div className="mt-2">
                  <ControlInput label="JavaScript Code" value={config.releaseActionJavascript} onChange={(v) => update('releaseActionJavascript', v)} />
                </div>
              )}
            </div>
          </div>
        </Section>
        
        {/* 13. Icon Actions */}
        <Section title="Icon Actions" icon={Target}>
          <p className="text-xs text-gray-400 mb-4">Separate actions when clicking on the icon specifically</p>
          <div className="space-y-4">
            <div>
              <ControlInput label="Icon Tap Action" type="select" value={config.iconTapAction} options={ACTION_OPTIONS} onChange={(v) => update('iconTapAction', v)} />
              {(config.iconTapAction === 'call-service') && (
                <div className="mt-2">
                  <ControlInput label="Service Data (JSON)" value={config.iconTapActionData} onChange={(v) => update('iconTapActionData', v)} />
                </div>
              )}
              {(config.iconTapAction === 'navigate' || config.iconTapAction === 'url') && (
                <div className="mt-2">
                  <ControlInput label="Path/URL" value={config.iconTapActionNavigation} onChange={(v) => update('iconTapActionNavigation', v)} />
                </div>
              )}
              {(config.iconTapAction === 'javascript') && (
                <div className="mt-2">
                  <ControlInput label="JavaScript Code" value={config.iconTapActionJavascript} onChange={(v) => update('iconTapActionJavascript', v)} />
                </div>
              )}
            </div>
            
            <div>
              <ControlInput label="Icon Hold Action" type="select" value={config.iconHoldAction} options={ACTION_OPTIONS} onChange={(v) => update('iconHoldAction', v)} />
              {(config.iconHoldAction === 'call-service') && (
                <div className="mt-2">
                  <ControlInput label="Service Data (JSON)" value={config.iconHoldActionData} onChange={(v) => update('iconHoldActionData', v)} />
                </div>
              )}
              {(config.iconHoldAction === 'navigate' || config.iconHoldAction === 'url') && (
                <div className="mt-2">
                  <ControlInput label="Path/URL" value={config.iconHoldActionNavigation} onChange={(v) => update('iconHoldActionNavigation', v)} />
                </div>
              )}
              {(config.iconHoldAction === 'javascript') && (
                <div className="mt-2">
                  <ControlInput label="JavaScript Code" value={config.iconHoldActionJavascript} onChange={(v) => update('iconHoldActionJavascript', v)} />
                </div>
              )}
            </div>
            
            <div>
              <ControlInput label="Icon Double Tap Action" type="select" value={config.iconDoubleTapAction} options={ACTION_OPTIONS} onChange={(v) => update('iconDoubleTapAction', v)} />
              {(config.iconDoubleTapAction === 'call-service') && (
                <div className="mt-2">
                  <ControlInput label="Service Data (JSON)" value={config.iconDoubleTapActionData} onChange={(v) => update('iconDoubleTapActionData', v)} />
                </div>
              )}
              {(config.iconDoubleTapAction === 'navigate' || config.iconDoubleTapAction === 'url') && (
                <div className="mt-2">
                  <ControlInput label="Path/URL" value={config.iconDoubleTapActionNavigation} onChange={(v) => update('iconDoubleTapActionNavigation', v)} />
                </div>
              )}
              {(config.iconDoubleTapAction === 'javascript') && (
                <div className="mt-2">
                  <ControlInput label="JavaScript Code" value={config.iconDoubleTapActionJavascript} onChange={(v) => update('iconDoubleTapActionJavascript', v)} />
                </div>
              )}
            </div>
            
            <div className="h-px bg-gray-700/50" />
            
            <p className="text-xs font-bold text-gray-400 uppercase">Icon Momentary Actions</p>
            <div className="space-y-4">
              <div>
                <ControlInput label="Icon Press Action" type="select" value={config.iconPressAction} options={ACTION_OPTIONS} onChange={(v) => update('iconPressAction', v)} />
                {(config.iconPressAction === 'call-service') && (
                  <div className="mt-2">
                    <ControlInput label="Service Data (JSON)" value={config.iconPressActionData} onChange={(v) => update('iconPressActionData', v)} />
                  </div>
                )}
              </div>
              
              <div>
                <ControlInput label="Icon Release Action" type="select" value={config.iconReleaseAction} options={ACTION_OPTIONS} onChange={(v) => update('iconReleaseAction', v)} />
                {(config.iconReleaseAction === 'call-service') && (
                  <div className="mt-2">
                    <ControlInput label="Service Data (JSON)" value={config.iconReleaseActionData} onChange={(v) => update('iconReleaseActionData', v)} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Section>
        
        {/* 14. Confirmation & Security */}
        <Section title="Confirmation" icon={AlertCircle}>
          <div className="space-y-4">
            <ControlInput type="checkbox" label="Require Confirmation" value={config.confirmation.enabled} onChange={(v) => update('confirmation', { ...config.confirmation, enabled: v })} />
            {config.confirmation.enabled && (
              <ControlInput label="Confirmation Text" value={config.confirmation.text} onChange={(v) => update('confirmation', { ...config.confirmation, text: v })} placeholder="Are you sure?" />
            )}
          </div>
        </Section>
        
        {/* 15. Lock */}
        <Section title="Lock" icon={Lock}>
          <div className="space-y-4">
            <ControlInput type="checkbox" label="Enable Lock" value={config.lock.enabled} onChange={(v) => update('lock', { ...config.lock, enabled: v })} />
            {config.lock.enabled && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <ControlInput label="Duration (sec)" value={config.lock.duration.toString()} onChange={(v) => update('lock', { ...config.lock, duration: Number(v) || 5 })} />
                  <ControlInput label="Unlock Gesture" type="select" value={config.lock.unlock} options={LOCK_UNLOCK_OPTIONS} onChange={(v) => update('lock', { ...config.lock, unlock: v })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ControlInput label="Lock Icon" value={config.lock.lockIcon} onChange={(v) => update('lock', { ...config.lock, lockIcon: v })} placeholder="mdi:lock-outline" />
                  <ControlInput label="Unlock Icon" value={config.lock.unlockIcon} onChange={(v) => update('lock', { ...config.lock, unlockIcon: v })} placeholder="mdi:lock-open-outline" />
                </div>
                <ControlInput type="checkbox" label="Keep Unlock Icon" value={config.lock.keepUnlockIcon} onChange={(v) => update('lock', { ...config.lock, keepUnlockIcon: v })} />
              </>
            )}
          </div>
        </Section>
        
        {/* 16. Protect (PIN/Password) */}
        <Section title="Protect (PIN/Password)" icon={Shield}>
          <div className="space-y-4">
            <ControlInput type="checkbox" label="Enable Protection" value={config.protect.enabled} onChange={(v) => update('protect', { ...config.protect, enabled: v })} />
            {config.protect.enabled && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <ControlInput label="Type" type="select" value={config.protect.type} options={PROTECT_TYPE_OPTIONS} onChange={(v) => update('protect', { ...config.protect, type: v })} />
                  <ControlInput label="Code/Password" type="password" value={config.protect.value} onChange={(v) => update('protect', { ...config.protect, value: v })} />
                </div>
                <ControlInput label="Failure Message" value={config.protect.failureMessage} onChange={(v) => update('protect', { ...config.protect, failureMessage: v })} />
                <ControlInput label="Success Message" value={config.protect.successMessage} onChange={(v) => update('protect', { ...config.protect, successMessage: v })} />
              </>
            )}
          </div>
        </Section>
        
        {/* 17. Tooltip */}
        <Section title="Tooltip" icon={MessageSquare}>
          <div className="space-y-4">
            <ControlInput type="checkbox" label="Enable Tooltip" value={config.tooltip.enabled} onChange={(v) => update('tooltip', { ...config.tooltip, enabled: v })} />
            {config.tooltip.enabled && (
              <ControlInput label="Content" value={config.tooltip.content} onChange={(v) => update('tooltip', { ...config.tooltip, content: v })} placeholder="Hover text or template..." />
            )}
          </div>
        </Section>
        
        {/* 18. Custom Fields */}
        <Section title="Custom Fields" icon={Code}>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-400 uppercase">Custom Fields</p>
                <button
                  onClick={() => update('customFields', [...config.customFields, { name: 'field' + (config.customFields.length + 1), type: 'text', value: '', styles: '' }])}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white"
                >
                  <Plus size={12} /> Add Field
                </button>
              </div>
              
              {config.customFields.length === 0 ? (
                <div className="text-xs text-gray-500 italic text-center py-2">No custom fields</div>
              ) : (
                <div className="space-y-3">
                  {config.customFields.map((field, idx) => (
                    <div key={idx} className="p-3 bg-gray-800 rounded border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-400">Field {idx + 1}</span>
                        <button
                          onClick={() => update('customFields', config.customFields.filter((_, i) => i !== idx))}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <ControlInput label="Name" value={field.name} onChange={(v) => {
                          const updated = [...config.customFields];
                          updated[idx] = { ...field, name: v };
                          update('customFields', updated);
                        }} />
                        <ControlInput label="Value/Template" value={field.value} onChange={(v) => {
                          const updated = [...config.customFields];
                          updated[idx] = { ...field, value: v };
                          update('customFields', updated);
                        }} placeholder="[[[ return entity.state ]]]" />
                        <ControlInput label="Styles (YAML)" value={field.styles || ''} onChange={(v) => {
                          const updated = [...config.customFields];
                          updated[idx] = { ...field, styles: v };
                          update('customFields', updated);
                        }} placeholder="- font-size: 12px" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>
        
        {/* 19. Advanced Settings */}
        <Section title="Advanced Settings" icon={Settings}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <ControlInput label="Card Opacity" type="slider" value={config.cardOpacity} min={0} max={100} onChange={(v) => update('cardOpacity', v)} />
              <ControlInput label="Update Timer (s)" value={config.updateTimer.toString()} onChange={(v) => update('updateTimer', Number(v) || 0)} placeholder="0 = disabled" />
            </div>
            
            <ControlInput label="Template" value={config.template} onChange={(v) => update('template', v)} placeholder="template_name" />
            
            <div className="grid grid-cols-2 gap-4">
              <ControlInput type="checkbox" label="Icon Spin (rotate)" value={config.spin} onChange={(v) => update('spin', v)} />
              <ControlInput type="checkbox" label="Spinner Loading" value={config.spinner} onChange={(v) => update('spinner', v)} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <ControlInput type="checkbox" label="Disable Keyboard" value={config.disableKeyboard} onChange={(v) => update('disableKeyboard', v)} />
              <ControlInput type="checkbox" label="Group Expand" value={config.groupExpand} onChange={(v) => update('groupExpand', v)} />
            </div>
            
            {config.spin && (
              <ControlInput label="Spin Duration" value={config.spinDuration} onChange={(v) => update('spinDuration', v)} placeholder="2s" />
            )}
            
            <div className="h-px bg-gray-700/50" />
            
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Extra Styles (Raw CSS)</p>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Card/General Styles</label>
              <textarea
                value={config.extraStyles}
                onChange={(e) => update('extraStyles', e.target.value)}
                placeholder="card:\n  - background: linear-gradient(...)\nicon:\n  - transform: rotate(45deg)"
                className="w-full h-24 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Entity Picture Styles</label>
              <textarea
                value={config.entityPictureStyles}
                onChange={(e) => update('entityPictureStyles', e.target.value)}
                placeholder="- border-radius: 50%"
                className="w-full h-16 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Grid Styles</label>
              <textarea
                value={config.gridStyles}
                onChange={(e) => update('gridStyles', e.target.value)}
                placeholder="- grid-template-areas: ..."
                className="w-full h-16 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        </Section>
        
        <div className="h-10"></div>
      </div>
    </div>
  );
};
