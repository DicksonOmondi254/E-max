import type { HeroSlide } from "./sliderData";

interface Props {
  slide: HeroSlide;
}

const Slide = ({ slide }: Props) => {
  return (
    <div
      className="slide"
      style={{ background: slide.background }}
    >
      <div className="slide-content">
        {slide.badge && <div className="slide-badge">{slide.badge}</div>}
        <h1>{slide.title}</h1>
        <p>{slide.subtitle}</p>
        <a href={slide.link || "/products"} className="slide-cta">
          {slide.button}
        </a>
      </div>
      <div className="slide-image">
        <img src={slide.image} alt={slide.title} />
      </div>
    </div>
  );
};

export default Slide;

