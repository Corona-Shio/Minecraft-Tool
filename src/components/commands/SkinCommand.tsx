import React, { useState, useEffect } from 'react';
import { characterList, SKIN_IP_ADDRESS } from '../../data/commandOptions';

interface SkinCommandProps {
  onCommandChange: (command: string) => void;
}

const SkinCommand: React.FC<SkinCommandProps> = ({ onCommandChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    onCommandChange("/skin clear");
  }, [onCommandChange]);

  const filteredCharacters = characterList.filter(char => {
    const searchLower = searchQuery.toLowerCase();
    return char.name.toLowerCase().includes(searchLower) || 
           char.id.toLowerCase().includes(searchLower);
  });

  const handleCopy = (charId: string) => {
    // const command = `/skin set http://${SKIN_IP_ADDRESS}/${charId}.png`;
    const command = `/skin set http://example.com/${charId}.png`;
    navigator.clipboard.writeText(command);
    setCopiedId(charId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          Search Character
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search character..."
          className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCharacters.map((char) => (
          <div
            key={char.id}
            className="p-4 bg-stone-700 rounded-lg border border-stone-600 hover:border-emerald-500 cursor-pointer transition-colors"
            onClick={() => handleCopy(char.id)}
          >
            <div className="text-white font-medium">{char.name}</div>
            <div className="text-stone-400 text-sm">{char.id}</div>
            {copiedId === char.id && (
              <div className="text-emerald-400 text-sm mt-2">コピーしました！</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkinCommand; 