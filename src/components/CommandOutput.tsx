import React, { useState } from 'react';

interface CommandOutputProps {
  command: string;
  onSave?: (command: string) => void;
}

const CommandOutput: React.FC<CommandOutputProps> = ({ command, onSave }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-minecraft text-stone-200">Generated Command</h3>
        <div className="flex space-x-2">
          {onSave && (
            <button
              onClick={() => onSave(command)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
            >
              Save
            </button>
          )}
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="relative">
        <pre className="p-4 bg-stone-900 text-emerald-400 font-mono rounded-md border-2 border-stone-700 overflow-x-auto whitespace-pre-wrap">
          {command || '<Command will appear here>'}
        </pre>
        {command && (
          <div className="absolute top-0 left-0 bg-stone-800 text-xs text-stone-300 px-2 py-1 rounded-br-md">
            Forge 1.19.2
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandOutput;