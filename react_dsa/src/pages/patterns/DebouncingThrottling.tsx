import React, { useState, useRef, useCallback, useEffect } from 'react';

// ─── Custom hooks ─────────────────────────────────────────────

function useDebouncedCallback<T extends (...args: never[]) => void>(
    callback: T,
    delay: number
): T {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    useEffect(() => () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, []);

    return useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                callbackRef.current(...args);
            }, delay);
        },
        [delay]
    ) as T;
}

function useThrottledCallback<T extends (...args: never[]) => void>(
    callback: T,
    limit: number
): T {
    const lastRan = useRef(0);
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    return useCallback(
        (...args: Parameters<T>) => {
            const now = Date.now();
            if (now - lastRan.current >= limit) {
                lastRan.current = now;
                callbackRef.current(...args);
            }
        },
        [limit]
    ) as T;
}

// ─── Page ─────────────────────────────────────────────────────

const DebouncingThrottling: React.FC = () => {
    const [rawInput, setRawInput] = useState('');
    const [debouncedValue, setDebouncedValue] = useState('');
    const [keystrokeCount, setKeystrokeCount] = useState(0);
    const [debounceCallCount, setDebounceCallCount] = useState(0);

    const [scrollCount, setScrollCount] = useState(0);
    const [throttledScrollCount, setThrottledScrollCount] = useState(0);

    const debouncedSearch = useDebouncedCallback((value: string) => {
        setDebouncedValue(value);
        setDebounceCallCount((c) => c + 1);
    }, 500);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRawInput(value);
        setKeystrokeCount((c) => c + 1);
        debouncedSearch(value);
    };

    const throttledScroll = useThrottledCallback(() => {
        setThrottledScrollCount((c) => c + 1);
    }, 200);

    const handleScroll = () => {
        setScrollCount((c) => c + 1);
        throttledScroll();
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Pattern: Debouncing & Throttling</h1>
                <p className="mt-1 text-gray-600 text-sm">
                    Two techniques for controlling high-frequency events.{' '}
                    <strong>Debounce</strong> waits until activity stops before firing (search inputs).{' '}
                    <strong>Throttle</strong> fires at most once per interval regardless of event frequency
                    (scroll, resize, mousemove). Both are implemented as custom hooks using{' '}
                    <code>useRef</code> + <code>useCallback</code>.
                </p>
            </div>

            {/* Debounce demo */}
            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                <h2 className="font-semibold text-gray-700">Debounce — search input (500ms)</h2>
                <p className="text-sm text-gray-500">
                    Type quickly. The "search" fires only 500ms after you stop typing.
                </p>
                <input
                    type="text"
                    value={rawInput}
                    onChange={handleChange}
                    placeholder="Type to search…"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-6 text-sm">
                    <span className="text-gray-500">Keystrokes: <strong>{keystrokeCount}</strong></span>
                    <span className="text-blue-600">Search calls: <strong>{debounceCallCount}</strong></span>
                </div>
                {debouncedValue && (
                    <div className="bg-blue-50 rounded-lg px-4 py-2 text-blue-800 text-sm">
                        Searching for: "{debouncedValue}"
                    </div>
                )}
            </div>

            {/* Throttle demo */}
            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                <h2 className="font-semibold text-gray-700">Throttle — scroll events (200ms)</h2>
                <p className="text-sm text-gray-500">
                    Scroll inside the box. Raw events fire on every tick; throttled fires at most once per 200ms.
                </p>
                <div
                    onScroll={handleScroll}
                    className="h-40 overflow-y-scroll border border-gray-300 rounded-lg p-4"
                >
                    <div className="h-[800px] bg-gradient-to-b from-green-50 to-green-200 rounded-lg flex items-start justify-center pt-4 text-green-700 text-sm">
                        ↕ Scroll me
                    </div>
                </div>
                <div className="flex gap-6 text-sm">
                    <span className="text-gray-500">Raw scroll events: <strong>{scrollCount}</strong></span>
                    <span className="text-green-600">Throttled calls: <strong>{throttledScrollCount}</strong></span>
                </div>
            </div>
        </div>
    );
};

export default DebouncingThrottling;
