# React Basics

Three categories covering core React hooks, common pitfalls, and practical patterns.

---

## [hooks/](hooks/)

One file per hook — interactive demo + brief explanation.

| Hook | Description |
|---|---|
| `useState` | Primitive and array state, functional updaters |
| `useReducer` | Action-based state transitions |
| `useContext` | Context provider + consumers, no prop-drilling |
| `useRef` | DOM refs and mutable values without re-renders |
| `useEffect` | Side effects with cleanup (timers, listeners) |
| `useLayoutEffect` | Synchronous DOM measurement before paint |
| `useMemo` | Caching expensive computations |
| `useCallback` | Stable function references for memoized children |
| `useTransition` | Non-urgent state updates, keep input responsive |
| `useDeferredValue` | Deferred rendering of expensive child components |

---

## [pitfalls/](pitfalls/)

Bug pattern → why it happens → fix(es), side by side.

| Pitfall | One-liner |
|---|---|
| Stale closure | Async callback reads outdated state |
| Infinite effect loop | Effect updates what it depends on |
| Object dependency trap | Inline objects have new refs every render |
| Key reconciliation bug | Index keys let state attach to wrong item |
| Derived state desync | Stored copy drifts from its source |

---

## [patterns/](patterns/)

Idiomatic solutions to common UI problems.

| Pattern | One-liner |
|---|---|
| Derived state | Compute inline; never store what you can derive |
| Data fetching | `useEffect` + `AbortController` + typed responses |
| Debouncing & throttling | Custom hooks for high-frequency event control |
