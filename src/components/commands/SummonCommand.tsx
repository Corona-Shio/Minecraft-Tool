import React, { useState, useEffect, useMemo } from "react";
import { generateSummonCommand } from "../../utils/commandGenerators";
import PositionInput from "../PositionInput";
import { entityTypes } from "../../data/commandOptions";
import { Position } from "../../types/commandTypes";

interface SummonCommandProps {
  onCommandChange: (command: string) => void;
}

// --- NBT Manipulation Utilities ---
// (These could be moved to a separate utils file if preferred)

/**
 * Parses the content of an NBT object (string between '{' and '}')
 * into a Map of key-value strings. This is a simplified parser and assumes
 * top-level key-value pairs. Values themselves can be complex (nested objects,
 * arrays, strings with commas) and are treated as opaque strings.
 */
function parseNbtContent(content: string): Map<string, string> {
  const nbtMap = new Map<string, string>();
  let cursor = 0;
  const len = content.length;

  while (cursor < len) {
    // Skip whitespace and comma before key
    while (cursor < len && (/\s/.test(content[cursor]) || content[cursor] === ',')) {
      cursor++;
    }
    if (cursor >= len) break;

    // Parse key
    let keyStart = cursor;
    while (cursor < len && content[cursor] !== ':') {
      cursor++;
    }
    if (cursor >= len) break; // Malformed NBT (e.g., "{key}")
    const key = content.substring(keyStart, cursor).trim();
    cursor++; // Skip ':'

    // Skip whitespace before value
    while (cursor < len && /\s/.test(content[cursor])) {
      cursor++;
    }
    if (cursor >= len && key) { // Malformed NBT (e.g., "{key:}") - treat as empty value for this key
        nbtMap.set(key, "");
        break;
    }
    if (cursor >=len) break;


    // Parse value
    let valueStart = cursor;
    let balance = 0; // To handle nested {} and []
    let inString = false;

    const valueEndSearchStart = cursor;
    while (cursor < len) {
      const char = content[cursor];
      if (inString) {
        if (char === '"' && (cursor === valueEndSearchStart || content[cursor - 1] !== '\\')) {
          inString = false;
        }
      } else {
        if (char === '"') {
          inString = true;
        } else if (char === '{' || char === '[') {
          balance++;
        } else if (char === '}' || char === ']') {
          balance--;
        } else if (char === ',' && balance === 0) {
          break; 
        }
      }
      cursor++;
    }
    const value = content.substring(valueStart, cursor).trim();
    if (key) { // Ensure key is not empty before setting
        nbtMap.set(key, value);
    }
  }
  return nbtMap;
}

const getNbtMapFromString = (nbtStr: string): Map<string, string> => {
  const trimmedNbtStr = nbtStr.trim();
  if (trimmedNbtStr.startsWith("{") && trimmedNbtStr.endsWith("}")) {
    const content = trimmedNbtStr.substring(1, trimmedNbtStr.length - 1);
    return parseNbtContent(content);
  }
  return new Map();
};

const getStringFromNbtMap = (nbtMap: Map<string, string>): string => {
  if (nbtMap.size === 0) {
    return ""; // Return empty string for no NBT data (command generator should omit NBT part)
  }
  const entries = Array.from(nbtMap.entries()).map(([k, v]) => `${k.trim()}:${v.trim()}`);
  return `{${entries.join(',')}}`;
};

const addNbtEntry = (currentNbt: string, key: string, value: string): string => {
  const nbtMap = getNbtMapFromString(currentNbt);
  nbtMap.set(key, value);
  return getStringFromNbtMap(nbtMap);
};

const removeNbtEntry = (currentNbt: string, key: string): string => {
  const nbtMap = getNbtMapFromString(currentNbt);
  nbtMap.delete(key);
  return getStringFromNbtMap(nbtMap);
};

const getNbtEntryValue = (currentNbt: string, key: string): string | undefined => {
  const nbtMap = getNbtMapFromString(currentNbt);
  return nbtMap.get(key);
};

// --- NBT Toggle Configurations ---
interface NbtToggleConfig {
  id: string;
  label: string;
  nbtKey: string;
  nbtValue: string;
}

const nbtToggleConfigs: NbtToggleConfig[] = [
  { id: "noai", label: "NoAI（脳死）", nbtKey: "NoAI", nbtValue: "1b" },
  { id: "persistencerequired", label: "PersistenceRequired（持続）", nbtKey: "PersistenceRequired", nbtValue: "1b" },
  { id: "invulnerable", label: "Invulnerable（不死）", nbtKey: "Invulnerable", nbtValue: "1b" },
  { id: "silent", label: "Silent（無音）", nbtKey: "Silent", nbtValue: "1b" },
  { id: "nogravity", label: "NoGravity（無重力）", nbtKey: "NoGravity", nbtValue: "1b" },
  { id: "rotation", label: "Rotation（回転）", nbtKey: "Rotation", nbtValue: "[90f,0f]" },
  { id: "tags", label: "Tag:enemy", nbtKey: "Tags", nbtValue: "[enemy]" },
  // Add more common NBT toggles here
];


const SummonCommand: React.FC<SummonCommandProps> = ({ onCommandChange }) => {
  const [entity, setEntity] = useState(entityTypes[0]);
  const [position, setPosition] = useState<Position>({
    x: "~",
    y: "~",
    z: "~",
  });
  // SummonCommandに追加する部分

  // searchQueryステートを追加
  const [searchQuery, setSearchQuery] = useState("");



  // --- MODIFIED ---
  // Initialize nbt state with NoAI and PersistenceRequired enabled by default
  const [nbt, setNbt] = useState(() => {
    let initialNbt = "";
    const noAiConfig = nbtToggleConfigs.find(c => c.id === "noai");
    const persistenceConfig = nbtToggleConfigs.find(c => c.id === "persistencerequired");

    if (noAiConfig) {
      initialNbt = addNbtEntry(initialNbt, noAiConfig.nbtKey, noAiConfig.nbtValue);
    }
    if (persistenceConfig) {
      initialNbt = addNbtEntry(initialNbt, persistenceConfig.nbtKey, persistenceConfig.nbtValue);
    }
    return initialNbt;
  });
  // --- END MODIFIED ---

  const [customEntity, setCustomEntity] = useState("");
  const [isCustomEntity, setIsCustomEntity] = useState(false);

  useEffect(() => {
    const selectedEntity = isCustomEntity ? customEntity : entity;
    if (selectedEntity) {
      const command = generateSummonCommand(selectedEntity, position, nbt);
      onCommandChange(command);
    }
  }, [entity, customEntity, isCustomEntity, position, nbt, onCommandChange]);

  const handleNbtToggle = (config: NbtToggleConfig) => {
    const currentValue = getNbtEntryValue(nbt, config.nbtKey);
    if (currentValue === config.nbtValue) {
      // If current value matches, it means it's ON, so turn it OFF (remove)
      setNbt(removeNbtEntry(nbt, config.nbtKey));
    } else {
      // If different value or not present, turn it ON (add/overwrite)
      setNbt(addNbtEntry(nbt, config.nbtKey, config.nbtValue));
    }
  };

  // フィルタリングされたエンティティリストを作成
  const filteredEntities = useMemo(() => {
    if (!searchQuery.trim()) return entityTypes;
    return entityTypes.filter(e => 
      e.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [entityTypes, searchQuery]);

  useEffect(() => {
    if (filteredEntities.length > 0) {
      setEntity(filteredEntities[0]);
    }
  }, [searchQuery]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">Entity</label>
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            {isCustomEntity ? (
            <input type="text" value={customEntity} onChange={(e)=> setCustomEntity(e.target.value)}
            placeholder="minecraft:entity_id"
            className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500"
            />
            ) : (
              <div className="flex gap-2 w-full">
              <input type="text" value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)}
              placeholder="Filter"
              className="w-32 px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500
              flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <select value={entity} onChange={(e)=> setEntity(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600
                  focus:border-emerald-500 truncate min-h-[42px]"
                  >
                  {filteredEntities.map((e) => (
                  <option key={e} value={e} className="truncate">
                    {e}
                  </option>
                  ))}
                </select>
              </div>
            </div>
            )}
          </div>
          <button type="button" onClick={()=> setIsCustomEntity(!isCustomEntity)}
            className="px-3 py-2 bg-stone-600 hover:bg-stone-500 text-white rounded border border-stone-500
            transition-colors whitespace-nowrap"
            >
            {isCustomEntity ? "Common Entities" : "Custom Entity"}
          </button>
        </div>
      </div>

      <PositionInput
        position={position}
        onChange={setPosition}
        label="Position (Use ~ for relative coordinates)"
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-300">
          NBT Data (optional)
        </label>
        <div className="mb-2 flex flex-wrap gap-2">
          {nbtToggleConfigs.map((config) => {
            const isActive = getNbtEntryValue(nbt, config.nbtKey) === config.nbtValue;
            return (
              <button
                key={config.id}
                type="button"
                onClick={() => handleNbtToggle(config)}
                className={`px-3 py-1 rounded text-sm transition-colors border ${
                  isActive
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
                    : 'bg-stone-600 hover:bg-stone-500 text-stone-300 border-stone-500'
                }`}
              >
                {config.label} 
              </button>
            );
          })}
        </div>
        <textarea
          value={nbt}
          onChange={(e) => setNbt(e.target.value)}
          placeholder='{NoAI:1b,CustomName:"\"My Mob\""}'
          className="w-full px-3 py-2 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500 font-mono text-sm h-20"
        />
      </div>
    </div>
  );
};

export default SummonCommand;