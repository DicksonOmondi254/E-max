import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HeroSlider.css";
import { slides } from "./sliderData";

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => setCurrent(index);
  const next = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  const slide = slides[current];

  return (
    <section className="hero-slider">
      <div className="hero-slider__inner">
        <div className="hero-slider__slide" style={{ background: slide.background }}>
<div className="hero-slider__content">
            {slide.badge && <span className="hero-slider__badge">{slide.badge}</span>}
            {slide.eyebrow && (
              <span className="hero-slider__eyebrow">{slide.eyebrow}</span>
            )}
            <h1 className="hero-slider__title">{slide.title}</h1>
            <p className="hero-slider__subtitle">{slide.subtitle}</p>
            <Link to={slide.link || "/products"} className="hero-slider__cta">
              {slide.button} →
            </Link>
          </div>
          <div className="hero-slider__image">
            <img src={slide.image} alt={slide.title} />
          </div>
        </div>

        <button
          className="hero-slider__arrow hero-slider__arrow--left"
          onClick={prev}
          aria-label="Previous"
        >
          ❮
        </button>
        <button
          className="hero-slider__arrow hero-slider__arrow--right"
          onClick={next}
          aria-label="Next"
        >
          ❯
        </button>

        <div className="hero-slider__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-slider__dot ${i === current ? "hero-slider__dot--active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;

