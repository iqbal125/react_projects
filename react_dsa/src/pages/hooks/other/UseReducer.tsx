import React, { useReducer, useState } from 'react';

interface Todo { id: number; text: string; done: boolean; }

type Action =
    | { type: 'ADD'; text: string }
    | { type: 'TOGGLE'; id: number }
    | { type: 'REMOVE'; id: number };

function todoReducer(state: Todo[], action: Action): Todo[] {
    switch (action.type) {
        case 'ADD':
            return [...state, { id: Date.now(), text: action.text, done: false }];
        case 'TOGGLE':
            return state.map((t) => t.id === action.id ? { ...t, done: !t.done } : t);
        case 'REMOVE':
            return state.filter((t) => t.id !== action.id);
        default:
            return state;
    }
}

const UseReducer: React.FC = () => {
    const [todos, dispatch] = useReducer(todoReducer, []);
    const [input, setInput] = useState('');

    const add = () => {
        const t = input.trim();
        if (!t) return;
        dispatch({ type: 'ADD', text: t });
        setInput('');
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">useReducer</h1>
                <p className="mt-1 text-gray-600 text-sm">
                    An alternative to <code>useState</code> for complex state logic. You describe{' '}
                    <em>what happened</em> (an action), and a pure reducer function computes the next state.
                    Prefer <code>useReducer</code> when state has multiple sub-values that update together,
                    or when the logic is complex enough to benefit from being extracted and tested in isolation.
                </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-4 text-xs font-mono space-y-1">
                <div className="text-gray-400">// Action union</div>
                <div><span className="text-blue-400">ADD</span><span className="text-gray-300"> — append a new todo</span></div>
                <div><span className="text-green-400">TOGGLE</span><span className="text-gray-300"> — flip done/undone by id</span></div>
                <div><span className="text-red-400">REMOVE</span><span className="text-gray-300"> — delete by id</span></div>
            </div>

            <section className="border border-gray-200 rounded-xl p-4 space-y-3">
                <h2 className="font-semibold text-gray-700">Todo list via <code>dispatch</code></h2>
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
                            <input
                                type="checkbox"
                                checked={td.done}
                                onChange={() => dispatch({ type: 'TOGGLE', id: td.id })}
                                className="cursor-pointer"
                            />
                            <span className={`flex-1 ${td.done ? 'line-through text-gray-400' : ''}`}>{td.text}</span>
                            <button
                                onClick={() => dispatch({ type: 'REMOVE', id: td.id })}
                                className="text-red-400 hover:text-red-600"
                            >✕</button>
                        </li>
                    ))}
                </ul>
                {todos.length === 0 && <p className="text-xs text-gray-400 italic">No todos yet.</p>}
            </section>

            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-xs text-amber-800">
                <strong>When to use:</strong> reach for <code>useReducer</code> when you have multiple action
                types, when state transitions involve several fields at once, or when you want testable
                pure-function logic outside the component.
            </div>
        </div>
    );
};

export default UseReducer;
