const CardPayment = () => {
  return (
    <div>

      <h3>Debit / Credit Card</h3>

      <input placeholder="Card Number" />

      <div className="card-row">

        <input placeholder="MM / YY" />

        <input placeholder="CVV" />

      </div>

      <input placeholder="Card Holder Name" />

      <button className="pay-btn">
        Pay Securely
      </button>

    </div>
  );
};

export default CardPayment;