import React, { useRef, useState, useEffect } from 'react';

// ─── Demo 1: DOM ref — imperative focus ──────────────────────
const FocusDemo: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <div className="flex gap-2 items-center">
            <input
                ref={inputRef}
                type="text"
                placeholder="Click the button to focus me…"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={() => inputRef.current?.focus()}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700"
            >
                Focus
            </button>
        </div>
    );
};

// ─── Demo 2: Mutable value — render + interval tracking ──────
const RenderTracker: React.FC = () => {
    const [count, setCount] = useState(0);
    const renderCount = useRef(0);
    renderCount.current += 1;

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [running, setRunning] = useState(false);

    const toggleTimer = () => {
        if (running) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
            setRunning(false);
        } else {
            intervalRef.current = setInterval(() => setCount((c) => c + 1), 500);
            setRunning(true);
        }
    };

    useEffect(() => () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    }, []);

    return (
        <div className="space-y-3">
            <div className="flex gap-3 items-center">
                <button
                    onClick={toggleTimer}
                    className={`px-3 py-1.5 rounded-lg text-sm text-white ${running ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {running ? 'Stop' : 'Start'} timer
                </button>
                <span className="font-mono text-gray-700 text-sm">count: {count}</span>
            </div>
            <div className="text-sm text-gray-600">
                Render count:{' '}
                <strong className="text-blue-700">{renderCount.current}</strong>
                <span className="text-xs text-gray-400 ml-2">
                    (tracked via <code>useRef</code> — mutating it never triggers a re-render)
                </span>
            </div>
        </div>
    );
};

const UseRef: React.FC = () => (
    <div className="max-w-xl mx-auto space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">useRef</h1>
            <p className="mt-1 text-gray-600 text-sm">
                Returns a mutable <code>.current</code> container that persists for the component's
                lifetime. Unlike state, mutating <code>.current</code> does <em>not</em> trigger a
                re-render. Two primary uses: holding a reference to a DOM node, or storing any
                mutable value (timer IDs, render counters, previous values) that shouldn't cause renders.
            </p>
        </div>

        <section className="border border-gray-200 rounded-xl p-4 space-y-3">
            <h2 className="font-semibold text-gray-700">DOM ref — imperative focus</h2>
            <p className="text-xs text-gray-500">
                React attaches the DOM node to <code>ref.current</code> after mount.
                Use sparingly — prefer declarative patterns when possible.
            </p>
            <FocusDemo />
        </section>

        <section className="border border-gray-200 rounded-xl p-4 space-y-3">
            <h2 className="font-semibold text-gray-700">Mutable value — render + interval tracker</h2>
            <p className="text-xs text-gray-500">
                <code>renderCount.current</code> increments every render without causing extra ones.
                <code>intervalRef</code> stores the timer ID so cleanup works without it being a dep.
            </p>
            <RenderTracker />
        </section>
    </div>
);

export default UseRef;
