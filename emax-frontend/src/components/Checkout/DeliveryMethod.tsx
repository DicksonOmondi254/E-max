const DeliveryMethod = () => {
  return (
    <section className="checkout-card">

      <h2>Delivery Method</h2>

      <label>

        <input
          type="radio"
          name="delivery"
          defaultChecked
        />

        Standard Delivery (2-3 Days)

      </label>

      <label>

        <input
          type="radio"
          name="delivery"
        />

        Express Delivery (Same Day)

      </label>

      <label>

        <input
          type="radio"
          name="delivery"
        />

        Pick-up Station

      </label>

    </section>
  );
};

export default DeliveryMethod;