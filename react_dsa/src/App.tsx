import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';

// Hooks
import UseState from './pages/hooks/UseState';
import UseReducer from './pages/hooks/other/UseReducer';
import UseContext from './pages/hooks/UseContext';
import UseRef from './pages/hooks/UseRef';
import UseEffect from './pages/hooks/UseEffect';
import UseLayoutEffect from './pages/hooks/other/UseLayoutEffect';
import UseMemo from './pages/hooks/UseMemo';
import UseCallback from './pages/hooks/UseCallback';
import UseTransition from './pages/hooks/other/UseTransition';
import UseDeferredValue from './pages/hooks/other/UseDeferredValue';

// Pitfalls
import StaleClosure from './pages/pitfalls/StaleClosure';
import InfiniteLoop from './pages/pitfalls/InfiniteLoop';
import ObjectDependency from './pages/pitfalls/ObjectDependency';
import KeyReconciliation from './pages/pitfalls/KeyReconciliation';
import DerivedStateDesync from './pages/pitfalls/DerivedStateDesync';

// Patterns
import DerivedState from './pages/patterns/DerivedState';
import DataFetching from './pages/patterns/DataFetching';
import DebouncingThrottling from './pages/patterns/DebouncingThrottling';

const navGroups = [
  {
    label: 'Hooks',
    links: [
      { to: '/hooks/usestate', label: 'useState' },
      { to: '/hooks/usereducer', label: 'useReducer' },
      { to: '/hooks/usecontext', label: 'useContext' },
      { to: '/hooks/useref', label: 'useRef' },
      { to: '/hooks/useeffect', label: 'useEffect' },
      { to: '/hooks/uselayouteffect', label: 'useLayoutEffect' },
      { to: '/hooks/usememo', label: 'useMemo' },
      { to: '/hooks/usecallback', label: 'useCallback' },
      { to: '/hooks/usetransition', label: 'useTransition' },
      { to: '/hooks/usedeferredvalue', label: 'useDeferredValue' },
    ],
  },
  {
    label: 'Pitfalls',
    links: [
      { to: '/pitfalls/stale-closure', label: 'Stale Closure' },
      { to: '/pitfalls/infinite-loop', label: 'Infinite Loop' },
      { to: '/pitfalls/object-dependency', label: 'Object Dependency' },
      { to: '/pitfalls/key-reconciliation', label: 'Key Reconciliation' },
      { to: '/pitfalls/derived-state-desync', label: 'Derived State Desync' },
    ],
  },
  {
    label: 'Patterns',
    links: [
      { to: '/patterns/derived-state', label: 'Derived State' },
      { to: '/patterns/data-fetching', label: 'Data Fetching' },
      { to: '/patterns/debouncing', label: 'Debouncing & Throttling' },
    ],
  },
];

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <header className="bg-white border-b border-gray-200 mb-6">
              <nav className="px-6 py-4 space-y-3">
                <Link
                  to="/"
                  className="inline-block text-gray-700 hover:text-blue-600 font-semibold text-sm transition-colors"
                >
                  Home
                </Link>
                {navGroups.map((group) => (
                  <div key={group.label}>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                      {group.label}
                    </span>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {group.links.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className="text-gray-600 hover:text-blue-600 font-mono text-sm transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </header>
            <div className="p-6">
              <Routes>
                <Route path="/" element={<Home />} />
                {/* Hooks */}
                <Route path="/hooks/usestate" element={<UseState />} />
                <Route path="/hooks/usereducer" element={<UseReducer />} />
                <Route path="/hooks/usecontext" element={<UseContext />} />
                <Route path="/hooks/useref" element={<UseRef />} />
                <Route path="/hooks/useeffect" element={<UseEffect />} />
                <Route path="/hooks/uselayouteffect" element={<UseLayoutEffect />} />
                <Route path="/hooks/usememo" element={<UseMemo />} />
                <Route path="/hooks/usecallback" element={<UseCallback />} />
                <Route path="/hooks/usetransition" element={<UseTransition />} />
                <Route path="/hooks/usedeferredvalue" element={<UseDeferredValue />} />
                {/* Pitfalls */}
                <Route path="/pitfalls/stale-closure" element={<StaleClosure />} />
                <Route path="/pitfalls/infinite-loop" element={<InfiniteLoop />} />
                <Route path="/pitfalls/object-dependency" element={<ObjectDependency />} />
                <Route path="/pitfalls/key-reconciliation" element={<KeyReconciliation />} />
                <Route path="/pitfalls/derived-state-desync" element={<DerivedStateDesync />} />
                {/* Patterns */}
                <Route path="/patterns/derived-state" element={<DerivedState />} />
                <Route path="/patterns/data-fetching" element={<DataFetching />} />
                <Route path="/patterns/debouncing" element={<DebouncingThrottling />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default App;
