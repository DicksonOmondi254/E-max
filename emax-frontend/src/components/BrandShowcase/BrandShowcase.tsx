import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { brandService } from "../../services/brandService";


import "./BrandShowcase.css";

type Brand = {
  id: number;
  name: string;
};



const BrandShowcase = () => {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const brandData = await brandService.getAllBrands();
        setBrands(brandData);
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, []);


  return (
    <section className="brands">
      <h2>Top Brands</h2>

      <div className="brand-grid">
        {brands.map((brand) => {
          return (

            <div
              key={brand.id}
              className="brand-card"
            >
              <div className="brand-card__name">
                <span>{brand.name}</span>
              </div>

              <Link
                to={`/brands/${brand.id}`}
                className="brand-card__cta"
              >
                View products
              </Link>

            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BrandShowcase;

