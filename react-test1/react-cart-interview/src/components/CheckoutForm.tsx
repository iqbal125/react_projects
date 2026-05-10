import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import type { CheckoutFormValues } from '../types';

interface Props {
  discountCode: string;
  onDiscountChange: (code: string) => void;
  onSubmit: (values: CheckoutFormValues) => void;
  disabled: boolean;
}

const EMPTY: CheckoutFormValues = {
  name: '',
  email: '',
  address: '',
  city: '',
  zip: '',
  discountCode: '',
};

export default function CheckoutForm({ discountCode, onDiscountChange, onSubmit, disabled }: Props) {
  const [form, setForm] = useState<CheckoutFormValues>({ ...EMPTY, discountCode });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'discountCode') onDiscountChange(value);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    onSubmit(form);
  }

  if (submitted) {
    return (
      <div className="checkout-form checkout-form--success" role="alert">
        <h2>Order placed!</h2>
        <p>Thanks, {form.name}. A confirmation will be sent to {form.email}.</p>
        <button className="btn btn--secondary" onClick={() => setSubmitted(false)}>
          Place another order
        </button>
      </div>
    );
  }

  return (
    <form className="checkout-form" onSubmit={handleSubmit} noValidate>
      <h2>Checkout</h2>

      <fieldset>
        <legend>Contact</legend>

        <div className="form-field">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend>Shipping address</legend>

        <div className="form-field">
          <label htmlFor="address">Street address</label>
          <input
            id="address"
            name="address"
            type="text"
            autoComplete="street-address"
            required
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-field form-field--row">
          <div className="form-field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              type="text"
              autoComplete="address-level2"
              required
              value={form.city}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="zip">ZIP code</label>
            <input
              id="zip"
              name="zip"
              type="text"
              autoComplete="postal-code"
              required
              pattern="\d{5}(-\d{4})?"
              value={form.zip}
              onChange={handleChange}
            />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Discount</legend>
        <div className="form-field">
          <label htmlFor="discountCode">Discount code</label>
          <input
            id="discountCode"
            name="discountCode"
            type="text"
            placeholder="e.g. SAVE10"
            value={form.discountCode}
            onChange={handleChange}
          />
          <small>Try: SAVE10, SAVE20, HALFOFF</small>
        </div>
      </fieldset>

      <button
        type="submit"
        className="btn btn--primary btn--full"
        disabled={disabled}
      >
        {disabled ? 'Add items to place order' : 'Place order'}
      </button>
    </form>
  );
}
