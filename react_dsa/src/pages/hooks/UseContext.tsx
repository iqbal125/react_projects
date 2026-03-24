import React, { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';
interface ThemeCtx { theme: Theme; toggle: () => void; }

const ThemeContext = createContext<ThemeCtx>({ theme: 'light', toggle: () => { } });

// ─── Leaf consumers ──────────────────────────────────────────
const Header: React.FC = () => {
    const { theme, toggle } = useContext(ThemeContext);
    return (
        <div className={`rounded-lg px-4 py-3 flex justify-between items-center transition-colors ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
            <span className="font-semibold text-sm">Header</span>
            <button onClick={toggle} className="text-xs px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                Toggle ({theme})
            </button>
        </div>
    );
};

const Card: React.FC = () => {
    const { theme } = useContext(ThemeContext);
    return (
        <div className={`rounded-lg px-4 py-3 transition-colors ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-white border border-gray-200 text-gray-700'}`}>
            <span className="font-medium text-sm">Card</span>
            <p className="text-xs mt-1 opacity-70">Reads the same context — no props needed.</p>
        </div>
    );
};

// ─── Intermediate component — receives NO theme prop ─────────
const Page: React.FC = () => (
    <div className="space-y-2">
        <Header />
        <Card />
    </div>
);

const UseContext: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('light');
    const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">useContext</h1>
                <p className="mt-1 text-gray-600 text-sm">
                    Reads a value from the nearest matching <code>Context.Provider</code> above in the tree —
                    without prop-drilling through intermediate components. Any consumer re-renders when
                    the context value changes. Context is not a replacement for all state — use it for
                    genuinely global data (theme, auth, locale).
                </p>
            </div>

            <ThemeContext.Provider value={{ theme, toggle }}>
                <section className="border border-gray-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-gray-700">Live demo</h2>
                        <span className="text-xs text-gray-400">
                            <code>Page</code> receives no props — context flows directly to consumers
                        </span>
                    </div>
                    <Page />
                </section>
            </ThemeContext.Provider>

            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-xs text-blue-800">
                <strong>Note:</strong> <code>Page</code> is an intermediate component that passes{' '}
                <em>nothing</em> down. Both <code>Header</code> and <code>Card</code> call{' '}
                <code>useContext(ThemeContext)</code> directly.
            </div>
        </div>
    );
};

export default UseContext;
