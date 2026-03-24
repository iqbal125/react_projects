import React, { useState, useDeferredValue, memo } from 'react';

const ALL_ITEMS = Array.from({ length: 5_000 }, (_, i) => `Result #${i + 1}`);

// Artificially slow list — re-renders only when deferredQuery changes (via React.memo)
const HeavyList: React.FC<{ query: string }> = memo(({ query }) => {
    const filtered = ALL_ITEMS.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 50);

    // 1ms busywork per item to simulate expensive rendering
    return (
        <ul className="max-h-48 overflow-y-auto px-4 py-2">
            {filtered.map((item) => {
                const start = performance.now();
                while (performance.now() - start < 1) { /* deliberate delay */ }
                return (
                    <li key={item} className="text-sm text-gray-700 py-0.5 border-b border-gray-100 last:border-0">
                        {item}
                    </li>
                );
            })}
        </ul>
    );
});

const UseDeferredValue: React.FC = () => {
    const [query, setQuery] = useState('');
    const deferredQuery = useDeferredValue(query);

    // True while the deferred value is still catching up to the current input
    const isStale = query !== deferredQuery;

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">useDeferredValue</h1>
                <p className="mt-1 text-gray-600 text-sm">
                    Returns a deferred copy of a value that lags behind the current value. React
                    renders the expensive component with the deferred (old) value first, then re-renders
                    with the latest value when it has time. Unlike <code>useTransition</code>, you use
                    this when you don't control the code that triggers the state update — useful for
                    wrapping props passed into heavy third-party components.
                </p>
            </div>

            <div className="relative">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type to filter…"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                {isStale && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-500 font-medium animate-pulse">
                        Stale…
                    </span>
                )}
            </div>

            <div className="text-xs text-gray-500 flex gap-6">
                <span>current: <code className="font-mono text-blue-700">"{query}"</code></span>
                <span>deferred: <code className="font-mono text-gray-500">"{deferredQuery}"</code></span>
            </div>

            <div className={`border border-gray-200 rounded-xl overflow-hidden transition-opacity ${isStale ? 'opacity-60' : 'opacity-100'}`}>
                <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 border-b border-gray-200">
                    HeavyList renders with <code>deferredQuery</code> — stays stale while you type
                </div>
                <HeavyList query={deferredQuery} />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-xs text-blue-800">
                <strong>deferredQuery !== query</strong> while the deferred render is pending — use
                this to show a loading/stale state. The list is wrapped in <code>React.memo</code>
                so it only re-renders when <code>deferredQuery</code> actually changes.
            </div>
        </div>
    );
};

export default UseDeferredValue;
