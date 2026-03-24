# Pitfalls

Common React bugs — each file shows the broken pattern, explains why it happens, and demonstrates the fix(es).

| File | Pitfall | Root cause |
|---|---|---|
| [StaleClosure.tsx](StaleClosure.tsx) | **Stale closure** | Async callback captures values from an old render |
| [InfiniteLoop.tsx](InfiniteLoop.tsx) | **Infinite effect loop** | Effect updates state it depends on, with no exit |
| [ObjectDependency.tsx](ObjectDependency.tsx) | **Object dependency trap** | Inline objects have new references every render |
| [KeyReconciliation.tsx](KeyReconciliation.tsx) | **Key reconciliation bug** | Index keys cause state to attach to the wrong item |
| [DerivedStateDesync.tsx](DerivedStateDesync.tsx) | **Derived state desync** | Computed value stored as state drifts from its source |

## Quick reference

**Stale closure** — fix: correct deps, functional updater, or `useRef` for latest value.

**Infinite loop** — fix: derive the value instead of using an effect to sync it.

**Object dependency** — fix: depend on primitives; build the object inside the effect or memoize it.

**Key reconciliation** — fix: always use stable unique IDs as keys for dynamic lists.

**Derived state desync** — fix: compute inline during render; no extra state needed.
