import React, { useState, useEffect, useMemo, useRef } from 'react';

// ─── Bug: inline object in deps → effect re-fires every render ─
// Safe version: we track fires via a ref (not state) so there's no infinite loop;
// parent's unrelated state update causes child to re-render and the effect to fire.
const BugVersion: React.FC<{ query: string; parentRenders: number }> = ({ query, parentRenders }) => {
    const effectFires = useRef(0);

    const options = { query, page: 1 }; // new reference every render

    useEffect(() => {
        effectFires.current += 1;
        // In real code this would be: fetch('/api', { body: JSON.stringify(options) })
    }, [options]); // ← options is a new object each render — fires every time

    return (
        <div className="space-y-1">
            <p className="text-xs font-mono text-red-600">
                Effect fires: <strong>{effectFires.current}</strong>
            </p>
            <p className="text-xs font-mono text-gray-500">
                Parent renders: <strong>{parentRenders}</strong>
            </p>
            <p className="text-xs text-gray-400">These should differ — but they don't.</p>
        </div>
    );
};

// ─── Fix 1: depend on primitives, build object inside ────────
const Fix1: React.FC<{ query: string; parentRenders: number }> = ({ query, parentRenders }) => {
    const effectFires = useRef(0);

    useEffect(() => {
        effectFires.current += 1;
        const options = { query, page: 1 }; // built inside, not in deps
        void options;
    }, [query]); // ← only re-fires when the query string changes

    return (
        <div className="space-y-1">
            <p className="text-xs font-mono text-green-600">
                Effect fires: <strong>{effectFires.current}</strong>
            </p>
            <p className="text-xs font-mono text-gray-500">
                Parent renders: <strong>{parentRenders}</strong>
            </p>
            <p className="text-xs text-gray-400">Effect fires only when query changes.</p>
        </div>
    );
};

// ─── Fix 2: memoize the object for a stable reference ────────
const Fix2: React.FC<{ query: string; parentRenders: number }> = ({ query, parentRenders }) => {
    const effectFires = useRef(0);
    const options = useMemo(() => ({ query, page: 1 }), [query]); // stable ref

    useEffect(() => {
        effectFires.current += 1;
        void options;
    }, [options]);

    return (
        <div className="space-y-1">
            <p className="text-xs font-mono text-blue-600">
                Effect fires: <strong>{effectFires.current}</strong>
            </p>
            <p className="text-xs font-mono text-gray-500">
                Parent renders: <strong>{parentRenders}</strong>
            </p>
            <p className="text-xs text-gray-400">Stable reference via useMemo.</p>
        </div>
    );
};

const ObjectDependency: React.FC = () => {
    const [query, setQuery] = useState('react');
    const [unrelated, setUnrelated] = useState(0);
    const parentRenders = useRef(0);
    parentRenders.current += 1;

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Pitfall: Object Dependency Trap</h1>
                <p className="mt-1 text-gray-600 text-sm">
                    Objects and arrays are compared by <em>reference</em> in JavaScript. An inline
                    object created in the component body gets a new reference on every render, so a
                    dependency array that includes it retriggers the effect every time — even if the
                    data inside hasn't changed.
                </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-4 text-xs font-mono space-y-1">
                <div className="text-gray-500">{'// ❌ new object every render → effect fires every render'}</div>
                <div className="text-red-400">{'const options = { query, page: 1 };'}</div>
                <div className="text-red-400">{'useEffect(() => { ... }, [options]);'}</div>
                <div className="text-gray-500 mt-2">{'// ✓ depend on the primitive instead'}</div>
                <div className="text-green-400">{'useEffect(() => { const options = {...}; ... }, [query]);'}</div>
            </div>

            <div className="flex flex-wrap gap-2">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="query"
                />
                <button
                    onClick={() => setUnrelated((c) => c + 1)}
                    className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-amber-600"
                >
                    Unrelated rerender ({unrelated})
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <section className="border-2 border-red-200 rounded-xl p-3 space-y-2">
                    <h2 className="text-sm font-semibold text-red-700">❌ No fix</h2>
                    <p className="text-xs text-gray-500"><code>deps: [options]</code></p>
                    <BugVersion query={query} parentRenders={parentRenders.current} />
                </section>
                <section className="border-2 border-green-200 rounded-xl p-3 space-y-2">
                    <h2 className="text-sm font-semibold text-green-700">✓ Fix 1 — primitives</h2>
                    <p className="text-xs text-gray-500"><code>deps: [query]</code></p>
                    <Fix1 query={query} parentRenders={parentRenders.current} />
                </section>
                <section className="border-2 border-blue-200 rounded-xl p-3 space-y-2">
                    <h2 className="text-sm font-semibold text-blue-700">✓ Fix 2 — useMemo</h2>
                    <p className="text-xs text-gray-500">stable ref via <code>useMemo</code></p>
                    <Fix2 query={query} parentRenders={parentRenders.current} />
                </section>
            </div>

            <div className="bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-600 border border-gray-200">
                <strong>Interview line:</strong> Dependencies should be stable primitives when possible.
                Objects and functions created inline have a new reference every render — prefer
                depending on primitives directly, or memoize the object with <code>useMemo</code>.
            </div>
        </div>
    );
};

export default ObjectDependency;
