import React from 'react';

interface Props {
  label: string;
  value: any;
  onChange: (val: any) => void;
  type?: 'text' | 'color' | 'number' | 'select' | 'checkbox' | 'slider';
  options?: { value: string; label: string }[];
  className?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string; // Auto-append suffix like 'px', '%', 's', etc.
  isPresetField?: boolean;
  isModified?: boolean;
}

export const ControlInput: React.FC<Props> = ({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  options = [], 
  className = '',
  placeholder = '',
  min = 0,
  max = 100,
  step = 1,
  suffix,
  isPresetField = false,
  isModified = false
}) => {
  
  // Handle auto-suffix on blur
  const handleBlurWithSuffix = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!suffix) return;
    
    const val = e.target.value.trim();
    if (!val) return;
    
    // Check if value is a number or ends with the suffix already
    if (val.endsWith(suffix)) return;
    
    // Extract numeric part - check if it's just a number
    const numericMatch = val.match(/^-?[\d.]+$/);
    if (numericMatch) {
      onChange(val + suffix);
    }
  };

  // Handle key press - auto-add suffix on Enter
  const handleKeyDownWithSuffix = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suffix || e.key !== 'Enter') return;
    
    const val = (e.target as HTMLInputElement).value.trim();
    if (!val) return;
    
    if (val.endsWith(suffix)) return;
    
    const numericMatch = val.match(/^-?[\d.]+$/);
    if (numericMatch) {
      onChange(val + suffix);
    }
  };
  
  if (type === 'checkbox') {
    return (
      <label className={`flex items-center justify-between p-2 bg-gray-800/50 rounded border border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors ${isPresetField && !isModified ? 'ring-1 ring-purple-500/30' : ''} ${isModified ? 'ring-1 ring-yellow-500/30' : ''} ${className}`}>
        <span className="text-sm text-gray-300 flex items-center gap-1">
          {label}
          {isPresetField && (
            <span 
              className={`text-[8px] px-1 rounded ${isModified ? 'bg-yellow-500/20 text-yellow-400' : 'bg-purple-500/20 text-purple-400'}`}
              title={isModified ? 'Modified from preset' : 'From preset'}
            >
              {isModified ? '✎' : '◆'}
            </span>
          )}
        </span>
        <input 
          type="checkbox" 
          checked={value === true} 
          onChange={(e) => onChange(e.target.checked)}
          className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-0 w-4 h-4" 
        />
      </label>
    );
  }

  if (type === 'slider') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          <span className="flex items-center gap-1">
            {label}
            {isPresetField && (
              <span 
                className={`text-[8px] px-1 rounded ${isModified ? 'bg-yellow-500/20 text-yellow-400' : 'bg-purple-500/20 text-purple-400'}`}
                title={isModified ? 'Modified from preset' : 'From preset'}
              >
                {isModified ? '✎' : '◆'}
              </span>
            )}
          </span>
          <span className="text-gray-400 font-mono text-[11px]">{value}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
        {label}
        {isPresetField && (
          <span 
            className={`text-[8px] px-1 rounded ${isModified ? 'bg-yellow-500/20 text-yellow-400' : 'bg-purple-500/20 text-purple-400'}`}
            title={isModified ? 'Modified from preset' : 'From preset'}
          >
            {isModified ? '✎' : '◆'}
          </span>
        )}
      </label>
      <div className="flex items-center gap-2">
        {type === 'color' && (
          <div 
            className="w-8 h-9 rounded border border-gray-600 overflow-hidden shrink-0 relative"
            style={{ backgroundColor: value as string }}
          >
            <input 
              type="color" 
              value={value} 
              onChange={(e) => onChange(e.target.value)}
              className="opacity-0 w-full h-full cursor-pointer absolute inset-0"
            />
          </div>
        )}
        
        {type === 'select' ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : (
          <input
            type={type === 'color' ? 'text' : type}
            value={value}
            placeholder={placeholder || (suffix ? `e.g. 10${suffix}` : '')}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlurWithSuffix}
            onKeyDown={handleKeyDownWithSuffix}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600"
          />
        )}
      </div>
    </div>
  );
};
