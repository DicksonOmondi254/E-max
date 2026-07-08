import "./Hero.css";

import CategorySidebar from "../CategorySidebar/CategorySidebar";
import HeroSlider from "../HeroSlider/HeroSlider";

const Hero = () => {
  return (
    <section className="hero-container">
      {/* Left Sidebar */}
      <CategorySidebar />

      {/* Main Hero Banner */}
      <HeroSlider />
    </section>
  );
};

export default Hero;