import React, { useState, useMemo, useRef, memo } from 'react';

function fibonacci(n: number): number {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// ─── Simple: filtered list ───────────────────────────────────
const FRUITS = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Cranberry', 'Date', 'Fig', 'Grape', 'Kiwi', 'Lemon', 'Mango', 'Orange', 'Papaya', 'Peach', 'Pear', 'Plum', 'Raspberry', 'Strawberry', 'Watermelon'];

const FilteredList: React.FC = () => {
    const [query, setQuery] = useState('');
    const [highlight, setHighlight] = useState(false);

    const filtered = useMemo(
        () => FRUITS.filter((f) => f.toLowerCase().includes(query.toLowerCase())),
        [query]
    );

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Filter fruits…"
                    className="border rounded-lg px-3 py-1.5 text-sm w-48"
                />
                <button
                    onClick={() => setHighlight((h) => !h)}
                    className="px-3 py-1.5 rounded-lg text-sm text-white bg-amber-500 hover:bg-amber-600"
                >
                    Highlight: {highlight ? 'ON' : 'OFF'}
                </button>
            </div>
            <ul className="flex flex-wrap gap-1.5">
                {filtered.map((f) => (
                    <li
                        key={f}
                        className={`px-2 py-0.5 rounded text-xs font-mono ${highlight ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}
                    >
                        {f}
                    </li>
                ))}
            </ul>
            <p className="text-xs text-gray-400">
                {filtered.length} / {FRUITS.length} shown. Toggling highlight re-renders but does <strong>not</strong> re-filter — <code>useMemo</code> skips recalculation because <code>query</code> hasn't changed.
            </p>
        </div>
    );
};

// ─── Expensive: fibonacci ────────────────────────────────────

// ─── With memo ───────────────────────────────────────────────
const WithMemo: React.FC<{ n: number }> = ({ n }) => {
    const renderCount = useRef(0);
    renderCount.current += 1;
    const result = useMemo(() => fibonacci(n), [n]);
    return (
        <div className="space-y-1">
            <div className="bg-gray-50 rounded-lg px-3 py-2 font-mono text-sm">
                fib({n}) = <strong>{result}</strong>
            </div>
            <p className="text-xs text-gray-400">Computes: renders #{renderCount.current}</p>
        </div>
    );
};

// ─── Without memo ────────────────────────────────────────────
const WithoutMemo: React.FC<{ n: number }> = ({ n }) => {
    const renderCount = useRef(0);
    renderCount.current += 1;
    const result = fibonacci(n); // runs on every render
    return (
        <div className="space-y-1">
            <div className="bg-gray-50 rounded-lg px-3 py-2 font-mono text-sm">
                fib({n}) = <strong>{result}</strong>
            </div>
            <p className="text-xs text-gray-400">Computes: renders #{renderCount.current}</p>
        </div>
    );
};

// Prevent the child from re-rendering on unrelated parent updates
const MemoWithMemo = memo(WithMemo);
const MemoWithoutMemo = memo(WithoutMemo);

const UseMemo: React.FC = () => {
    const [n, setN] = useState(35);
    const [unrelated, setUnrelated] = useState(0);

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">useMemo</h1>
                <p className="mt-1 text-gray-600 text-sm">
                    Caches the result of an expensive calculation between renders.
                    React only recomputes when a listed dependency changes.
                    Avoid premature optimization — profile first, then apply{' '}
                    <code>useMemo</code> only where a calculation is measurably slow.
                </p>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => setUnrelated((c) => c + 1)}
                    className="px-3 py-1.5 rounded-lg text-sm text-white bg-amber-500 hover:bg-amber-600"
                >
                    Unrelated update ({unrelated})
                </button>
                <div className="flex items-center gap-2 ml-2">
                    <label className="text-sm text-gray-600">n =</label>
                    <input
                        type="range" min={25} max={40} value={n}
                        onChange={(e) => setN(Number(e.target.value))}
                        className="w-32"
                    />
                    <span className="font-mono text-sm w-6">{n}</span>
                </div>
            </div>

            <section className="border-2 border-blue-200 rounded-xl p-4 space-y-2">
                <h2 className="font-semibold text-blue-700 text-sm">Filtered list</h2>
                <p className="text-xs text-gray-500">
                    <code>useMemo</code> caches the filtered array so unrelated state changes (highlight toggle) skip the filter.
                </p>
                <FilteredList />
            </section>

            <div className="grid grid-cols-2 gap-4">
                <section className="border-2 border-green-200 rounded-xl p-4 space-y-2">
                    <h2 className="font-semibold text-green-700 text-sm">✓ useMemo ON</h2>
                    <p className="text-xs text-gray-500">fib only recomputes when n changes.</p>
                    <MemoWithMemo n={n} />
                </section>
                <section className="border-2 border-red-200 rounded-xl p-4 space-y-2">
                    <h2 className="font-semibold text-red-700 text-sm">❌ useMemo OFF</h2>
                    <p className="text-xs text-gray-500">fib recomputes on every render.</p>
                    <MemoWithoutMemo n={n} />
                </section>
            </div>

            <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                Click <strong>Unrelated update</strong> — only the left panel recalculates fib on dep
                change. Try n ≥ 38 for visible lag in the right panel.
            </p>
        </div>
    );
};

export default UseMemo;
