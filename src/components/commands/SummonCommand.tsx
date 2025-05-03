import React, { useState, useEffect } from 'react';
import { generateSummonCommand } from '../../utils/commandGenerators';
import PositionInput from '../PositionInput';
import { entityTypes } from '../../data/commandOptions';
import { Position } from '../../types/commandTypes';

interface SummonCommandProps {
  onCommandChange: (command: string) => void;
}

const SummonCommand: React.FC<SummonCommandProps> = ({ onCommandChange }) => {
  const [entity, setEntity] = useState(entityTypes[0]);
  const [position, setPosition] = useState<Position>({ x: '~', y: '~', z: '~' });
  const [nbt, setNbt] = useState('');
  const [customEntity, setCustomEntity] = useState('');
  const [isCustomEntity, setIsCustomEntity] = useState(false);

  useEffect(() => {
    const selectedEntity = isCustomEntity ? customEntity : entity;
    if (selectedEntity) {
      const command = generateSummonCommand(selectedEntity, position, nbt);
      onCommandChange(command);
    }
  }, [entity, customEntity, isCustomEntity, position, nbt, onCommandChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Entity
        </label>
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            {isCustomEntity ? (
              <input
                type="text"
                value={customEntity}
                onChange={(e) => setCustomEntity(e.target.value)}
                placeholder="minecraft:entity_id"
                className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
              />
            ) : (
              <select
                value={entity}
                onChange={(e) => setEntity(e.target.value)}
                className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
              >
                {entityTypes.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsCustomEntity(!isCustomEntity)}
            className="px-3 py-2 bg-stone-600 hover:bg-stone-500 text-white rounded border border-stone-500 transition-colors whitespace-nowrap"
          >
            {isCustomEntity ? 'Common Entities' : 'Custom Entity'}
          </button>
        </div>
      </div>

      <PositionInput 
        position={position}
        onChange={setPosition}
        label="Position (Use ~ for relative coordinates)"
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          NBT Data (optional)
        </label>
        <textarea
          value={nbt}
          onChange={(e) => setNbt(e.target.value)}
          placeholder='{NoAI:1b,Invulnerable:1b,CustomName:"\"Custom Name\""}'
          className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500 font-mono text-sm h-20"
        />
      </div>
    </div>
  );
};

export default SummonCommand;