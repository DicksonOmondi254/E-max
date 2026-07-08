import "./FlashSale.css";

import Countdown from "./Countdown";
import FlashSaleCard from "./FlashSaleCard";

const flashProducts = [
  {
    name: "iPhone 16 Pro",
    image: "/images/iphone.png",
    price: 185000,
    oldPrice: 205000,
    rating: 4.9,
    discount: 10,
  },
  {
    name: "Galaxy S25 Ultra",
    image: "/images/samsung.png",
    price: 170000,
    oldPrice: 190000,
    rating: 4.8,
    discount: 11,
  },
  {
    name: "MacBook Pro M4",
    image: "/images/macbook.png",
    price: 320000,
    oldPrice: 350000,
    rating: 5.0,
    discount: 9,
  },
  {
    name: "Sony WH-1000XM5",
    image: "/images/sony.png",
    price: 58000,
    oldPrice: 65000,
    rating: 4.7,
    discount: 12,
  },
];

const FlashSale = () => {
  return (
    <section className="flash-sale">

      <div className="flash-header">

        <div>
          <h2>🔥 Flash Sale</h2>
          <p>Limited-time offers on genuine electronics.</p>
        </div>

        <Countdown />

      </div>

      <div className="flash-grid">

        {flashProducts.map((product) => (
          <FlashSaleCard
            key={product.name}
            {...product}
          />
        ))}

      </div>

    </section>
  );
};

export default FlashSale;