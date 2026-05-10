import type { Product, CartItem } from '../types';

interface Props {
  product: Product;
  cartItems: CartItem[];
  onAdd: (product: Product) => void;
}

export default function ProductCard({ product, cartItems, onAdd }: Props) {
  const inCart = cartItems.find((i) => i.product.id === product.id);

  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__meta">
          <span className="product-card__price">${product.price.toFixed(2)}</span>
          <span className="product-card__rating">★ {product.rating}</span>
        </div>
        {product.inStock ? (
          <button
            className="btn btn--primary"
            onClick={() => onAdd(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            {inCart ? `In cart (${inCart.quantity})` : 'Add to cart'}
          </button>
        ) : (
          <button className="btn btn--disabled" disabled aria-label="Out of stock">
            Out of stock
          </button>
        )}
      </div>
    </article>
  );
}
