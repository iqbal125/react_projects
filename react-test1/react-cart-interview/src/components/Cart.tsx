import type { CartItem } from '../types';
import { fmt } from '../utils/pricing';

interface Props {
  items: CartItem[];
  onRemove: (productId: number) => void;
  onUpdateQty: (productId: number, quantity: number) => void;
}

export default function Cart({ items, onRemove, onUpdateQty }: Props) {
  if (items.length === 0) {
    return (
      <div className="cart cart--empty">
        <h2>Cart</h2>
        <p className="empty-state">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Cart ({items.reduce((s, i) => s + i.quantity, 0)})</h2>
      <ul className="cart__list" role="list">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="cart__item">
            <div className="cart__item-info">
              <span className="cart__item-name">{product.name}</span>
              <span className="cart__item-price">{fmt(product.price)}</span>
            </div>
            <div className="cart__item-controls">
              <button
                className="qty-btn"
                aria-label={`Decrease quantity of ${product.name}`}
                onClick={() => onUpdateQty(product.id, quantity - 1)}
              >
                −
              </button>
              <span className="qty-value" aria-label={`Quantity: ${quantity}`}>
                {quantity}
              </span>
              <button
                className="qty-btn"
                aria-label={`Increase quantity of ${product.name}`}
                onClick={() => onUpdateQty(product.id, quantity + 1)}
              >
                +
              </button>
              <button
                className="btn btn--danger btn--sm"
                aria-label={`Remove ${product.name} from cart`}
                onClick={() => onRemove(product.id)}
              >
                Remove
              </button>
            </div>
            <div className="cart__item-line-total">
              {fmt(product.price * quantity)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
