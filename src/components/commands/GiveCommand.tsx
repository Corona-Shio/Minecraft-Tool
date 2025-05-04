import React, { useState, useEffect, useMemo } from 'react';
import { generateGiveCommand } from '../../utils/commandGenerators';
import SelectorInput from '../SelectorInput';
import { commonItems } from '../../data/commandOptions';

interface GiveCommandProps {
  onCommandChange: (command: string) => void;
}

const GiveCommand: React.FC<GiveCommandProps> = ({ onCommandChange }) => {
  const [target, setTarget] = useState('@p');
  const [item, setItem] = useState(commonItems[0].id);
  const [count, setCount] = useState(1);
  const [nbt, setNbt] = useState('');
  const [customItem, setCustomItem] = useState('');
  const [isCustomItem, setIsCustomItem] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return commonItems
      .filter(item => {
        return item.name.toLowerCase().includes(searchLower) || 
               item.id.toLowerCase().includes(searchLower);
      })
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aId = a.id.toLowerCase();
        const bId = b.id.toLowerCase();

        // 前方一致を優先
        const aStartsWith = aName.startsWith(searchLower) || aId.startsWith(searchLower);
        const bStartsWith = bName.startsWith(searchLower) || bId.startsWith(searchLower);

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        // 前方一致以外は元の順序を維持
        return commonItems.indexOf(a) - commonItems.indexOf(b);
      });
  }, [searchTerm]);

  useEffect(() => {
    const selectedItem = isCustomItem ? customItem : item;
    if (!selectedItem) return;
    
    const command = generateGiveCommand(target, selectedItem, count, nbt);
    onCommandChange(command);
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
          <div className="flex-1 space-y-2">
            {isCustomItem ? (
              <input
                type="text"
                value={customItem}
                onChange={(e) => setCustomItem(e.target.value)}
                placeholder="minecraft:item_id"
                className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
              />
            ) : (
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter"
                  className="w-32 px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <select
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500 truncate min-h-[42px]"
                  >
                    {filteredItems.map((item) => (
                      <option key={item.id} value={item.id} className="truncate">
                        {item.name} ({item.id.replace('minecraft:', '')})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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