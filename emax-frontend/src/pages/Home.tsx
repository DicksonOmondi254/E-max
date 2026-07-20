import { Link } from "react-router-dom";

import Hero from "../components/Hero/Hero";
import FlashSale from "../components/FlashSale/FlashSale";
import FeaturedProducts from "../components/FeaturedProducts/FeaturedProducts";

import Newsletter from "../components/Newsletter/Newsletter";

import "../styles/homeLanding.css";

const Home = () => {
  return (
    <>
      <section className="landing-hero">
        <div className="landing-hero__inner">
          <div className="landing-hero__copy">
            <h1>
              E-Max Deals
              <span className="landing-hero__accent"> Delivered</span>
            </h1>

            <p>
              Shop electronics, accessories and more. Fast delivery, real
              value, and easy checkout.
            </p>

            <div className="landing-hero__cta">
              <Link className="btn btn--primary" to="/products">
                Shop Now
              </Link>
              <Link className="btn btn--ghost" to="/login">
                Login
              </Link>
              <Link className="btn btn--ghost" to="/register">
                Register
              </Link>
            </div>

            {/* landing page features removed */}
            <div className="landing-hero__features" style={{display:"none"}}>
              {/* (captions removed per request) */}
              <div className="feature">
                <div className="feature__icon">🛒</div>
                <div>
                  <div className="feature__title">Cart & Checkout</div>
                  <div className="feature__desc">Add items instantly</div>
                </div>
              </div>
              <div className="feature">
                <div className="feature__icon">⚡</div>
                <div>
                  <div className="feature__title">Fast Offers</div>
                  <div className="feature__desc">Flash sales & discounts</div>
                </div>
              </div>
              <div className="feature">
                <div className="feature__icon">📦</div>
                <div>
                  <div className="feature__title">Easy Delivery</div>
                  <div className="feature__desc">Clear checkout steps</div>
                </div>
              </div>
            </div>
          </div>

          <div className="landing-hero__panel" aria-hidden>
            <div className="landing-hero__panelTop">
              <div className="landing-hero__badge">New</div>
              <div className="landing-hero__cartPreview">🛍️ Cart</div>
            </div>

            {/* bullets removed */}
            <ul className="landing-hero__bullets" style={{ display: "none" }} />

            <div className="landing-hero__panelBottom">
              <Link className="btn btn--primary" to="/register">
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Hero />
      <FlashSale />
      <FeaturedProducts />
      {/* Brand list is now inside the side tab (Categories + Brands) */}
      <Newsletter />


    </>
  );
};

export default Home;

