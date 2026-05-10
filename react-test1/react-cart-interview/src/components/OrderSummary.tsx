import { useMemo } from 'react';
import type { CartItem } from '../types';
import { computeTotals, fmt } from '../utils/pricing';

interface Props {
  items: CartItem[];
  discountCode: string;
}

export default function OrderSummary({ items, discountCode }: Props) {
  // Totals are always derived from cart state — never stored separately.
  // useMemo keeps this from recalculating on unrelated renders.
  const { subtotal, discount, tax, shipping, total } = useMemo(
    () => computeTotals(items, discountCode),
    [items, discountCode]
  );

  const freeShippingThreshold = 75;
  const remaining = freeShippingThreshold - subtotal;

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>

      {items.length > 0 && remaining > 0 && (
        <p className="free-shipping-notice">
          Add {fmt(remaining)} more for free shipping!
        </p>
      )}

      <dl className="summary-list">
        <dt>Subtotal</dt>
        <dd>{fmt(subtotal)}</dd>

        {discount > 0 && (
          <>
            <dt className="discount-label">Discount</dt>
            <dd className="discount-value">− {fmt(discount)}</dd>
          </>
        )}

        <dt>Tax (8%)</dt>
        <dd>{fmt(tax)}</dd>

        <dt>Shipping</dt>
        <dd>{shipping === 0 ? 'Free' : fmt(shipping)}</dd>
      </dl>

      <div className="summary-total">
        <span>Total</span>
        <span>{fmt(total)}</span>
      </div>
    </div>
  );
}
