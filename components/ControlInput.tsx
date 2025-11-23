import React from 'react';

interface Props {
  label: string;
  value: any;
  onChange: (val: any) => void;
  type?: 'text' | 'color' | 'number' | 'select' | 'checkbox';
  options?: { value: string; label: string }[];
  className?: string;
  placeholder?: string;
}

export const ControlInput: React.FC<Props> = ({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  options = [], 
  className = '',
  placeholder = ''
}) => {
  
  if (type === 'checkbox') {
    return (
      <label className={`flex items-center justify-between p-2 bg-gray-800/50 rounded border border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors ${className}`}>
        <span className="text-sm text-gray-300">{label}</span>
        <input 
          type="checkbox" 
          checked={value === true} 
          onChange={(e) => onChange(e.target.checked)}
          className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-0 w-4 h-4" 
        />
      </label>
    );
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</label>
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
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-600"
          />
        )}
      </div>
    </div>
  );
};
