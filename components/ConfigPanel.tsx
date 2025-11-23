
import React, { useState } from 'react';
import { ButtonConfig, CustomField } from '../types';
import { ControlInput } from './ControlInput';
import { EntitySelector } from './EntitySelector';
import { LAYOUT_OPTIONS, ACTION_OPTIONS, TRANSFORM_OPTIONS, WEIGHT_OPTIONS, BORDER_STYLE_OPTIONS, ANIMATION_OPTIONS, BLUR_OPTIONS, SHADOW_SIZE_OPTIONS, TRIGGER_OPTIONS, CONDITIONAL_OPERATORS } from '../constants';
import { Layers, Type, MousePointer, Palette, Zap, ChevronDown, ChevronRight, Layout, ToggleRight, BoxSelect, Droplets, Activity, Settings, Lock, AlertCircle, Code, Plus, X } from 'lucide-react';

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
          <ControlInput label="Label" value={config.label} onChange={(v) => update('label', v)} />
          <ControlInput label="Icon (mdi:...)" value={config.icon} onChange={(v) => update('icon', v)} />
          
          <div className="pt-3 border-t border-gray-800">
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Templates (Advanced)</p>
            <div className="space-y-3">
              <ControlInput label="Name Template" value={config.nameTemplate} onChange={(v) => update('nameTemplate', v)} placeholder="[[[ return entity.state ]]]" />
              <ControlInput label="Label Template" value={config.labelTemplate} onChange={(v) => update('labelTemplate', v)} placeholder="[[[ return entity.attributes.temperature + '°C' ]]]" />
              <ControlInput label="Icon Template" value={config.iconTemplate} onChange={(v) => update('iconTemplate', v)} placeholder="[[[ return entity.state === 'on' ? 'mdi:lightbulb-on' : 'mdi:lightbulb-off' ]]]" />
            </div>
          </div>
        </Section>

        {/* 2. Layout & Dimensions */}
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
        </Section>

        {/* 3. Visibility Toggles */}
        <Section title="Visibility" icon={ToggleRight}>
          <div className="grid grid-cols-2 gap-3">
            <ControlInput type="checkbox" label="Show Name" value={config.showName} onChange={(v) => update('showName', v)} />
            <ControlInput type="checkbox" label="Show Icon" value={config.showIcon} onChange={(v) => update('showIcon', v)} />
            <ControlInput type="checkbox" label="Show State" value={config.showState} onChange={(v) => update('showState', v)} />
            <ControlInput type="checkbox" label="Show Label" value={config.showLabel} onChange={(v) => update('showLabel', v)} />
            <ControlInput type="checkbox" label="Show Last Chg." value={config.showLastChanged} onChange={(v) => update('showLastChanged', v)} />
            <ControlInput type="checkbox" label="Entity Picture" value={config.showEntityPicture} onChange={(v) => update('showEntityPicture', v)} />
            <ControlInput type="checkbox" label="Show Units" value={config.showUnits} onChange={(v) => update('showUnits', v)} />
          </div>
        </Section>

        {/* 4. Colors & Theming */}
        <Section title="Colors & Theming" icon={Palette}>
           <div className="space-y-6">
             {/* Global Settings */}
             <div className="space-y-4">
                <ControlInput type="select" label="Color Type" value={config.colorType} options={[
                   { value: 'card', label: 'Card (Default)' }, 
                   { value: 'icon', label: 'Icon Only' },
                   { value: 'blank-card', label: 'Blank' },
                   { value: 'label-card', label: 'Label' }
                 ]} onChange={(v) => update('colorType', v)} />
                
                <div className="grid grid-cols-2 gap-4">
                   <ControlInput type="checkbox" label="Auto Color (Light)" value={config.colorAuto} onChange={(v) => update('colorAuto', v)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <ControlInput label="Card Background" type="color" value={config.backgroundColor} onChange={(v) => update('backgroundColor', v)} />
                      <ControlInput label="Opacity" type="slider" value={config.backgroundColorOpacity} onChange={(v) => update('backgroundColorOpacity', Number(v))} />
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
        
        {/* 5. Glass & Depth */}
        <Section title="Glass & Depth" icon={Droplets}>
           <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <ControlInput label="Backdrop Blur" type="select" value={config.backdropBlur} options={BLUR_OPTIONS} onChange={(v) => update('backdropBlur', v)} />
                 <ControlInput label="Shadow Size" type="select" value={config.shadowSize} options={SHADOW_SIZE_OPTIONS} onChange={(v) => update('shadowSize', v)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <ControlInput label="Shadow Color" type="color" value={config.shadowColor} onChange={(v) => update('shadowColor', v)} />
                  <ControlInput label="Shadow Opacity" type="slider" value={config.shadowOpacity} onChange={(v) => update('shadowOpacity', Number(v))} />
              </div>
           </div>
        </Section>

        {/* 6. Borders */}
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

        {/* 7. Animations */}
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
             </div>
          </div>
        </Section>

        {/* 8. Typography */}
        <Section title="Typography" icon={Type}>
           <div className="grid grid-cols-2 gap-4">
              <ControlInput label="Font Size" value={config.fontSize} onChange={(v) => update('fontSize', v)} placeholder="14px" />
              <ControlInput label="Transform" type="select" value={config.textTransform} options={TRANSFORM_OPTIONS} onChange={(v) => update('textTransform', v)} />
           </div>
           <div className="grid grid-cols-2 gap-4 mt-3">
             <ControlInput label="Font Weight" type="select" value={config.fontWeight} options={WEIGHT_OPTIONS} onChange={(v) => update('fontWeight', v)} />
             <ControlInput label="Letter Spacing" value={config.letterSpacing} onChange={(v) => update('letterSpacing', v)} placeholder="normal" />
           </div>
           <ControlInput label="Line Height" value={config.lineHeight} onChange={(v) => update('lineHeight', v)} placeholder="normal" />
        </Section>

        {/* 9. State Logic */}
        <Section title="State Colors (ON/OFF)" icon={Zap}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <ControlInput label="ON: Color" type="color" value={config.stateOnColor} onChange={(v) => update('stateOnColor', v)} />
                 <ControlInput label="Opacity" type="slider" value={config.stateOnOpacity} onChange={(v) => update('stateOnOpacity', Number(v))} />
              </div>
              <div className="space-y-2">
                 <ControlInput label="OFF: Color" type="color" value={config.stateOffColor} onChange={(v) => update('stateOffColor', v)} />
                 <ControlInput label="Opacity" type="slider" value={config.stateOffOpacity} onChange={(v) => update('stateOffOpacity', Number(v))} />
              </div>
            </div>
          </div>
        </Section>

        {/* 10. Actions */}
        <Section title="Actions" icon={MousePointer}>
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
            </div>
          </div>
        </Section>
        
        {/* 11. Confirmation & Security */}
        <Section title="Confirmation & Security" icon={Lock}>
          <div className="space-y-4">
            <ControlInput type="checkbox" label="Require Confirmation" value={config.confirmation.enabled} onChange={(v) => update('confirmation', { ...config.confirmation, enabled: v })} />
            {config.confirmation.enabled && (
              <ControlInput label="Confirmation Text" value={config.confirmation.text} onChange={(v) => update('confirmation', { ...config.confirmation, text: v })} placeholder="Are you sure?" />
            )}
            
            <div className="h-px bg-gray-700/50" />
            
            <ControlInput type="checkbox" label="Lock Button" value={config.lock} onChange={(v) => update('lock', v)} />
            {config.lock && (
              <ControlInput label="Lock Code" value={config.lockCode} onChange={(v) => update('lockCode', v)} placeholder="1234" />
            )}
          </div>
        </Section>
        
        {/* 12. Tooltip & Custom Fields */}
        <Section title="Tooltip & Custom Fields" icon={Code}>
          <div className="space-y-4">
            <ControlInput label="Tooltip" value={config.tooltip} onChange={(v) => update('tooltip', v)} placeholder="Hover text..." />
            
            <div className="h-px bg-gray-700/50" />
            
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>
        
        {/* 13. Conditional Display */}
        <Section title="Conditional Display" icon={AlertCircle}>
          <div className="space-y-4">
            <p className="text-xs text-gray-400">Show button only when condition is met</p>
            <EntitySelector label="Conditional Entity" value={config.conditionalEntity} onChange={(v) => update('conditionalEntity', v)} />
            <div className="grid grid-cols-2 gap-4">
              <ControlInput label="Operator" type="select" value={config.conditionalOperator} options={CONDITIONAL_OPERATORS} onChange={(v) => update('conditionalOperator', v)} />
              <ControlInput label="State Value" value={config.conditionalState} onChange={(v) => update('conditionalState', v)} placeholder="on" />
            </div>
          </div>
        </Section>
        
        {/* 14. Advanced Settings */}
        <Section title="Advanced Settings" icon={Settings}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <ControlInput label="Card Opacity" type="slider" value={config.cardOpacity} onChange={(v) => update('cardOpacity', Number(v))} />
              <ControlInput label="Hold Time (ms)" value={config.holdTime.toString()} onChange={(v) => update('holdTime', Number(v) || 500)} placeholder="500" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <ControlInput type="checkbox" label="Haptic Feedback" value={config.hapticFeedback} onChange={(v) => update('hapticFeedback', v)} />
              <ControlInput type="checkbox" label="Icon Spin" value={config.spin} onChange={(v) => update('spin', v)} />
            </div>
            
            {config.spin && (
              <ControlInput label="Spin Duration" value={config.spinDuration} onChange={(v) => update('spinDuration', v)} placeholder="2s" />
            )}
            
            <div className="h-px bg-gray-700/50" />
            
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Extra Styles (CSS)</label>
              <textarea
                value={config.extraStyles}
                onChange={(e) => update('extraStyles', e.target.value)}
                placeholder="card:\n  - background: linear-gradient(...)\nicon:\n  - transform: rotate(45deg)"
                className="w-full h-24 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        </Section>
        
        <div className="h-10"></div>
      </div>
    </div>
  );
};
