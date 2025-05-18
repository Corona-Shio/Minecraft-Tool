import React, { useState, useEffect } from 'react';
import { generateGiveCommand } from '../../utils/commandGenerators';
import SelectorInput from '../SelectorInput';
import FilterSelect from '../FilterSelect';
import FetchAppSheet from '../../api/FetchAppSheet';

interface GiveCommandProps {
  onCommandChange: (command: string) => void;
}

const GiveCommand: React.FC<GiveCommandProps> = ({ onCommandChange }) => {
  const [commonItems, setCommonItems] = useState<{ id: string; name: string }[]>([]);
  const [target, setTarget] = useState('@p');
  const [item, setItem] = useState('');
  const [count, setCount] = useState(1);
  const [nbt, setNbt] = useState('');

  useEffect(() => {
    // データを非同期で取得
    FetchAppSheet("Items")
      .then((data) => {
        const filteredRows = data.map((row: any) => ({
          id: row.id,
          name: row.name,
        }));
        setCommonItems(filteredRows)
        setItem(filteredRows[0].id)
      })
      .catch((error) => {
        console.error("データの取得に失敗しました:", error);
      });
  }, []);

  useEffect(() => {
    const selectedItem = item;
    if (!selectedItem) {
      onCommandChange('');
      return;
    }

    const command = generateGiveCommand(target, selectedItem, count, nbt);
    onCommandChange(command);
  }, [target, item, count, nbt, onCommandChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Target
        </label>
        <SelectorInput value={target} onChange={setTarget} />
      </div>

      <FilterSelect
        items={commonItems}
        selectedItemId={item}
        onItemSelected={setItem}
        label="Item"
        searchPlaceholder="Filter items"
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Count
        </label>
        <input
          type="number"
          min="1"
          value={count}
          onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))} // 0以下にならないように
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