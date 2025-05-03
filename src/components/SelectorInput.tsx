import React, { useState } from 'react';
import { SelectorOptions } from '../types/commandTypes';
import { selectorTypes, entityTypes } from '../data/commandOptions';

interface SelectorInputProps {
  value: string;
  onChange: (value: string) => void;
  showOptions?: boolean;
  defaultSelector?: string;
}

const SelectorInput: React.FC<SelectorInputProps> = ({
  value,
  onChange,
  showOptions = true,
  defaultSelector = '@p'
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selector, setSelector] = useState(defaultSelector);
  const [options, setOptions] = useState<SelectorOptions>({});

  const handleSelectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelector = e.target.value;
    setSelector(newSelector);
    updateSelectorValue(newSelector, options);
  };

  const handleOptionChange = (key: keyof SelectorOptions, value: any) => {
    const newOptions = { ...options, [key]: value };
    
    // If value is empty, remove the key
    if (value === '' || value === undefined) {
      delete newOptions[key];
    }
    
    setOptions(newOptions);
    updateSelectorValue(selector, newOptions);
  };

  const updateSelectorValue = (sel: string, opts: SelectorOptions) => {
    if (Object.keys(opts).length === 0) {
      onChange(sel);
      return;
    }

    const formattedOptions = Object.entries(opts)
      .filter(([_, value]) => value !== undefined && value !== '')
      .map(([key, value]) => `${key}=${value}`)
      .join(',');

    onChange(`${sel}[${formattedOptions}]`);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <select
          value={selector}
          onChange={handleSelectorChange}
          className="px-3 py-2 bg-stone-800 text-white rounded border border-stone-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        >
          {selectorTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {showOptions && (
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-3 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded border border-stone-600 transition-colors"
          >
            {showAdvanced ? 'Hide Options' : 'Show Options'}
          </button>
        )}
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-stone-800 rounded border border-stone-700 animate-fadeIn">
          <div className="space-y-1">
            <label className="text-xs text-stone-300 font-medium">Type</label>
            <select
              value={options.type || ''}
              onChange={(e) => handleOptionChange('type', e.target.value)}
              className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
            >
              <option value="">Any</option>
              {entityTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
                    
          <div className="space-y-1">
            <label className="text-xs text-stone-300 font-medium">Tag</label>
            <input
              type="text"
              value={options.tag || ''}
              onChange={(e) => handleOptionChange('tag', e.target.value)}
              placeholder="Entity tag"
              className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
            />
          </div>
                    
          <div className="space-y-1">
            <label className="text-xs text-stone-300 font-medium">Sort</label>
            <select
              value={options.sort || ''}
              onChange={(e) => handleOptionChange('sort', e.target.value)}
              className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
            >
              <option value="">Default</option>
              <option value="nearest">Nearest</option>
              <option value="furthest">Furthest</option>
              <option value="random">Random</option>
              <option value="arbitrary">Arbitrary</option>
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-stone-300 font-medium">Limit</label>
            <input
              type="number"
              min="1"
              value={options.limit || ''}
              onChange={(e) => handleOptionChange('limit', e.target.value ? parseInt(e.target.value) : '')}
              placeholder="Max entities"
              className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-stone-300 font-medium">Distance</label>
            <input
              type="text"
              value={options.distance || ''}
              onChange={(e) => handleOptionChange('distance', e.target.value)}
              placeholder="e.g. ..10 or 3..5"
              className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-stone-300 font-medium">Name</label>
            <input
              type="text"
              value={options.name || ''}
              onChange={(e) => handleOptionChange('name', e.target.value)}
              placeholder="Entity name"
              className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
            />
          </div>

        </div>
      )}
    </div>
  );
};

export default SelectorInput;