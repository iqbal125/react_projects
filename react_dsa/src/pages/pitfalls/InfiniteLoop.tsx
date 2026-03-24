import React, { useState, useEffect, useRef } from 'react';

// ─── Simulated loop (capped at 10 iterations for safety) ─────
const LoopSimulator: React.FC = () => {
    const [renderCount, setRenderCount] = useState(0);
    const [running, setRunning] = useState(false);
    const guardRef = useRef(false);

    // Bug pattern: effect updates state with no dep guard → infinite loop
    // We simulate it with a timeout and a hard cap of 10 to avoid crashing.
    useEffect(() => {
        if (!running) return;
        if (renderCount >= 10) {
            guardRef.current = true;
            setRunning(false);
            return;
        }
        const id = setTimeout(() => {
            setRenderCount((c) => c + 1); // triggers re-render → effect fires again
        }, 80);
        return () => clearTimeout(id);
    }, [renderCount, running]);

    const reset = () => {
        guardRef.current = false;
        setRenderCount(0);
        setRunning(false);
    };

    return (
        <div className="space-y-2">
            <button
                onClick={() => { reset(); setTimeout(() => setRunning(true), 0); }}
                disabled={running}
                className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600 disabled:opacity-50"
            >
                {running ? 'Looping…' : 'Simulate loop'}
            </button>
            {renderCount > 0 && (
                <div className="text-sm font-mono text-red-600">
                    Effect fired {renderCount} times{renderCount >= 10 ? ' — stopped (real loop = ∞)' : '…'}
                </div>
            )}
            {renderCount >= 10 && (
                <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-700 underline">Reset</button>
            )}
        </div>
    );
};

// ─── Fix: derive instead of effect ───────────────────────────
const DeriveInstead: React.FC = () => {
    const [count, setCount] = useState(0);
    const doubled = count * 2; // no effect needed — computed inline

    return (
        <div className="space-y-2">
            <button
                onClick={() => setCount((c) => c + 1)}
                className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700"
            >
                Increment (count: {count})
            </button>
            <p className="text-sm text-gray-700">Doubled: <strong>{doubled}</strong></p>
            <p className="text-xs text-gray-400">Derived inline — always in sync, zero effects needed.</p>
        </div>
    );
};

const InfiniteLoop: React.FC = () => (
    <div className="max-w-xl mx-auto space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Pitfall: Infinite Effect Loop</h1>
            <p className="mt-1 text-gray-600 text-sm">
                An effect that updates state will trigger a re-render, which re-runs the effect,
                which updates state again — infinitely. This happens when there's no dependency
                array, or when the effect updates something it also depends on. The fix is
                usually to <strong>derive</strong> the value instead of storing it in state.
            </p>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 text-xs font-mono space-y-1">
            <div className="text-gray-500">{'// ❌ Bug: effect fires → setState → rerender → effect fires…'}</div>
            <div className="text-red-400">{'useEffect(() => {'}</div>
            <div className="text-red-400 pl-4">{'setDoubled(count * 2);'}</div>
            <div className="text-red-400">{'});  // ← no dep array'}</div>
            <div className="text-gray-500 mt-2">{'// ✓ Fix: just compute it'}</div>
            <div className="text-green-400">{'const doubled = count * 2;'}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="border-2 border-red-200 rounded-xl p-4 space-y-2">
                <h2 className="font-semibold text-red-700 text-sm">❌ Bug (capped at 10 iterations)</h2>
                <LoopSimulator />
            </section>
            <section className="border-2 border-green-200 rounded-xl p-4 space-y-2">
                <h2 className="font-semibold text-green-700 text-sm">✓ Fix — derive during render</h2>
                <DeriveInstead />
            </section>
        </div>

        <div className="bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-600 border border-gray-200">
            <strong>Interview line:</strong> Before reaching for an effect to sync state, ask whether
            the value can be derived during render instead. Derived values never loop — they just
            compute on every render from existing state or props.
        </div>
    </div>
);

export default InfiniteLoop;
