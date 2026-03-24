import React, { useState, useEffect, useRef } from 'react';

// ─── Bug: interval closes over initial count = 0 forever ─────
const BugVersion: React.FC = () => {
    const [count, setCount] = useState(0);
    const [log, setLog] = useState<string[]>([]);

    useEffect(() => {
        const id = setInterval(() => {
            setLog((prev) => [...prev.slice(-4), `interval saw count = ${count}`]);
        }, 1500);
        return () => clearInterval(id);
    }, []); // ← missing count — closes over count = 0 forever

    return (
        <div className="space-y-2">
            <button
                onClick={() => setCount((c) => c + 1)}
                className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600"
            >
                Increment (count: {count})
            </button>
            <ul className="space-y-1">
                {log.map((l, i) => (
                    <li key={i} className="text-xs font-mono text-red-700 bg-red-50 rounded px-2 py-1">{l}</li>
                ))}
            </ul>
            {log.length === 0 && <p className="text-xs text-gray-400 italic">Waiting for first tick…</p>}
        </div>
    );
};

// ─── Fix 1: add count to deps → interval recreates on change ─
const Fix1: React.FC = () => {
    const [count, setCount] = useState(0);
    const [log, setLog] = useState<string[]>([]);

    useEffect(() => {
        const id = setInterval(() => {
            setLog((prev) => [...prev.slice(-4), `interval saw count = ${count}`]);
        }, 1500);
        return () => clearInterval(id);
    }, [count]); // ← correct dep: interval recreates when count changes

    return (
        <div className="space-y-2">
            <button
                onClick={() => setCount((c) => c + 1)}
                className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700"
            >
                Increment (count: {count})
            </button>
            <ul className="space-y-1">
                {log.map((l, i) => (
                    <li key={i} className="text-xs font-mono text-green-700 bg-green-50 rounded px-2 py-1">{l}</li>
                ))}
            </ul>
            {log.length === 0 && <p className="text-xs text-gray-400 italic">Waiting for first tick…</p>}
        </div>
    );
};

// ─── Fix 2: ref for latest value → single stable interval ────
const Fix2: React.FC = () => {
    const [count, setCount] = useState(0);
    const [log, setLog] = useState<string[]>([]);
    const countRef = useRef(count);

    useEffect(() => { countRef.current = count; }, [count]);

    useEffect(() => {
        const id = setInterval(() => {
            // Always reads the most recent value via the ref
            setLog((prev) => [...prev.slice(-4), `interval saw count = ${countRef.current}`]);
        }, 1500);
        return () => clearInterval(id);
    }, []); // ← single interval, never recreated

    return (
        <div className="space-y-2">
            <button
                onClick={() => setCount((c) => c + 1)}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700"
            >
                Increment (count: {count})
            </button>
            <ul className="space-y-1">
                {log.map((l, i) => (
                    <li key={i} className="text-xs font-mono text-blue-700 bg-blue-50 rounded px-2 py-1">{l}</li>
                ))}
            </ul>
            {log.length === 0 && <p className="text-xs text-gray-400 italic">Waiting for first tick…</p>}
        </div>
    );
};

const StaleClosure: React.FC = () => (
    <div className="max-w-3xl mx-auto space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Pitfall: Stale Closure</h1>
            <p className="mt-1 text-gray-600 text-sm">
                A function "closes over" values from the render where it was created. If it runs
                later — inside a timer, event listener, or async callback — it may read an old value.
                This is most common in effects with an empty dependency array <code>[]</code>.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <section className="border-2 border-red-200 rounded-xl p-4 space-y-2">
                <h2 className="font-semibold text-red-700 text-sm">❌ Bug — <code>deps: []</code></h2>
                <p className="text-xs text-gray-500">Interval captures count = 0 on mount and never updates.</p>
                <BugVersion />
            </section>
            <section className="border-2 border-green-200 rounded-xl p-4 space-y-2">
                <h2 className="font-semibold text-green-700 text-sm">✓ Fix 1 — correct deps</h2>
                <p className="text-xs text-gray-500"><code>deps: [count]</code> — interval recreates on each change.</p>
                <Fix1 />
            </section>
            <section className="border-2 border-blue-200 rounded-xl p-4 space-y-2">
                <h2 className="font-semibold text-blue-700 text-sm">✓ Fix 2 — ref for latest</h2>
                <p className="text-xs text-gray-500">Single interval; reads <code>countRef.current</code> which is always fresh.</p>
                <Fix2 />
            </section>
        </div>

        <div className="bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-600 border border-gray-200">
            <strong>Interview line:</strong> A stale closure happens when an async callback captures
            values from an old render. Fix with correct dependencies, functional state updates, or a
            ref for the latest value.
        </div>
    </div>
);

export default StaleClosure;
