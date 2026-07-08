import Hero from "../components/Hero/Hero";
import FlashSale from "../components/FlashSale/FlashSale";
import FeaturedProducts from "../components/FeaturedProducts/FeaturedProducts";
import BrandShowcase from "../components/BrandShowcase/BrandShowcase";
import Newsletter from "../components/Newsletter/Newsletter";

const Home = () => {
  return (
    <>
      <Hero />
      <FlashSale />
      <FeaturedProducts />
      <BrandShowcase />
      <Newsletter />
    </>
  );
};

export default Home;