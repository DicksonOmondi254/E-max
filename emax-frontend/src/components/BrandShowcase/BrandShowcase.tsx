import "./BrandShowcase.css";

const brands=[

"Apple",

"Samsung",

"HP",

"Dell",

"Lenovo",

"Sony",

"JBL",

"Asus"

];

const BrandShowcase=()=>{

return(

<section className="brands">

<h2>

Top Brands

</h2>

<div className="brand-grid">

{

brands.map(brand=>(

<div key={brand} className="brand-card">

{brand}

</div>

))

}

</div>

</section>

)

}

export default BrandShowcase;