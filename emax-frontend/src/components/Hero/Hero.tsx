import "./Hero.css";

import CategorySidebar from "../CategorySidebar/CategorySidebar";
import BrandShowcase from "../BrandShowcase/BrandShowcase";
import HeroSlider from "../HeroSlider/HeroSlider";
import SideTabs from "../SideTabs/SideTabs";

const Hero = () => {
  return (
    <section className="hero-container">
      {/* Compact side tab (Categories + Brands) */}
      <div className="hero-side">
        <SideTabs
          categoriesNode={<CategorySidebar />}
          brandsNode={<BrandShowcase />}
        />

      </div>



      {/* Main Hero Banner */}
      <HeroSlider />
    </section>
  );
};

export default Hero;

