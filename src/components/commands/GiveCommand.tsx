import React, { useState, useEffect } from 'react';
import { generateGiveCommand } from '../../utils/commandGenerators';
import SelectorInput from '../SelectorInput';
import { commonItems } from '../../data/commandOptions';

interface GiveCommandProps {
  onCommandChange: (command: string) => void;
}

const GiveCommand: React.FC<GiveCommandProps> = ({ onCommandChange }) => {
  const [target, setTarget] = useState('@p');
  const [item, setItem] = useState(commonItems[0]);
  const [count, setCount] = useState(1);
  const [nbt, setNbt] = useState('');
  const [customItem, setCustomItem] = useState('');
  const [isCustomItem, setIsCustomItem] = useState(false);

  useEffect(() => {
    const selectedItem = isCustomItem ? customItem : item;
    if (selectedItem) {
      const command = generateGiveCommand(target, selectedItem, count, nbt);
      onCommandChange(command);
    }
  }, [target, item, customItem, isCustomItem, count, nbt, onCommandChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Target
        </label>
        <SelectorInput value={target} onChange={setTarget} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Item
        </label>
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            {isCustomItem ? (
              <input
                type="text"
                value={customItem}
                onChange={(e) => setCustomItem(e.target.value)}
                placeholder="minecraft:item_id"
                className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
              />
            ) : (
              <select
                value={item}
                onChange={(e) => setItem(e.target.value)}
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
            onClick={() => setIsCustomItem(!isCustomItem)}
            className="px-3 py-2 bg-stone-600 hover:bg-stone-500 text-white rounded border border-stone-500 transition-colors whitespace-nowrap"
          >
            {isCustomItem ? 'Common Items' : 'Custom Item'}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Count
        </label>
        <input
          type="number"
          min="1"
          max="64"
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value) || 1)}
          className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          NBT Data (optional)
        </label>
        <textarea
          value={nbt}
          onChange={(e) => setNbt(e.target.value)}
          placeholder='{Enchantments:[{id:"minecraft:sharpness",lvl:5}]}'
          className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500 font-mono text-sm h-20"
        />
      </div>
    </div>
  );
};

export default GiveCommand;