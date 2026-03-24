import React, { useState, useEffect } from 'react';

// ─── Bug: derived value stored as state — drifts on prop change ─
const BugVersion: React.FC = () => {
    const [firstName, setFirstName] = useState('Jane');
    const [lastName, setLastName] = useState('Doe');
    // fullName is initialized once and never updated when props/state change
    const [fullName] = useState(firstName + ' ' + lastName);

    return (
        <div className="space-y-2">
            <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full border border-red-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
            />
            <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full border border-red-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
            />
            <p className="text-sm text-red-700">Full name: <strong>{fullName}</strong></p>
            <p className="text-xs text-gray-400">fullName never updates — it's stuck at the initial value.</p>
        </div>
    );
};

// ─── "Fix" people try: useEffect to sync ─────────────────────
// Works, but adds an extra render and unnecessary complexity.
const UseEffectFix: React.FC = () => {
    const [firstName, setFirstName] = useState('Jane');
    const [lastName, setLastName] = useState('Doe');
    const [fullName, setFullName] = useState(firstName + ' ' + lastName);

    useEffect(() => {
        setFullName(`${firstName} ${lastName}`);
    }, [firstName, lastName]);

    return (
        <div className="space-y-2">
            <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full border border-amber-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
            />
            <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full border border-amber-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
            />
            <p className="text-sm text-amber-700">Full name: <strong>{fullName}</strong></p>
            <p className="text-xs text-gray-400">Works, but causes an extra render + 3 state vars for 2 inputs.</p>
        </div>
    );
};

// ─── Best fix: derive directly ────────────────────────────────
const BestFix: React.FC = () => {
    const [firstName, setFirstName] = useState('Jane');
    const [lastName, setLastName] = useState('Doe');
    const fullName = `${firstName} ${lastName}`; // derived — always in sync

    return (
        <div className="space-y-2">
            <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full border border-green-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full border border-green-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-sm text-green-700">Full name: <strong>{fullName}</strong></p>
            <p className="text-xs text-gray-400">Derived inline — always in sync, no extra state or effects.</p>
        </div>
    );
};

const DerivedStateDesync: React.FC = () => (
    <div className="max-w-3xl mx-auto space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Pitfall: Derived State Desync</h1>
            <p className="mt-1 text-gray-600 text-sm">
                Storing a value that could be computed from existing state or props creates two
                sources of truth. When the source changes but the derived copy doesn't, they
                drift apart. The real fix is to compute the value inline during render — no
                extra state variable, no synchronization, no extra render.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <section className="border-2 border-red-200 rounded-xl p-4 space-y-2">
                <h2 className="text-sm font-semibold text-red-700">❌ Bug — stale initial state</h2>
                <p className="text-xs text-gray-500">fullName initialises correctly but never updates.</p>
                <BugVersion />
            </section>
            <section className="border-2 border-amber-200 rounded-xl p-4 space-y-2">
                <h2 className="text-sm font-semibold text-amber-700">⚠ "Fix" — useEffect sync</h2>
                <p className="text-xs text-gray-500">Works but adds an extra render + unnecessary complexity.</p>
                <UseEffectFix />
            </section>
            <section className="border-2 border-green-200 rounded-xl p-4 space-y-2">
                <h2 className="text-sm font-semibold text-green-700">✓ Best fix — derive it</h2>
                <p className="text-xs text-gray-500">Inline — always correct, zero overhead.</p>
                <BestFix />
            </section>
        </div>

        <div className="bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-600 border border-gray-200">
            <strong>Interview line:</strong> If a value can be computed from existing state or props
            during render, derive it. Storing derived state introduces synchronisation risk,
            extra state variables, and additional renders.
        </div>
    </div>
);

export default DerivedStateDesync;
