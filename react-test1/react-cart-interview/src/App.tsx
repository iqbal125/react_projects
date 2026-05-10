import { useState } from 'react';
import { usePersistedCart } from './state/usePersistedCart';
import type { Product, CheckoutFormValues } from './types';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import OrderSummary from './components/OrderSummary';
import CheckoutForm from './components/CheckoutForm';
import './App.css';

export default function App() {
  const [cart, dispatch] = usePersistedCart();
  const [discountCode, setDiscountCode] = useState('');
  const [cartOpen, setCartOpen] = useState(false);

  function handleAdd(product: Product) {
    dispatch({ type: 'ADD_ITEM', product });
    setCartOpen(true);
  }

  function handleRemove(productId: number) {
    dispatch({ type: 'REMOVE_ITEM', productId });
  }

  function handleUpdateQty(productId: number, quantity: number) {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  }

  function handleCheckout(values: CheckoutFormValues) {
    console.log('Order submitted:', { cart: cart.items, ...values });
  }

  const totalItems = cart.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>ShopReact</h1>
        <button
          className="cart-toggle"
          aria-label={`Toggle cart, ${totalItems} items`}
          onClick={() => setCartOpen((o) => !o)}
        >
          🛒 {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          {cartOpen ? 'Hide cart' : 'Show cart'}
        </button>
      </header>

      <div className="app-layout">
        <main className="app-main">
          <ProductList cartItems={cart.items} onAdd={handleAdd} />
        </main>

        <aside className={`app-sidebar${cartOpen ? ' app-sidebar--open' : ''}`}>
          <Cart
            items={cart.items}
            onRemove={handleRemove}
            onUpdateQty={handleUpdateQty}
          />
          <OrderSummary items={cart.items} discountCode={discountCode} />
          <CheckoutForm
            discountCode={discountCode}
            onDiscountChange={setDiscountCode}
            onSubmit={handleCheckout}
            disabled={cart.items.length === 0}
          />
        </aside>
      </div>
    </div>
  );
}
