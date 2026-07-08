const AddressForm = () => {
  return (
    <section className="checkout-card">

      <h2>Delivery Address</h2>

      <div className="form-grid">

        <input placeholder="First Name" />

        <input placeholder="Last Name" />

        <input placeholder="Phone Number" />

        <input placeholder="Email Address" />

        <select>

          <option>County</option>

          <option>Nairobi</option>

          <option>Mombasa</option>

          <option>Kisumu</option>

          <option>Uasin Gishu</option>

        </select>

        <input placeholder="Town" />

      </div>

      <textarea
        placeholder="Full Delivery Address"
      />

      <input placeholder="Nearest Landmark" />

    </section>
  );
};

export default AddressForm;