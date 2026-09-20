import "./Newsletter.css";

const Newsletter = () => {
  return (
    <section className="newsletter">
      <div className="newsletter__inner">
        <h2>Stay in the Loop</h2>
        <p>
          Get exclusive deals, new arrivals and insider-only offers
          delivered straight to your inbox.
        </p>
        <form
          className="newsletter__form"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Enter your email address"
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;

