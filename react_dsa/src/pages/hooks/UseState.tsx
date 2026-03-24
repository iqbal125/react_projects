import React, { useState, useRef } from 'react';

// ─── Demo 1: Primitive state ─────────────────────────────────
const Counter: React.FC = () => {
    const [count, setCount] = useState(0);
    return (
        <div className="flex items-center gap-3">
            <button onClick={() => setCount((c) => c - 1)} className="px-3 py-1.5 bg-gray-200 rounded-lg hover:bg-gray-300 font-mono">−</button>
            <span className="text-xl font-mono w-10 text-center">{count}</span>
            <button onClick={() => setCount((c) => c + 1)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-mono">+</button>
            <button onClick={() => setCount(0)} className="px-3 py-1.5 text-sm text-gray-500 hover:text-red-600">reset</button>
        </div>
    );
};

// ─── Demo 2: Array state ─────────────────────────────────────
interface Todo { id: number; text: string; done: boolean; }

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [input, setInput] = useState('');

    const add = () => {
        const t = input.trim();
        if (!t) return;
        setTodos((prev) => [...prev, { id: Date.now(), text: t, done: false }]);
        setInput('');
    };

    const toggle = (id: number) =>
        setTodos((prev) => prev.map((td) => td.id === id ? { ...td, done: !td.done } : td));

    const remove = (id: number) =>
        setTodos((prev) => prev.filter((td) => td.id !== id));

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && add()}
                    placeholder="New todo…"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={add} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700">Add</button>
            </div>
            <ul className="space-y-1">
                {todos.map((td) => (
                    <li key={td.id} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 text-sm">
                        <input type="checkbox" checked={td.done} onChange={() => toggle(td.id)} className="cursor-pointer" />
                        <span className={`flex-1 ${td.done ? 'line-through text-gray-400' : ''}`}>{td.text}</span>
                        <button onClick={() => remove(td.id)} className="text-red-400 hover:text-red-600 ml-2">✕</button>
                    </li>
                ))}
            </ul>
            {todos.length > 0 && (
                <p className="text-xs text-gray-400">{todos.filter((t) => t.done).length}/{todos.length} done</p>
            )}
            {todos.length === 0 && <p className="text-xs text-gray-400 italic">No todos yet.</p>}
        </div>
    );
};

// ─── Demo 3: Batch updates ──────────────────────────────────
const BatchUpdates: React.FC = () => {
    const [count, setCount] = useState(0);
    const renderCount = useRef(0);
    renderCount.current += 1;

    // ❌ Without functional updater — all three calls see the same
    // snapshot of count, so only ONE increment is applied.
    const incrementWrong = () => {
        setCount(count + 1);
        setCount(count + 1);
        setCount(count + 1);
    };

    // ✓ With functional updater — each call receives the latest
    // pending value, so all three increments are applied.
    const incrementRight = () => {
        setCount((c) => c + 1);
        setCount((c) => c + 1);
        setCount((c) => c + 1);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <span className="text-xl font-mono w-10 text-center">{count}</span>
                <button
                    onClick={incrementWrong}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 font-mono"
                >
                    +3 (wrong)
                </button>
                <button
                    onClick={incrementRight}
                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 font-mono"
                >
                    +3 (correct)
                </button>
                <button onClick={() => setCount(0)} className="px-3 py-1.5 text-sm text-gray-500 hover:text-red-600">reset</button>
            </div>
            <p className="text-xs text-gray-400">Renders: {renderCount.current}</p>
            <p className="text-xs text-gray-500">
                React batches all <code>setCount</code> calls in a single event handler into one re-render.
                The <strong>wrong</strong> version reads the stale <code>count</code> snapshot three times, so only +1 is applied.
                The <strong>correct</strong> version uses the functional updater, which chains off the latest pending value.
            </p>
        </div>
    );
};

const UseState: React.FC = () => (
    <div className="max-w-xl mx-auto space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">useState</h1>
            <p className="mt-1 text-gray-600 text-sm">
                Declares a state variable that persists across renders. Calling its setter
                schedules a re-render with the new value. Always prefer the{' '}
                <strong>functional updater</strong> form (<code>setState(prev =&gt; …)</code>)
                when the next value depends on the previous one — it avoids stale reads in concurrent mode.
            </p>
        </div>

        <section className="border border-gray-200 rounded-xl p-4 space-y-3">
            <h2 className="font-semibold text-gray-700">Primitive state — counter</h2>
            <p className="text-xs text-gray-500">Simple number. Uses functional updater <code>setCount(c =&gt; c ± 1)</code>.</p>
            <Counter />
        </section>

        <section className="border border-gray-200 rounded-xl p-4 space-y-3">
            <h2 className="font-semibold text-gray-700">Array state — todo list</h2>
            <p className="text-xs text-gray-500">
                Never mutate state directly. Return a new array:{' '}
                <code>…spread</code> to add, <code>map</code> to update, <code>filter</code> to remove.
            </p>
            <TodoList />
        </section>

        <section className="border border-gray-200 rounded-xl p-4 space-y-3">
            <h2 className="font-semibold text-gray-700">Batch updates</h2>
            <p className="text-xs text-gray-500">
                Multiple <code>setState</code> calls in one handler are batched into a single re-render.
                Use the functional updater to chain off the latest pending value.
            </p>
            <BatchUpdates />
        </section>
    </div>
);

export default UseState;
