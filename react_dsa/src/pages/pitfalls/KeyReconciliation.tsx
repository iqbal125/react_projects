import React, { useState } from 'react';

interface Item { id: number; name: string; }

const INITIAL_ITEMS: Item[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Carol' },
];

// Each row has local editable state — this is what gets attached to the wrong item
const EditableRow: React.FC<{ name: string }> = ({ name }) => {
    const [text, setText] = useState(name);
    return (
        <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    );
};

const ListDemo: React.FC<{ useIndex: boolean }> = ({ useIndex }) => {
    const [items, setItems] = useState(INITIAL_ITEMS);

    const shuffle = () => setItems((prev) => [...prev].sort(() => Math.random() - 0.5));
    const addToFront = () => setItems((prev) => [{ id: Date.now(), name: 'New person' }, ...prev]);

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <button onClick={shuffle} className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">Shuffle</button>
                <button onClick={addToFront} className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">Add to front</button>
            </div>
            <ul className="space-y-1">
                {items.map((item, index) => (
                    <li key={useIndex ? index : item.id} className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-4 shrink-0">{index}</span>
                        <EditableRow name={item.name} />
                        <span className="text-xs text-gray-300 shrink-0">#{item.id}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const KeyReconciliation: React.FC = () => (
    <div className="max-w-2xl mx-auto space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Pitfall: Key Reconciliation Bug</h1>
            <p className="mt-1 text-gray-600 text-sm">
                React uses <code>key</code> to identify which component instance maps to which
                list item across renders. Index-based keys are unstable — when items reorder,
                the index shifts, and React reuses the existing component instance (with its local
                state) for a different item.
            </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-800">
            <strong>Steps:</strong> Edit some names in both columns, then click Shuffle or Add to front.
            Watch how the typed text "migrates" in the left panel.
        </div>

        <div className="grid grid-cols-2 gap-4">
            <section className="border-2 border-red-200 rounded-xl p-4 space-y-2">
                <h2 className="font-semibold text-red-700 text-sm">❌ <code>key=&#123;index&#125;</code></h2>
                <p className="text-xs text-gray-500">State follows the position, not the item.</p>
                <ListDemo useIndex={true} />
            </section>
            <section className="border-2 border-green-200 rounded-xl p-4 space-y-2">
                <h2 className="font-semibold text-green-700 text-sm">✓ <code>key=&#123;item.id&#125;</code></h2>
                <p className="text-xs text-gray-500">State follows the item regardless of position.</p>
                <ListDemo useIndex={false} />
            </section>
        </div>

        <div className="bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-600 border border-gray-200">
            <strong>Interview line:</strong> Keys are for identity, not just satisfying the linter.
            Index keys are safe for static, never-reordered lists. For anything that can be
            inserted, removed, filtered, or reordered — always use a stable unique ID.
        </div>
    </div>
);

export default KeyReconciliation;
