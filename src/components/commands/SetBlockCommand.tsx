import React, { useState, useEffect } from 'react';
import { generateSetBlockCommand } from '../../utils/commandGenerators';
import PositionInput from '../PositionInput';
import { Position } from '../../types/commandTypes';
import { commonItems, blockStates } from '../../data/commandOptions';

interface SetBlockCommandProps {
  onCommandChange: (command: string) => void;
}

const SetBlockCommand: React.FC<SetBlockCommandProps> = ({ onCommandChange }) => {
  const [position, setPosition] = useState<Position>({ x: '~', y: '~', z: '~' });
  const [block, setBlock] = useState(commonItems[0]);
  const [state, setState] = useState('replace');
  const [nbt, setNbt] = useState('');
  const [customBlock, setCustomBlock] = useState('');
  const [isCustomBlock, setIsCustomBlock] = useState(false);

  useEffect(() => {
    const selectedBlock = isCustomBlock ? customBlock : block;
    if (selectedBlock) {
      const command = generateSetBlockCommand(position, selectedBlock, state, nbt);
      onCommandChange(command);
    }
  }, [position, block, customBlock, isCustomBlock, state, nbt, onCommandChange]);

  return (
    <div className="space-y-4">
      <PositionInput 
        position={position}
        onChange={setPosition}
        label="Position"
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
                {commonItems.map((i) => (
                  <option key={i} value={i}>
                    {i.replace('minecraft:', '')}
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
          Block State
        </label>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
        >
          {blockStates.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          NBT Data (optional)
        </label>
        <textarea
          value={nbt}
          onChange={(e) => setNbt(e.target.value)}
          placeholder="{CustomColor:16711680}"
          className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500 font-mono text-sm h-20"
        />
      </div>
    </div>
  );
};

export default SetBlockCommand;