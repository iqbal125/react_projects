import React, { useState, useEffect } from 'react';

// ─── setInterval + cleanup ───────────────────────────────────
const Timer: React.FC = () => {
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setSeconds((s) => s + 1), 1000);
        return () => clearInterval(id); // cleanup on unmount
    }, []);
    return <div className="bg-blue-50 rounded-lg px-4 py-2 text-blue-800 font-mono">⏱ {seconds}s</div>;
};

// ─── window event listener + cleanup ────────────────────────
const MouseTracker: React.FC = () => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handler);
        return () => window.removeEventListener('mousemove', handler);
    }, []);
    return <div className="bg-green-50 rounded-lg px-4 py-2 text-green-800 font-mono">Mouse: ({pos.x}, {pos.y})</div>;
};

// ─── resize listener + cleanup ───────────────────────────────
const WindowSize: React.FC = () => {
    const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
    useEffect(() => {
        const handler = () => setSize({ w: window.innerWidth, h: window.innerHeight });
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);
    return <div className="bg-purple-50 rounded-lg px-4 py-2 text-purple-800 font-mono">Window: {size.w}×{size.h}</div>;
};

const UseEffect: React.FC = () => {
    const [showTimer, setShowTimer] = useState(true);
    const [showMouse, setShowMouse] = useState(true);
    const [showSize, setShowSize] = useState(true);

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">useEffect</h1>
                <p className="mt-1 text-gray-600 text-sm">
                    Connects a component to an external system — timers, event listeners, subscriptions,
                    or data fetching. The optional <strong>cleanup function</strong> it returns runs before
                    the next effect and on unmount, preventing memory leaks. Toggle each sub-component
                    to observe the mount/unmount lifecycle (check console in StrictMode — effects run twice).
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setShowTimer((s) => !s)}
                    className={`px-3 py-1 rounded-lg text-sm text-white ${showTimer ? 'bg-blue-600' : 'bg-gray-400'}`}
                >
                    Timer: {showTimer ? 'ON' : 'OFF'}
                </button>
                <button
                    onClick={() => setShowMouse((s) => !s)}
                    className={`px-3 py-1 rounded-lg text-sm text-white ${showMouse ? 'bg-green-600' : 'bg-gray-400'}`}
                >
                    Mouse: {showMouse ? 'ON' : 'OFF'}
                </button>
                <button
                    onClick={() => setShowSize((s) => !s)}
                    className={`px-3 py-1 rounded-lg text-sm text-white ${showSize ? 'bg-purple-600' : 'bg-gray-400'}`}
                >
                    Window Size: {showSize ? 'ON' : 'OFF'}
                </button>
            </div>

            <div className="space-y-2">
                {showTimer && <Timer />}
                {showMouse && <MouseTracker />}
                {showSize && <WindowSize />}
            </div>

            <p className="text-xs text-gray-400">
                Toggling a component OFF unmounts it and runs its cleanup (clears the interval / removes
                listeners). Toggle back ON to re-mount and re-register.
            </p>
        </div>
    );
};

export default UseEffect;
