const MpesaPayment = () => {
  return (
    <div>

      <h3>M-Pesa Express</h3>

      <input
        placeholder="07XXXXXXXX"
      />

      <button className="pay-btn">
        Send STK Push
      </button>

    </div>
  );
};

export default MpesaPayment;