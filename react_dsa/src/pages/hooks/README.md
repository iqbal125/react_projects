# Hooks

One file per hook — each contains a brief explanation and a live interactive demo.

## State hooks
| Hook | File | When to use |
|---|---|---|
| `useState` | [UseState.tsx](UseState.tsx) | Any simple state — primitives, arrays, objects |
| `useReducer` | [UseReducer.tsx](UseReducer.tsx) | Multiple related state fields, complex transitions, or testable logic |

## Context hook
| Hook | File | When to use |
|---|---|---|
| `useContext` | [UseContext.tsx](UseContext.tsx) | Globally shared data (theme, auth, locale) — avoids prop-drilling |

## Ref hook
| Hook | File | When to use |
|---|---|---|
| `useRef` | [UseRef.tsx](UseRef.tsx) | DOM node access, or a mutable value that shouldn't trigger re-renders |

## Effect hooks
| Hook | File | When to use |
|---|---|---|
| `useEffect` | [UseEffect.tsx](UseEffect.tsx) | Side effects that run after paint (timers, listeners, data fetching) |
| `useLayoutEffect` | [UseLayoutEffect.tsx](UseLayoutEffect.tsx) | Read/write DOM layout synchronously before paint; rare |

## Performance hooks
| Hook | File | When to use |
|---|---|---|
| `useMemo` | [UseMemo.tsx](UseMemo.tsx) | Cache an expensive computed value; re-run only when deps change |
| `useCallback` | [UseCallback.tsx](UseCallback.tsx) | Stable function reference for memoized children or effect deps |
| `useTransition` | [UseTransition.tsx](UseTransition.tsx) | Mark a state update as non-urgent; keep UI responsive during heavy renders |
| `useDeferredValue` | [UseDeferredValue.tsx](UseDeferredValue.tsx) | Defer a value for an expensive child you don't control |
