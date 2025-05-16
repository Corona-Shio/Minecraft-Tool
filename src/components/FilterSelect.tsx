import React, { useState, useEffect, useMemo } from 'react';

interface Item {
  id: string;
  name: string;
}

interface FilterSelectProps {
  items: Item[];
  selectedItemId: string;
  onItemSelected: (itemId: string) => void;
  searchPlaceholder?: string;
  label?: string;
  itemDisplayFormatter?: (item: Item) => string; // オプション: ドロップダウンの表示形式をカスタマイズ
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  items,
  selectedItemId,
  onItemSelected,
  searchPlaceholder = "Filter",
  label,
  itemDisplayFormatter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    if (!searchQuery) {
      return items;
    }
    return items
      .filter(item => {
        return item.name.toLowerCase().includes(searchLower) ||
               item.id.toLowerCase().includes(searchLower);
      })
      .sort((a, b) => { // GiveCommand にあったソートロジックをデフォルトとして採用
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aId = a.id.toLowerCase();
        const bId = b.id.toLowerCase();

        const aStartsWith = aName.startsWith(searchLower) || aId.startsWith(searchLower);
        const bStartsWith = bName.startsWith(searchLower) || bId.startsWith(searchLower);

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        // 元のリストにおけるインデックスでソートする (安定ソートのため)
        const originalIndexA = items.findIndex(item => item.id === a.id);
        const originalIndexB = items.findIndex(item => item.id === b.id);
        return originalIndexA - originalIndexB;
      });
  }, [searchQuery, items]);

  // フィルタリング結果が変わり、現在の選択肢が含まれていない場合、
  // または初期選択肢がない場合に、リストの最初のアイテムを選択する
  useEffect(() => {
    if (filteredItems.length > 0) {
      const currentSelectionExists = filteredItems.some(item => item.id === selectedItemId);
      if (!currentSelectionExists || !selectedItemId) {
        onItemSelected(filteredItems[0].id);
      }
    } else if (selectedItemId && items.length > 0) {
        // フィルターによって何も見つからなくなったが、何か選択されていた場合
        // (必要であれば、ここで選択をクリアする onItemSelected('') のような処理も検討可能)
    }
  }, [filteredItems, selectedItemId, onItemSelected, items]);


  const displayFormat = (item: Item): string => {
    if (itemDisplayFormatter) {
      return itemDisplayFormatter(item);
    }
    return `${item.name} (${item.id.replace('minecraft:', '')})`;
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-stone-300">
          {label}
        </label>
      )}
      <div className="flex gap-2 w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-32 px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <select
            value={selectedItemId}
            onChange={(e) => onItemSelected(e.target.value)}
            className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500 truncate min-h-[42px]"
            disabled={filteredItems.length === 0 && !searchQuery} // 検索前でアイテムがない場合は非活性
          >
            {filteredItems.length === 0 && searchQuery && (
              <option value="" disabled>No items found</option>
            )}
            {filteredItems.map((item) => (
              <option key={item.id} value={item.id} className="truncate">
                {displayFormat(item)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSelect;