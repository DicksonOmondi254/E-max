import TopBar from "../components/TopBar/TopBar";
import MainHeader from "../components/MainHeader/MainHeader";
import HeroSection from "../components/HeroSection/HeroSection";
import RewardsBanner from "../components/RewardsBanner/RewardsBanner";
import Categories from "../components/Categories/Categories";
import HotCategories from "../components/HotCategories/HotCategories";
import FlashSale from "../components/FlashSale/FlashSale";
import FeaturedProducts from "../components/FeaturedProducts/FeaturedProducts";
import Newsletter from "../components/Newsletter/Newsletter";
import FloatingActions from "../components/FloatingActions/FloatingActions";
import "../styles/homeLanding.css";

const Home = () => {
  return (
    <div className="home-landing">
      {/* ── Utility Top Bar ─────────────── */}
      <TopBar />

      {/* ── Main Search Header ──────────── */}
      <MainHeader />

      {/* ── Gamified Rewards Banner ─────── */}
      <RewardsBanner />

      {/* ── Hero (Category Sidebar + Banner) ── */}
      <HeroSection />

      {/* ── Categories ─────────────────── */}
      <Categories />

      {/* ── Hot Categories Quick-Grid ──── */}
      <HotCategories />

      {/* ── Flash Sale ─────────────────── */}
      <FlashSale />

      {/* ── Featured Products ──────────── */}
      <FeaturedProducts />

      {/* ── Newsletter ─────────────────── */}
      <Newsletter />

      {/* ── Floating Action Dock ───────── */}
      <FloatingActions />
    </div>
  );
};

export default Home;
