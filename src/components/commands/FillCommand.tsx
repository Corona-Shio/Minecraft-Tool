import React, { useState, useEffect } from 'react';
import { generateFillCommand } from '../../utils/commandGenerators';
import PositionInput from '../PositionInput';
import { Position } from '../../types/commandTypes';
import { commonItems } from '../../data/commandOptions';

interface FillCommandProps {
  onCommandChange: (command: string) => void;
}

const FillCommand: React.FC<FillCommandProps> = ({ onCommandChange }) => {
  const [from, setFrom] = useState<Position>({ x: '~', y: '~', z: '~' });
  const [to, setTo] = useState<Position>({ x: '~10', y: '~10', z: '~10' });
  const [block, setBlock] = useState(commonItems[0].id);
  const [mode, setMode] = useState('replace');
  const [filter, setFilter] = useState('');
  const [customBlock, setCustomBlock] = useState('');
  const [isCustomBlock, setIsCustomBlock] = useState(false);
  const [customFilter, setCustomFilter] = useState('');
  const [isCustomFilter, setIsCustomFilter] = useState(false);

  useEffect(() => {
    const selectedBlock = isCustomBlock ? customBlock : block;
    const selectedFilter = isCustomFilter ? customFilter : filter;
    
    if (selectedBlock) {
      const command = generateFillCommand(from, to, selectedBlock, mode, selectedFilter);
      onCommandChange(command);
    }
  }, [from, to, block, customBlock, isCustomBlock, mode, filter, customFilter, isCustomFilter, onCommandChange]);

  return (
    <div className="space-y-4">
      <PositionInput 
        position={from}
        onChange={setFrom}
        label="From Position"
      />

      <PositionInput 
        position={to}
        onChange={setTo}
        label="To Position"
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Block
        </label>
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            {isCustomBlock ? (
              <input
                type="text"
                value={customBlock}
                onChange={(e) => setCustomBlock(e.target.value)}
                placeholder="minecraft:block_id"
                className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
              />
            ) : (
              <select
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
              >
                {commonItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsCustomBlock(!isCustomBlock)}
            className="px-3 py-2 bg-stone-600 hover:bg-stone-500 text-white rounded border border-stone-500 transition-colors whitespace-nowrap"
          >
            {isCustomBlock ? 'Common Blocks' : 'Custom Block'}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Fill Mode
        </label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
        >
          <option value="replace">replace</option>
          <option value="destroy">destroy</option>
          <option value="keep">keep</option>
          <option value="hollow">hollow</option>
          <option value="outline">outline</option>
        </select>
      </div>

      {mode === 'replace' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-300">
            Filter Block (optional, only for replace mode)
          </label>
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              {isCustomFilter ? (
                <input
                  type="text"
                  value={customFilter}
                  onChange={(e) => setCustomFilter(e.target.value)}
                  placeholder="minecraft:block_id"
                  className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
                />
              ) : (
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
                >
                  <option value="">No filter</option>
                  {commonItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsCustomFilter(!isCustomFilter)}
              className="px-3 py-2 bg-stone-600 hover:bg-stone-500 text-white rounded border border-stone-500 transition-colors whitespace-nowrap"
            >
              {isCustomFilter ? 'Common Blocks' : 'Custom Block'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FillCommand;