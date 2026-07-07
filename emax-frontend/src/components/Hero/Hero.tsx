import "./Hero.css";

export default function Hero() {
    return (
        <section className="hero">

            <div className="hero-left">

                <h1>
                    Genuine Electronics
                    <br />
                    Without the Hassle
                </h1>

                <p>

                    Phones

                    Laptops

                    Smart Watches

                    Accessories

                    Gaming

                    Networking

                </p>

                <button>

                    Shop Now

                </button>

            </div>

            <div className="hero-right">

                <img
                    src="/images/hero-banner.png"
                    alt="E-Max"
                />

            </div>

        </section>
    );
}