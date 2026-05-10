import { useMemo, useState } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/products';
import type { CartItem, Product, SortOption } from '../types';
import ProductCard from './ProductCard';

interface Props {
  cartItems: CartItem[];
  onAdd: (product: Product) => void;
}

export default function ProductList({ cartItems, onAdd }: Props) {
  const [category, setCategory] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState<SortOption>('default');

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

    if (category !== 'All') {
      list = list.filter((p) => p.category === category);
    }
    if (inStockOnly) {
      list = list.filter((p) => p.inStock);
    }
    if (minPrice !== '') {
      list = list.filter((p) => p.price >= parseFloat(minPrice));
    }
    if (maxPrice !== '') {
      list = list.filter((p) => p.price <= parseFloat(maxPrice));
    }

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        list.sort((a, b) => b.rating - a.rating);
        break;
    }

    return list;
  }, [category, inStockOnly, minPrice, maxPrice, sort]);

  return (
    <section className="product-list-section">
      <div className="filters" role="search" aria-label="Product filters">
        <div className="filters__row">
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label htmlFor="sort-select">Sort</label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating-desc">Highest Rated</option>
          </select>
        </div>

        <div className="filters__row">
          <label htmlFor="min-price">Min $</label>
          <input
            id="min-price"
            type="number"
            min={0}
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

          <label htmlFor="max-price">Max $</label>
          <input
            id="max-price"
            type="number"
            min={0}
            placeholder="Any"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          <label className="filters__checkbox">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            In stock only
          </label>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No products match your filters.</p>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartItems={cartItems}
              onAdd={onAdd}
            />
          ))}
        </div>
      )}
    </section>
  );
}
