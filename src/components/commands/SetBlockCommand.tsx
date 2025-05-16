import React, { useState, useEffect } from 'react';
import { generateSetBlockCommand } from '../../utils/commandGenerators';
import PositionInput from '../PositionInput';
import FilterSelect from '../FilterSelect';
import { Position } from '../../types/commandTypes';
import { commonItems, blockStates } from '../../data/commandOptions';

interface BlockItem {
  id: string;
  name: string;
}

interface SetBlockCommandProps {
  onCommandChange: (command: string) => void;
}

const SetBlockCommand: React.FC<SetBlockCommandProps> = ({ onCommandChange }) => {
  const [position, setPosition] = useState<Position>({ x: '~', y: '~', z: '~' });
  const [block, setBlock] = useState<BlockItem | undefined>(commonItems[0]);
  const [state, setState] = useState(blockStates[0]);
  const [nbt, setNbt] = useState('');
  const [customBlock, setCustomBlock] = useState('');
  const [isCustomBlock, setIsCustomBlock] = useState(false);

  useEffect(() => {
    const selectedBlockId = isCustomBlock ? customBlock : block?.id; // blockがundefinedの可能性を考慮
    if (selectedBlockId) { // selectedBlockIdが空でないことを確認
      const command = generateSetBlockCommand(position, selectedBlockId, state, nbt);
      onCommandChange(command);
    } else {
      onCommandChange(''); // 有効なブロックがない場合は空コマンド
    }
  }, [position, block, customBlock, isCustomBlock, state, nbt, onCommandChange]);

  const handleBlockSelected = (selectedId: string) => {
    const selectedItem = commonItems.find(item => item.id === selectedId);
    if (selectedItem) {
      setBlock(selectedItem);
    }
  };

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
              // FilterSelect を使用
              <FilterSelect
                items={commonItems}
                // blockが未定義の場合も考慮して selectedItemId を渡す
                selectedItemId={block?.id || (commonItems.length > 0 ? commonItems[0].id : '')}
                onItemSelected={handleBlockSelected}
                searchPlaceholder="Filter blocks"
                // FilterSelectにラベルは不要なため、ここでは設定しない
                // itemDisplayFormatter を使用して name のみ表示 (id は表示しない)
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
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Handling (Old Block)
        </label>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
          disabled={blockStates.length === 0} // blockStatesが空なら非活性
        >
          {blockStates.length === 0 && <option value="">No states available</option>}
          {blockStates.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)} {/* 見た目を改善: destroy -> Destroy */}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          BlockState / NBT Data (optional)
        </label>
        <textarea
          value={nbt}
          onChange={(e) => setNbt(e.target.value)}
          placeholder='[facing=north,half=top] or {Items:[{Slot:0b,id:"minecraft:diamond",Count:1b}]}'
          className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500 font-mono text-sm h-20"
        />
        <p className="text-xs text-stone-400">
          For block states, use format like <code>[state1=value1,state2=value2]</code>.
          For NBT, use <code>{'{...}'}</code>. Combine by placing block states first, then NBT.
          Not all blocks support states or NBT.
        </p>
      </div>
    </div>
  );
};

export default SetBlockCommand;