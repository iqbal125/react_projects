import type { CartItem, OrderTotals } from '../types';

const TAX_RATE = 0.08; // 8%
const SHIPPING_FREE_THRESHOLD = 75;
const SHIPPING_STANDARD = 7.99;
const SHIPPING_EXPRESS_THRESHOLD = 150;
const SHIPPING_EXPRESS = 14.99;

const DISCOUNT_CODES: Record<string, number> = {
  SAVE10: 0.10,
  SAVE20: 0.20,
  HALFOFF: 0.50,
};

export function computeSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function computeDiscount(subtotal: number, code: string): number {
  const rate = DISCOUNT_CODES[code.toUpperCase()];
  if (!rate) return 0;
  return subtotal * rate;
}

export function computeShipping(subtotal: number): number {
  if (subtotal >= SHIPPING_FREE_THRESHOLD) return 0;
  if (subtotal >= SHIPPING_EXPRESS_THRESHOLD) return SHIPPING_EXPRESS;
  return SHIPPING_STANDARD;
}

export function computeTax(subtotal: number, discount: number): number {
  return (subtotal - discount) * TAX_RATE;
}

export function computeTotals(items: CartItem[], discountCode: string): OrderTotals {
  const subtotal = computeSubtotal(items);
  const discount = computeDiscount(subtotal, discountCode);
  const taxable = subtotal - discount;
  const tax = computeTax(subtotal, discount);
  const shipping = computeShipping(taxable);
  const total = taxable + tax + shipping;

  return { subtotal, discount, tax, shipping, total };
}

export function fmt(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
