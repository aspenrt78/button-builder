import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Trash2, Grid3X3 } from 'lucide-react';
import { EntitySelector } from './EntitySelector';

interface GridCell {
  row: number;
  col: number;
  areaName: string;
}

interface GridArea {
  name: string;
  color: string;
  cells: { row: number; col: number }[];
  content?: GridAreaContent;
}

interface GridAreaContent {
  type: 'icon' | 'name' | 'state' | 'label' | 'entity' | 'custom';
  entity?: string;
  attribute?: string;
  prefix?: string;
  suffix?: string;
  icon?: string;
  customValue?: string;
}

interface GridDesignerProps {
  gridTemplateAreas: string;
  gridTemplateColumns: string;
  gridTemplateRows: string;
  onUpdate: (areas: string, columns: string, rows: string, customFields?: any[]) => void;
  onClose: () => void;
  existingCustomFields?: any[];
}

const AREA_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
  '#6366f1', // indigo
];

export const GridDesigner: React.FC<GridDesignerProps> = ({
  gridTemplateAreas,
  gridTemplateColumns,
  gridTemplateRows,
  onUpdate,
  onClose,
  existingCustomFields = [],
}) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(2);
  const [areas, setAreas] = useState<GridArea[]>([]);
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  // Initialize grid from existing template or create empty
  useEffect(() => {
    parseExistingTemplate();
  }, []);

  const parseExistingTemplate = () => {
    if (gridTemplateAreas && gridTemplateAreas.trim()) {
      const rowMatches = gridTemplateAreas.match(/"([^"]+)"/g);
      if (rowMatches) {
        const parsedRows = rowMatches.map(r => r.replace(/"/g, '').trim().split(/\s+/));
        const numRows = parsedRows.length;
        const numCols = Math.max(...parsedRows.map(r => r.length));
        
        setRows(numRows);
        setCols(numCols);
        
        const newGrid: GridCell[][] = [];
        const areaMap = new Map<string, { cells: { row: number; col: number }[], color: string }>();
        let colorIndex = 0;
        
        for (let r = 0; r < numRows; r++) {
          const row: GridCell[] = [];
          for (let c = 0; c < numCols; c++) {
            const areaName = parsedRows[r]?.[c] || '.';
            row.push({ row: r, col: c, areaName });
            
            if (areaName !== '.') {
              if (!areaMap.has(areaName)) {
                areaMap.set(areaName, { cells: [], color: AREA_COLORS[colorIndex % AREA_COLORS.length] });
                colorIndex++;
              }
              areaMap.get(areaName)!.cells.push({ row: r, col: c });
            }
          }
          newGrid.push(row);
        }
        
        setGrid(newGrid);
        setAreas(Array.from(areaMap.entries()).map(([name, data]) => ({
          name,
          color: data.color,
          cells: data.cells,
        })));
        return;
      }
    }
    
    initializeEmptyGrid(rows, cols);
  };

  const initializeEmptyGrid = (numRows: number, numCols: number) => {
    const newGrid: GridCell[][] = [];
    for (let r = 0; r < numRows; r++) {
      const row: GridCell[] = [];
      for (let c = 0; c < numCols; c++) {
        row.push({ row: r, col: c, areaName: '.' });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setAreas([]);
  };

  const resizeGrid = (newRows: number, newCols: number) => {
    const newGrid: GridCell[][] = [];
    for (let r = 0; r < newRows; r++) {
      const row: GridCell[] = [];
      for (let c = 0; c < newCols; c++) {
        // Preserve existing cell if it exists
        const existingCell = grid[r]?.[c];
        row.push(existingCell || { row: r, col: c, areaName: '.' });
      }
      newGrid.push(row);
    }
    setRows(newRows);
    setCols(newCols);
    setGrid(newGrid);
    
    // Update areas to remove cells outside new grid
    setAreas(areas.map(area => ({
      ...area,
      cells: area.cells.filter(c => c.row < newRows && c.col < newCols)
    })).filter(area => area.cells.length > 0));
  };

  const getCellArea = (row: number, col: number): GridArea | undefined => {
    return areas.find(area => 
      area.cells.some(c => c.row === row && c.col === col)
    );
  };

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
    const area = getCellArea(row, col);
    if (area) {
      setSelectedArea(area.name);
    } else {
      setSelectedArea(null);
    }
  };

  const assignAreaToCell = (row: number, col: number, areaName: string) => {
    // Remove cell from any existing area
    let updatedAreas = areas.map(area => ({
      ...area,
      cells: area.cells.filter(c => !(c.row === row && c.col === col))
    }));
    
    // Add cell to target area or create new area
    const targetAreaIndex = updatedAreas.findIndex(a => a.name === areaName);
    if (targetAreaIndex >= 0) {
      updatedAreas[targetAreaIndex].cells.push({ row, col });
    } else {
      // Create new area
      updatedAreas.push({
        name: areaName,
        color: AREA_COLORS[updatedAreas.length % AREA_COLORS.length],
        cells: [{ row, col }],
      });
    }
    
    // Update grid
    const newGrid = grid.map(r => r.map(c => 
      c.row === row && c.col === col 
        ? { ...c, areaName } 
        : c
    ));
    
    setGrid(newGrid);
    setAreas(updatedAreas.filter(a => a.cells.length > 0));
    setSelectedArea(areaName);
  };

  const clearCell = (row: number, col: number) => {
    const updatedAreas = areas.map(area => ({
      ...area,
      cells: area.cells.filter(c => !(c.row === row && c.col === col))
    })).filter(a => a.cells.length > 0);
    
    const newGrid = grid.map(r => r.map(c => 
      c.row === row && c.col === col 
        ? { ...c, areaName: '.' } 
        : c
    ));
    
    setGrid(newGrid);
    setAreas(updatedAreas);
    setSelectedArea(null);
  };

  const deleteArea = (areaName: string) => {
    const newGrid = grid.map(row => row.map(cell => ({
      ...cell,
      areaName: cell.areaName === areaName ? '.' : cell.areaName
    })));
    setGrid(newGrid);
    setAreas(areas.filter(a => a.name !== areaName));
    if (selectedArea === areaName) {
      setSelectedArea(null);
    }
  };

  const updateAreaContent = (areaName: string, content: GridAreaContent) => {
    setAreas(areas.map(a => a.name === areaName ? { ...a, content } : a));
  };

  const generateOutput = () => {
    // Generate grid-template-areas
    const templateRows: string[] = [];
    for (let r = 0; r < rows; r++) {
      const rowAreas = grid[r].map(cell => cell.areaName).join(' ');
      templateRows.push(`"${rowAreas}"`);
    }
    const templateAreas = templateRows.join(' ');
    
    // Generate columns and rows (equal sizing)
    const templateColumns = Array(cols).fill('1fr').join(' ');
    const templateRowsSizes = Array(rows).fill('1fr').join(' ');
    
    // Generate custom fields from entity areas
    const customFields = areas
      .filter(a => a.content?.type === 'entity' && a.content.entity)
      .map(area => ({
        name: area.name,
        type: 'entity' as const,
        value: '',
        entity: area.content!.entity,
        attribute: area.content!.attribute || '',
        icon: area.content!.icon || '',
        prefix: area.content!.prefix || '',
        suffix: area.content!.suffix || '',
        gridArea: area.name,
        styles: '',
      }));
    
    // Add custom template areas
    areas
      .filter(a => a.content?.type === 'custom' && a.content.customValue)
      .forEach(area => {
        customFields.push({
          name: area.name,
          type: 'template' as const,
          value: area.content!.customValue!,
          entity: '',
          attribute: '',
          icon: '',
          prefix: '',
          suffix: '',
          gridArea: area.name,
          styles: '',
        });
      });
    
    onUpdate(templateAreas, templateColumns, templateRowsSizes, customFields.length > 0 ? customFields : undefined);
  };

  // Predefined areas for quick assignment
  const predefinedAreas = [
    { name: 'i', label: 'Icon', icon: '🎨' },
    { name: 'n', label: 'Name', icon: '📝' },
    { name: 's', label: 'State', icon: '💡' },
    { name: 'l', label: 'Label', icon: '🏷️' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Grid3X3 className="text-blue-400" size={24} />
            <div>
              <h2 className="text-lg font-bold text-white">Grid Designer</h2>
              <p className="text-xs text-gray-400">Click cells to assign areas, then configure content</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="flex gap-6">
            {/* Left: Grid Size & Canvas */}
            <div className="flex-1">
              {/* Grid Size Controls */}
              <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase">Grid Size</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Columns:</span>
                      <div className="flex items-center gap-1 bg-gray-700 rounded px-2 py-1">
                        <button 
                          onClick={() => cols > 1 && resizeGrid(rows, cols - 1)} 
                          className="text-gray-400 hover:text-white disabled:opacity-50"
                          disabled={cols <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm text-white w-6 text-center font-mono">{cols}</span>
                        <button 
                          onClick={() => resizeGrid(rows, cols + 1)} 
                          className="text-gray-400 hover:text-white"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Rows:</span>
                      <div className="flex items-center gap-1 bg-gray-700 rounded px-2 py-1">
                        <button 
                          onClick={() => rows > 1 && resizeGrid(rows - 1, cols)} 
                          className="text-gray-400 hover:text-white disabled:opacity-50"
                          disabled={rows <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm text-white w-6 text-center font-mono">{rows}</span>
                        <button 
                          onClick={() => resizeGrid(rows + 1, cols)} 
                          className="text-gray-400 hover:text-white"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        initializeEmptyGrid(rows, cols);
                        setSelectedCell(null);
                        setSelectedArea(null);
                      }}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-red-600/30 hover:text-red-400 rounded text-xs text-gray-400 transition-colors"
                    >
                      <Trash2 size={12} />
                      Clear
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Grid Canvas */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div 
                  className="grid gap-2 mx-auto"
                  style={{ 
                    gridTemplateColumns: `repeat(${cols}, 70px)`,
                    gridTemplateRows: `repeat(${rows}, 70px)`,
                    width: 'fit-content',
                  }}
                >
                  {grid.map((row, rowIdx) => 
                    row.map((cell, colIdx) => {
                      const area = getCellArea(rowIdx, colIdx);
                      const isSelected = selectedCell?.row === rowIdx && selectedCell?.col === colIdx;
                      const contentIcon = area?.content?.type ? {
                        icon: '🎨',
                        name: '📝',
                        state: '💡',
                        label: '🏷️',
                        entity: '📊',
                        custom: '⚙️',
                      }[area.content.type] : null;
                      
                      return (
                        <button
                          key={`${rowIdx}-${colIdx}`}
                          onClick={() => handleCellClick(rowIdx, colIdx)}
                          className={`
                            relative rounded-lg cursor-pointer transition-all
                            flex flex-col items-center justify-center gap-1
                            ${area ? '' : 'bg-gray-700/50 hover:bg-gray-700 border-2 border-dashed border-gray-600'}
                            ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' : ''}
                          `}
                          style={{
                            backgroundColor: area ? `${area.color}30` : undefined,
                            borderColor: area ? area.color : undefined,
                            borderWidth: area ? '2px' : undefined,
                            borderStyle: area ? 'solid' : undefined,
                          }}
                        >
                          {area ? (
                            <>
                              {contentIcon && (
                                <span className="text-lg">{contentIcon}</span>
                              )}
                              <span 
                                className="text-xs font-bold"
                                style={{ color: area.color }}
                              >
                                {area.name}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-600 text-xs">empty</span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
              
              {/* Generated Template Preview */}
              <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Generated Template</p>
                <code className="text-xs text-blue-400 font-mono break-all">
                  {grid.length > 0 ? grid.map(row => `"${row.map(c => c.areaName).join(' ')}"`).join(' ') : '(empty)'}
                </code>
              </div>
            </div>
            
            {/* Right: Area Assignment & Configuration */}
            <div className="w-72 space-y-4">
              {/* Quick Area Assignment */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Assign to Cell</h3>
                {selectedCell ? (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500">
                      Selected: Row {selectedCell.row + 1}, Col {selectedCell.col + 1}
                    </p>
                    
                    {/* Predefined Areas */}
                    <div className="grid grid-cols-2 gap-2">
                      {predefinedAreas.map(area => (
                        <button
                          key={area.name}
                          onClick={() => assignAreaToCell(selectedCell.row, selectedCell.col, area.name)}
                          className={`flex items-center gap-2 p-2 rounded border transition-colors ${
                            grid[selectedCell.row]?.[selectedCell.col]?.areaName === area.name
                              ? 'bg-blue-600/30 border-blue-500'
                              : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <span>{area.icon}</span>
                          <span className="text-xs text-white">{area.label}</span>
                        </button>
                      ))}
                    </div>
                    
                    {/* Custom Fields */}
                    {areas.filter(a => !predefinedAreas.find(p => p.name === a.name)).length > 0 && (
                      <div className="pt-2 border-t border-gray-700">
                        <p className="text-[10px] text-gray-500 mb-2">Custom Fields:</p>
                        <div className="flex flex-wrap gap-1">
                          {areas.filter(a => !predefinedAreas.find(p => p.name === a.name)).map(area => (
                            <button
                              key={area.name}
                              onClick={() => assignAreaToCell(selectedCell.row, selectedCell.col, area.name)}
                              className={`px-2 py-1 rounded text-xs border transition-colors ${
                                grid[selectedCell.row]?.[selectedCell.col]?.areaName === area.name
                                  ? 'bg-blue-600/30 border-blue-500 text-white'
                                  : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-gray-500'
                              }`}
                              style={{ borderColor: area.color }}
                            >
                              {area.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Add Custom Field */}
                    <div className="pt-2 border-t border-gray-700">
                      <button
                        onClick={() => {
                          const name = `field${areas.filter(a => a.name.startsWith('field')).length + 1}`;
                          assignAreaToCell(selectedCell.row, selectedCell.col, name);
                        }}
                        className="w-full flex items-center justify-center gap-1 px-2 py-2 bg-blue-600 hover:bg-blue-500 rounded text-xs text-white"
                      >
                        <Plus size={14} />
                        New Custom Field
                      </button>
                    </div>
                    
                    {/* Clear Cell */}
                    {grid[selectedCell.row]?.[selectedCell.col]?.areaName !== '.' && (
                      <button
                        onClick={() => clearCell(selectedCell.row, selectedCell.col)}
                        className="w-full flex items-center justify-center gap-1 px-2 py-2 bg-gray-700 hover:bg-red-600/30 hover:text-red-400 rounded text-xs text-gray-400"
                      >
                        <Trash2 size={14} />
                        Clear Cell
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic text-center py-4">
                    Click a cell to assign an area
                  </p>
                )}
              </div>
              
              {/* Area Content Configuration */}
              {selectedArea && areas.find(a => a.name === selectedArea) && !predefinedAreas.find(p => p.name === selectedArea) && (
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase">
                      Configure: {selectedArea}
                    </h3>
                    <button
                      onClick={() => deleteArea(selectedArea)}
                      className="text-gray-500 hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1.5">Content Type</label>
                      <select
                        value={areas.find(a => a.name === selectedArea)?.content?.type || ''}
                        onChange={(e) => {
                          const type = e.target.value as GridAreaContent['type'];
                          if (type) {
                            updateAreaContent(selectedArea, { type });
                          }
                        }}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-xs text-white"
                      >
                        <option value="">Select content...</option>
                        <option value="entity">📊 Entity Value</option>
                        <option value="custom">⚙️ Custom Template</option>
                      </select>
                    </div>
                    
                    {(() => {
                      const area = areas.find(a => a.name === selectedArea);
                      if (!area?.content) return null;
                      
                      if (area.content.type === 'entity') {
                        return (
                          <div className="space-y-2">
                            <EntitySelector
                              label="Entity"
                              value={area.content.entity || ''}
                              onChange={(v) => updateAreaContent(selectedArea, { ...area.content!, entity: v })}
                              allowAll={true}
                            />
                            <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Attribute</label>
                              <input
                                type="text"
                                value={area.content.attribute || ''}
                                onChange={(e) => updateAreaContent(selectedArea, { ...area.content!, attribute: e.target.value })}
                                placeholder="Leave empty for state"
                                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Prefix</label>
                                <input
                                  type="text"
                                  value={area.content.prefix || ''}
                                  onChange={(e) => updateAreaContent(selectedArea, { ...area.content!, prefix: e.target.value })}
                                  placeholder="CPU: "
                                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-xs text-white"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Suffix</label>
                                <input
                                  type="text"
                                  value={area.content.suffix || ''}
                                  onChange={(e) => updateAreaContent(selectedArea, { ...area.content!, suffix: e.target.value })}
                                  placeholder="%"
                                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-xs text-white"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Icon</label>
                              <input
                                type="text"
                                value={area.content.icon || ''}
                                onChange={(e) => updateAreaContent(selectedArea, { ...area.content!, icon: e.target.value })}
                                placeholder="mdi:thermometer"
                                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-xs text-white"
                              />
                            </div>
                          </div>
                        );
                      }
                      
                      if (area.content.type === 'custom') {
                        return (
                          <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Template</label>
                            <textarea
                              value={area.content.customValue || ''}
                              onChange={(e) => updateAreaContent(selectedArea, { ...area.content!, customValue: e.target.value })}
                              placeholder="[[[ return entity.state ]]]"
                              className="w-full h-20 bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-xs text-white font-mono resize-none"
                            />
                          </div>
                        );
                      }
                      
                      return null;
                    })()}
                  </div>
                </div>
              )}
              
              {/* Legend */}
              <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Standard Areas</h3>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500">
                  <div className="flex items-center gap-1.5"><span>🎨</span> <code className="text-blue-400">i</code> = Icon</div>
                  <div className="flex items-center gap-1.5"><span>📝</span> <code className="text-blue-400">n</code> = Name</div>
                  <div className="flex items-center gap-1.5"><span>💡</span> <code className="text-blue-400">s</code> = State</div>
                  <div className="flex items-center gap-1.5"><span>🏷️</span> <code className="text-blue-400">l</code> = Label</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-700 bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              generateOutput();
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm text-white font-medium"
          >
            <Check size={16} />
            Apply Grid Layout
          </button>
        </div>
      </div>
    </div>
  );
};
