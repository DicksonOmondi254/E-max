import { useState } from "react";

const images = [
  "/images/iphone.png",
  "/images/iphone-back.png",
  "/images/iphone-side.png",
  "/images/iphone-box.png",
];

const ProductGallery = () => {
  const [selected, setSelected] = useState(images[0]);

  return (
    <div className="gallery">

      <div className="main-image">
        <img src={selected} alt="Product" />
      </div>

      <div className="thumbnails">
        {images.map((image) => (
          <img
            key={image}
            src={image}
            onClick={() => setSelected(image)}
            className={selected === image ? "active" : ""}
            alt=""
          />
        ))}
      </div>

    </div>
  );
};

export default ProductGallery;