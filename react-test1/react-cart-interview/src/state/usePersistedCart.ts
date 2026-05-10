import { useReducer, useEffect } from 'react';
import type { Dispatch } from 'react';
import type { CartState, CartAction } from '../types';
import { cartReducer, initialCartState } from './cartReducer';

const STORAGE_KEY = 'react-cart-interview:cart';

function loadCart(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CartState;
  } catch {
    // Corrupt data — fall through to default.
  }
  return initialCartState;
}

export function usePersistedCart(): [CartState, Dispatch<CartAction>] {
  const [cart, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  return [cart, dispatch];
}
