import React, { useState, useCallback, useRef, memo } from 'react';

// Memoized child — only re-renders when its props change
const TrackedButton: React.FC<{ onClick: () => void }> = memo(({ onClick }) => {
    const renderCount = useRef(0);
    renderCount.current += 1;
    return (
        <div className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-2 text-sm">
            <button onClick={onClick} className="text-blue-600 hover:underline font-medium">
                Increment
            </button>
            <span className="text-xs text-gray-400">child renders: {renderCount.current}</span>
        </div>
    );
});

const UseCallback: React.FC = () => {
    const [count, setCount] = useState(0);
    const [callbackOn, setCallbackOn] = useState(true);
    const [unrelated, setUnrelated] = useState(0);

    // Stable reference — same function object across renders
    const stableHandler = useCallback(() => setCount((c) => c + 1), []);

    // Unstable reference — new function created on every render
    const inlineHandler = () => setCount((c) => c + 1);

    const handler = callbackOn ? stableHandler : inlineHandler;

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">useCallback</h1>
                <p className="mt-1 text-gray-600 text-sm">
                    Caches a function so its reference stays stable between renders.
                    Creating a new function each render is cheap — identity stability matters
                    only when passing handlers to <code>React.memo</code> children, or using
                    them as effect dependencies. Apply it selectively, not by default.
                </p>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
                <button
                    onClick={() => setCallbackOn((c) => !c)}
                    className={`px-3 py-1.5 rounded-lg text-sm text-white ${callbackOn ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'}`}
                >
                    useCallback: {callbackOn ? 'ON' : 'OFF'}
                </button>
                <button
                    onClick={() => setUnrelated((c) => c + 1)}
                    className="px-3 py-1.5 rounded-lg text-sm text-white bg-amber-500 hover:bg-amber-600"
                >
                    Unrelated update ({unrelated})
                </button>
                <span className="text-sm text-gray-600 ml-2">count: <strong>{count}</strong></span>
            </div>

            <section className="border border-gray-200 rounded-xl p-4 space-y-3">
                <h2 className="font-semibold text-gray-700">
                    <code>React.memo</code> child watches its render count
                </h2>
                <TrackedButton onClick={handler} />
                <p className="text-xs text-gray-500">
                    {callbackOn
                        ? '✓ useCallback ON: "Unrelated update" passes the same function → child does not re-render.'
                        : '❌ useCallback OFF: every parent render creates a new function → busts React.memo.'}
                </p>
            </section>

            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-xs text-gray-600">
                <strong>Rule of thumb:</strong> wrap in <code>useCallback</code> when the function is
                passed to a memoized child or listed as an effect dependency. Avoid wrapping everything —
                the extra closure and comparison have their own (small) cost.
            </div>
        </div>
    );
};

export default UseCallback;
