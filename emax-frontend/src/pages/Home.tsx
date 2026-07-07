import Hero from "../components/Hero/Hero";
import Categories from "../components/Categories/Categories";
import FeaturedProducts from "../components/FeaturedProducts/FeaturedProducts";

export default function Home() {
    return (
        <>
            <Hero />
            <Categories />
            <FeaturedProducts />
        </>
    );
}