// Tile Card Preview Component

import React from 'react';
import { TileCardConfig } from '../types';
import { getIconComponent } from '../../services/iconMapper';

interface Props {
  config: TileCardConfig;
}

export const Preview: React.FC<Props> = ({ config }) => {
  const IconComponent = config.icon ? getIconComponent(config.icon) : null;

  // Resolve color
  const getColorClass = (color?: string) => {
    if (!color || color === 'state') return 'bg-blue-600';
    
    const colorMap: Record<string, string> = {
      'primary': 'bg-blue-600',
      'accent': 'bg-purple-600',
      'red': 'bg-red-600',
      'pink': 'bg-pink-600',
      'purple': 'bg-purple-600',
      'deep-purple': 'bg-purple-800',
      'indigo': 'bg-indigo-600',
      'blue': 'bg-blue-600',
      'light-blue': 'bg-blue-400',
      'cyan': 'bg-cyan-600',
      'teal': 'bg-teal-600',
      'green': 'bg-green-600',
      'light-green': 'bg-green-400',
      'lime': 'bg-lime-600',
      'yellow': 'bg-yellow-500',
      'amber': 'bg-amber-600',
      'orange': 'bg-orange-600',
      'deep-orange': 'bg-orange-700',
      'brown': 'bg-amber-800',
      'grey': 'bg-gray-600',
      'blue-grey': 'bg-slate-600',
      'black': 'bg-black',
      'white': 'bg-white',
    };

    if (color.startsWith('#')) {
      return '';
    }

    return colorMap[color] || 'bg-blue-600';
  };

  const colorClass = getColorClass(config.color);
  const customColor = config.color?.startsWith('#') ? config.color : undefined;

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="mb-4 text-center">
          <h2 className="text-lg font-semibold text-gray-200 mb-1">Live Preview</h2>
          <p className="text-xs text-gray-500">How your tile card will look</p>
        </div>

        {/* Tile Card Preview */}
        <div className="bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-700">
          {config.vertical ? (
            // Vertical layout
            <div className="flex flex-col items-center text-center space-y-3">
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${colorClass}`}
                style={customColor ? { backgroundColor: customColor } : undefined}
              >
                {IconComponent ? (
                  <IconComponent style={{ width: 32, height: 32, color: 'white' }} />
                ) : (
                  <div className="w-8 h-8 rounded bg-white/30" />
                )}
              </div>

              {/* Name */}
              <div>
                <div className="text-base font-semibold text-white">
                  {config.name || config.entity || 'Tile Card'}
                </div>
                {!config.hide_state && (
                  <div className="text-sm text-gray-400">
                    {config.state_content?.[0] === 'state' ? 'on' : 'Updated 2h ago'}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Horizontal layout (default)
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}
                style={customColor ? { backgroundColor: customColor } : undefined}
              >
                {IconComponent ? (
                  <IconComponent style={{ width: 24, height: 24, color: 'white' }} />
                ) : (
                  <div className="w-6 h-6 rounded bg-white/30" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">
                  {config.name || config.entity || 'Tile Card'}
                </div>
                {!config.hide_state && (
                  <div className="text-xs text-gray-400">
                    {(config.state_content || []).map((content, i) => (
                      <div key={i}>
                        {content === 'state' && 'on'}
                        {content === 'last-changed' && 'Updated 2h ago'}
                        {content === 'last-updated' && 'Changed 5m ago'}
                        {!['state', 'last-changed', 'last-updated'].includes(content) && `${content}: value`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Features Preview */}
          {config.features && config.features.length > 0 && (
            <div className={`${config.vertical ? 'mt-4' : 'mt-3'} pt-3 border-t border-gray-700`}>
              <div className="space-y-2">
                {config.features.map((feature, index) => (
                  <FeaturePreview key={index} feature={feature} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 text-center text-xs text-gray-500">
          {config.features?.length || 0} feature{config.features?.length !== 1 ? 's' : ''} • {config.features_position || 'bottom'} position
        </div>
      </div>
    </div>
  );
};

// Feature preview components
const FeaturePreview: React.FC<{ feature: any }> = ({ feature }) => {
  const getFeatureLabel = (type: string) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Simple feature previews
  if (['toggle', 'light-brightness', 'cover-position', 'fan-speed', 'media-player-volume-slider', 'target-temperature', 'target-humidity', 'numeric-input'].includes(feature.type)) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 flex-shrink-0">{getFeatureLabel(feature.type)}</span>
        <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-blue-500 rounded-full" />
        </div>
        <span className="text-xs text-gray-300 flex-shrink-0">65%</span>
      </div>
    );
  }

  if (['cover-open-close', 'lock-commands', 'media-player-playback', 'vacuum-commands'].includes(feature.type)) {
    return (
      <div className="flex gap-2">
        <button className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs text-white font-medium">
          Open
        </button>
        <button className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs text-white font-medium">
          Close
        </button>
      </div>
    );
  }

  if (feature.type === 'bar-gauge') {
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-400">
          <span>{feature.min ?? 0}</span>
          <span>{feature.max ?? 100}</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-green-500 rounded-full" />
        </div>
      </div>
    );
  }

  if (feature.type === 'trend-graph') {
    return (
      <div className="h-12 bg-gray-700 rounded-lg flex items-end gap-0.5 px-2 py-1">
        {[30, 45, 60, 55, 70, 65, 80, 75, 85, 90].map((h, i) => (
          <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
    );
  }

  // Default fallback
  return (
    <div className="px-3 py-2 bg-gray-700 rounded-lg text-xs text-gray-300 text-center">
      {getFeatureLabel(feature.type)}
    </div>
  );
};
