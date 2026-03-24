# Patterns

Practical React patterns that apply the hooks and concepts from this module.

| File | Pattern | Key idea |
|---|---|---|
| [DerivedState.tsx](DerivedState.tsx) | **Derived state** | Compute filter/sort/aggregates inline — no `useEffect`, no extra state |
| [DataFetching.tsx](DataFetching.tsx) | **Data fetching** | `fetch` in `useEffect` with `AbortController` cleanup and typed responses |
| [DebouncingThrottling.tsx](DebouncingThrottling.tsx) | **Debounce & throttle** | Custom hooks built on `useRef` + `useCallback` to control event frequency |

## When to use each

**Derived state** — whenever a value can be computed from state/props during render. Avoids the sync trap.

**Data fetching** — the baseline `useEffect` pattern before reaching for a data-fetching library (React Query, SWR).

**Debounce** — search inputs, API calls triggered by typing.

**Throttle** — scroll handlers, resize listeners, mouse position tracking.
