import type { Slide as SlideType } from "./sliderData";

interface Props {
  slide: SlideType;
}

const Slide = ({ slide }: Props) => {
  return (
    <div
      className="slide"
      style={{ background: slide.background }}
    >
      <div className="slide-content">
        <h1>{slide.title}</h1>

        <p>{slide.subtitle}</p>

        <button>{slide.button}</button>
      </div>

      <div className="slide-image">
        <img src={slide.image} alt={slide.title} />
      </div>
    </div>
  );
};

export default Slide;