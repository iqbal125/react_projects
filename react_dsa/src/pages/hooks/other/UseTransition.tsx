import React, { useState, useTransition } from 'react';

const ALL_ITEMS = Array.from({ length: 5_000 }, (_, i) => `Item ${i + 1}`);

// Artificially slow item — 1 ms busywork per item to simulate heavy rendering
const SlowItem: React.FC<{ text: string }> = ({ text }) => {
    const start = performance.now();
    while (performance.now() - start < 1) { /* deliberate 1ms delay */ }
    return <li className="text-sm text-gray-700 py-0.5 border-b border-gray-100 last:border-0">{text}</li>;
};

const UseTransition: React.FC = () => {
    const [query, setQuery] = useState('');
    const [list, setList] = useState(ALL_ITEMS.slice(0, 20));
    const [transitionOn, setTransitionOn] = useState(true);
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value;
        setQuery(q); // always immediate — input stays responsive

        const filtered = ALL_ITEMS.filter((item) =>
            item.toLowerCase().includes(q.toLowerCase())
        ).slice(0, 50);

        if (transitionOn) {
            // Mark the list update as non-urgent — input updates first
            startTransition(() => setList(filtered));
        } else {
            // Blocks paint until list is fully re-rendered
            setList(filtered);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">useTransition</h1>
                <p className="mt-1 text-gray-600 text-sm">
                    Marks a state update as non-urgent. React can interrupt the transition render
                    to process higher-priority updates (like user input). <code>isPending</code> is{' '}
                    <code>true</code> while the transition is in progress, letting you show a stale
                    indicator. Toggle the mode and type quickly to feel the difference.
                </p>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => setTransitionOn((t) => !t)}
                    className={`px-3 py-1.5 rounded-lg text-sm text-white ${transitionOn ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'}`}
                >
                    startTransition: {transitionOn ? 'ON' : 'OFF'}
                </button>
            </div>

            <div className="relative">
                <input
                    value={query}
                    onChange={handleChange}
                    placeholder="Type to filter (try typing fast)…"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                {isPending && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-500 font-medium animate-pulse">
                        Updating…
                    </span>
                )}
            </div>

            <div className={`border border-gray-200 rounded-xl overflow-hidden transition-opacity ${isPending ? 'opacity-60' : 'opacity-100'}`}>
                <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 border-b border-gray-200">
                    Showing {list.length} results (each item renders with artificial 1ms delay)
                </div>
                <ul className="max-h-48 overflow-y-auto px-4 py-2">
                    {list.map((item) => (
                        <SlowItem key={item} text={item} />
                    ))}
                </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-xs text-blue-800">
                <strong>With transition OFF:</strong> typing blocks until the full list re-renders.<br />
                <strong>With transition ON:</strong> the input updates immediately;{' '}
                <code>isPending</code> shows while the list catches up.
            </div>
        </div>
    );
};

export default UseTransition;
