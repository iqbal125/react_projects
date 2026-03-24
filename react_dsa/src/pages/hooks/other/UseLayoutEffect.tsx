import React, { useLayoutEffect, useRef, useState } from 'react';

// Tooltip that positions itself above its anchor synchronously before paint
const Tooltip: React.FC<{ anchorEl: HTMLElement | null; label: string }> = ({ anchorEl, label }) => {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({ visibility: 'hidden', position: 'fixed' });

    // useLayoutEffect fires synchronously after DOM mutations but before the browser paints.
    // We measure the anchor and tooltip, then position the tooltip — no flash.
    useLayoutEffect(() => {
        if (!anchorEl || !tooltipRef.current) return;
        const a = anchorEl.getBoundingClientRect();
        const t = tooltipRef.current.getBoundingClientRect();
        setStyle({
            position: 'fixed',
            top: a.top - t.height - 8,
            left: a.left + a.width / 2 - t.width / 2,
            visibility: 'visible',
        });
    }, [anchorEl]);

    return (
        <div
            ref={tooltipRef}
            style={style}
            className="bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none z-50 whitespace-nowrap"
        >
            {label}
        </div>
    );
};

const UseLayoutEffect: React.FC = () => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">useLayoutEffect</h1>
                <p className="mt-1 text-gray-600 text-sm">
                    Fires <em>synchronously</em> after all DOM mutations but <em>before</em> the browser
                    paints. Use it when you must read layout (sizes, positions) and immediately write
                    back — otherwise you'd see a one-frame flash. In the vast majority of cases,{' '}
                    <code>useEffect</code> (async, after paint) is the right choice.
                    Reach for <code>useLayoutEffect</code> only for DOM measurement scenarios.
                </p>
            </div>

            <section className="border border-gray-200 rounded-xl p-4 space-y-4">
                <h2 className="font-semibold text-gray-700">Tooltip — positioned before paint</h2>
                <p className="text-xs text-gray-500">
                    <code>useLayoutEffect</code> measures both the anchor and tooltip synchronously
                    and sets <code>position: fixed</code> coordinates — the tooltip appears in the
                    correct place with no flicker.
                </p>
                <div className="flex justify-center py-8">
                    <button
                        onClick={(e) => setAnchor(anchor ? null : e.currentTarget)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        {anchor ? 'Hide tooltip' : 'Show tooltip'}
                    </button>
                </div>
                {anchor && <Tooltip anchorEl={anchor} label="Positioned synchronously via useLayoutEffect ✓" />}
            </section>

            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-xs text-amber-800">
                <strong>Caution:</strong> <code>useLayoutEffect</code> blocks the browser from painting.
                Heavy synchronous work here will delay the first visible frame. It is also skipped during
                server-side rendering — use <code>useEffect</code> for SSR-compatible code.
            </div>
        </div>
    );
};

export default UseLayoutEffect;
