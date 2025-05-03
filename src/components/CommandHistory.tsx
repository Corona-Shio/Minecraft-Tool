import React from 'react';
import { CommandHistory as CommandHistoryType } from '../types/commandTypes';

interface CommandHistoryProps {
  history: CommandHistoryType[];
  onSelect: (command: string) => void;
  onClear: () => void;
}

const CommandHistory: React.FC<CommandHistoryProps> = ({
  history,
  onSelect,
  onClear
}) => {
  if (history.length === 0) {
    return (
      <div className="mt-6 p-4 bg-stone-800 rounded-md border border-stone-700">
        <p className="text-stone-400 text-center">No command history yet</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-minecraft text-stone-200">Command History</h3>
        <button
          onClick={onClear}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="bg-stone-800 rounded-md border border-stone-700 divide-y divide-stone-700 max-h-60 overflow-y-auto">
        {history.map((item) => (
          <div
            key={item.id}
            className="p-3 hover:bg-stone-700 cursor-pointer transition-colors"
            onClick={() => onSelect(item.command)}
          >
            <div className="flex justify-between">
              <span className="font-mono text-sm text-emerald-400 truncate">
                {item.command}
              </span>
              <span className="text-xs text-stone-400 ml-2 whitespace-nowrap">
                {new Date(item.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommandHistory;