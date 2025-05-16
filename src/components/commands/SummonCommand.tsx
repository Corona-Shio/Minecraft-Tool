import React, { useState, useEffect } from "react";
import { generateSummonCommand } from "../../utils/commandGenerators";
import PositionInput from "../PositionInput";
import FilterSelect from "../FilterSelect";
import { entityTypes } from "../../data/commandOptions";
import { Position } from "../../types/commandTypes";

// --- NBT Manipulation Utilities ---

/**
 * Parses the content of an NBT object (string between '{' and '}')
 * into a Map of key-value strings.
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
    let key: string;
    let keyStart = cursor;

    if (content[cursor] === '"') { // Quoted key
      keyStart++; // Skip initial quote
      cursor++;
      let keyContentEnd = keyStart;
      while (keyContentEnd < len) {
        if (content[keyContentEnd] === '"' && (keyContentEnd === keyStart || content[keyContentEnd - 1] !== '\\')) { // Handle empty quoted key and unescaped closing quote
          break;
        }
        keyContentEnd++;
      }
      if (keyContentEnd >= len || content[keyContentEnd] !== '"') break; // Malformed: unterminated quoted key
      key = content.substring(keyStart, keyContentEnd).replace(/\\"/g, '"'); // Get content, unescape inner quotes
      cursor = keyContentEnd + 1; // Move past the closing quote
    } else { // Unquoted key
      let keyContentEnd = cursor;
      while (keyContentEnd < len && content[keyContentEnd] !== ':') {
        keyContentEnd++;
      }
      if (keyContentEnd >= len) break; // Malformed NBT (e.g., "{key}")
      key = content.substring(keyStart, keyContentEnd).trim();
      cursor = keyContentEnd;
    }

    // Skip whitespace after key (if any) and then the colon
    while (cursor < len && /\s/.test(content[cursor])) {
      cursor++;
    }
    if (cursor >= len || content[cursor] !== ':') break; // Malformed (missing colon after key)
    cursor++; // Skip ':'

    // Skip whitespace before value
    while (cursor < len && /\s/.test(content[cursor])) {
      cursor++;
    }
    if (cursor >= len && key !== undefined && key.length > 0) { // Key with no value after colon
        nbtMap.set(key, "");
        break;
    }
    if (cursor >=len) break; // End of content after colon for a key with no value

    // Parse value
    let valueStart = cursor;
    let balance = 0; // To handle nested {} and []
    let inString = false;

    while (cursor < len) {
      const char = content[cursor];
      const prevChar = cursor > valueStart ? content[cursor - 1] : null;

      if (inString) {
        if (char === '"' && (prevChar !== '\\' || (prevChar === '\\' && cursor > 1 && content[cursor-2] === '\\') ) ) { // Handle escaped backslash before quote
          inString = false;
        }
      } else {
        if (char === '"') {
          inString = true;
        } else if (char === '{' || char === '[') {
          balance++;
        } else if (char === '}' || char === ']') {
          balance--;
          if (balance < 0) { // End of current NBT object/array value context
            cursor++; // Include the closing bracket/brace
            break;
          }
        } else if (char === ',' && balance === 0) {
          break;
        }
      }
      cursor++;
    }
    const value = content.substring(valueStart, cursor).trim();
    if (key !== undefined && key.length > 0) {
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
    return "";
  }
  const entries = Array.from(nbtMap.entries()).map(([k, v]) => {
    const key = k.trim();
    const isSimpleKey = /^[a-zA-Z0-9_]+$/.test(key);
    const quotedKey = isSimpleKey ? key : `"${key.replace(/"/g, '\\"')}"`;
    const value = v.trim(); // Value should already be a valid NBT literal string
    return `${quotedKey}:${value}`;
  });
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
  {
    id: "pehkui_scale",
    label: "Pehkui Scale (base x2.0)",
    nbtKey: "pehkui:scale_data_types",
    nbtValue: '{"pehkui:base":{"scale":2.0f}}'
  },
];

interface SummonCommandProps {
  onCommandChange: (command: string) => void;
}

// FilterSelectが期待する{id: string, name: string}の形式に変換
const entityItems = entityTypes.map(entityName => ({
  id: entityName,
  name: entityName,
}));

const defaultEntityId = entityItems.length > 0 ? entityItems[0].id : '';

const SummonCommand: React.FC<SummonCommandProps> = ({ onCommandChange }) => {
  const [entity, setEntity] = useState<string>(defaultEntityId);
  const [position, setPosition] = useState<Position>({
    x: "~",
    y: "~",
    z: "~",
  });

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

  const [customEntity, setCustomEntity] = useState("");
  const [isCustomEntity, setIsCustomEntity] = useState(false);

  useEffect(() => {
    const selectedEntityId = isCustomEntity ? customEntity : entity;
    if (selectedEntityId) {
      const command = generateSummonCommand(selectedEntityId, position, nbt);
      onCommandChange(command);
    } else {
        onCommandChange("");
    }
  }, [entity, customEntity, isCustomEntity, position, nbt, onCommandChange]);

  const handleNbtToggle = (config: NbtToggleConfig) => {
    const currentValue = getNbtEntryValue(nbt, config.nbtKey);
    if (currentValue !== undefined && currentValue === config.nbtValue) {
      setNbt(removeNbtEntry(nbt, config.nbtKey));
    } else {
      setNbt(addNbtEntry(nbt, config.nbtKey, config.nbtValue));
    }
  };

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
              <FilterSelect
                items={entityItems}
                selectedItemId={entity}
                onItemSelected={setEntity}
                searchPlaceholder="Filter entities"
                itemDisplayFormatter={(item) => item.id}
              />
            )}
          </div>
          <button type="button" onClick={()=> setIsCustomEntity(!isCustomEntity)}
            className="px-3 py-2 bg-stone-600 hover:bg-stone-500 text-white rounded border border-stone-500 transition-colors whitespace-nowrap min-h-[42px]"
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
         <p className="text-xs text-stone-400">
            NBT toggles modify the text area. You can also edit it directly.
            Complex values like lists or nested objects should be entered carefully.
          </p>
      </div>
    </div>
  );
};

export default SummonCommand;