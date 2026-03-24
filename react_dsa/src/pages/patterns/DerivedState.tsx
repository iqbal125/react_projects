import React, { useState } from 'react';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
}

const PRODUCTS: Product[] = [
    { id: 1, name: 'Laptop', category: 'Electronics', price: 999 },
    { id: 2, name: 'Headphones', category: 'Electronics', price: 79 },
    { id: 3, name: 'Coffee Mug', category: 'Kitchen', price: 12 },
    { id: 4, name: 'Notebook', category: 'Office', price: 5 },
    { id: 5, name: 'Desk Lamp', category: 'Office', price: 35 },
    { id: 6, name: 'Blender', category: 'Kitchen', price: 45 },
    { id: 7, name: 'Keyboard', category: 'Electronics', price: 65 },
    { id: 8, name: 'Water Bottle', category: 'Kitchen', price: 18 },
];

const categories = ['All', ...new Set(PRODUCTS.map((p) => p.category))];

const DerivedState: React.FC = () => {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortAsc, setSortAsc] = useState(true);

    // ─── All derived — computed on every render from state ───────
    // No useEffect, no extra state, no synchronisation risk.
    const filteredProducts = PRODUCTS.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => (sortAsc ? a.price - b.price : b.price - a.price));

    const totalPrice = filteredProducts.reduce((sum, p) => sum + p.price, 0);

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Pattern: Derived State</h1>
                <p className="mt-1 text-gray-600 text-sm">
                    Filter, sort, and aggregate are computed directly from state on each render —
                    no <code>useEffect</code> to sync results, no extra state variables.
                    The rule: <strong>if a value can be computed from existing state or props, derive it.</strong>
                </p>
            </div>

            <div className="flex flex-wrap gap-3">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products…"
                    className="flex-1 min-w-[160px] border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <button
                    onClick={() => setSortAsc((prev) => !prev)}
                    className="bg-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300 text-sm"
                >
                    Price: {sortAsc ? '↑ Low–High' : '↓ High–Low'}
                </button>
            </div>

            {filteredProducts.length === 0 ? (
                <p className="text-gray-400 italic text-sm">No products match your filters.</p>
            ) : (
                <ul className="space-y-2">
                    {filteredProducts.map((p) => (
                        <li key={p.id} className="flex justify-between bg-gray-100 rounded-lg px-4 py-2">
                            <div>
                                <span className="font-medium">{p.name}</span>
                                <span className="ml-2 text-xs text-gray-500">{p.category}</span>
                            </div>
                            <span className="text-gray-700">${p.price}</span>
                        </li>
                    ))}
                </ul>
            )}

            <div className="text-sm text-gray-500">
                Showing {filteredProducts.length} of {PRODUCTS.length} — Total: ${totalPrice}
            </div>
        </div>
    );
};

export default DerivedState;
