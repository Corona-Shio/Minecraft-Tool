import React, { useState, useEffect, useMemo } from 'react';
import { generateFillCommand } from '../../utils/commandGenerators';
import PositionInput from '../PositionInput';
import FilterSelect from '../FilterSelect';
import { Position } from '../../types/commandTypes';
import { commonItems as defaultCommonItems } from '../../data/commandOptions'; // エイリアスでインポート

interface BlockItem {
  id: string;
  name: string;
}

interface FillCommandProps {
  onCommandChange: (command: string) => void;
}

const defaultBlockId = defaultCommonItems[0].id;

const FillCommand: React.FC<FillCommandProps> = ({ onCommandChange }) => {
  const [from, setFrom] = useState<Position>({ x: '~', y: '~', z: '~' });
  const [to, setTo] = useState<Position>({ x: '~10', y: '~10', z: '~10' });
  // block state は選択されたブロックのID文字列を保持する
  const [block, setBlock] = useState<string>(defaultBlockId);
  const [mode, setMode] = useState('replace');
  // filter state は選択されたフィルターブロックのID文字列を保持する (空文字はフィルターなし)
  const [filter, setFilter] = useState<string>('');
  const [customBlock, setCustomBlock] = useState('');
  const [isCustomBlock, setIsCustomBlock] = useState(false);
  const [customFilter, setCustomFilter] = useState('');
  const [isCustomFilter, setIsCustomFilter] = useState(false);

  // フィルターブロック選択用のアイテムリスト (「フィルターなし」オプションを追加)
  const filterableItemsForFilterBlock: BlockItem[] = useMemo(() => {
    return [{ id: '', name: 'No filter (or select a block)' }, ...defaultCommonItems];  
  }, []);


  useEffect(() => {
    const selectedBlockId = isCustomBlock ? customBlock : block;
    // modeがreplaceでない場合、またはfilterが空文字の場合は、selectedFilterIdはundefinedとしてコマンド生成関数に渡す
    const selectedFilterId = mode === 'replace'
      ? (isCustomFilter ? customFilter : (filter === '' ? undefined : filter))
      : undefined;

    if (selectedBlockId) { // selectedBlockIdが空でないことを確認
      const command = generateFillCommand(from, to, selectedBlockId, mode, selectedFilterId);
      onCommandChange(command);
    } else {
      onCommandChange(''); // 有効なブロックがない場合は空コマンド
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
                placeholder="minecraft:block_id[state=value]"
                className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
              />
            ) : (
              <FilterSelect
                items={defaultCommonItems}
                selectedItemId={block}
                onItemSelected={setBlock}
                searchPlaceholder="Filter blocks"
                itemDisplayFormatter={(item) => item.name}
              />
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsCustomBlock(!isCustomBlock)}
            className="px-3 py-2 bg-stone-600 hover:bg-stone-500 text-white rounded border border-stone-500 transition-colors whitespace-nowrap min-h-[42px]"
          >
            {isCustomBlock ? 'Common Blocks' : 'Custom Block'}
          </button>
        </div>
        {isCustomBlock && (
             <p className="text-xs text-stone-400">
                You can include block states like <code>minecraft:oak_stairs[facing=east,half=bottom]</code>.
            </p>
        )}
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
                <FilterSelect
                  items={filterableItemsForFilterBlock}
                  selectedItemId={filter}
                  onItemSelected={setFilter}
                  searchPlaceholder="Filter blocks"
                  itemDisplayFormatter={(item) => item.name}
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsCustomFilter(!isCustomFilter)}
              className="px-3 py-2 bg-stone-600 hover:bg-stone-500 text-white rounded border border-stone-500 transition-colors whitespace-nowrap min-h-[42px]"
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