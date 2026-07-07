import ProductCard from "../ProductCard/ProductCard";

const products=[

{

name:"iPhone 16 Pro",

price:185000,

image:"/images/iphone.png"

},

{

name:"Samsung S25 Ultra",

price:170000,

image:"/images/samsung.png"

},

{

name:"MacBook Pro M4",

price:310000,

image:"/images/macbook.png"

},

{

name:"Sony WH1000XM5",

price:55000,

image:"/images/sony.png"

}

];

export default function FeaturedProducts(){

return(

<section style={{padding:"60px"}}>

<h2>

Featured Products

</h2>

<div

style={{

display:"grid",

gridTemplateColumns:"repeat(4,1fr)",

gap:"20px",

marginTop:"30px"

}}

>

{

products.map(product=>(

<ProductCard

key={product.name}

{...product}

/>

))

}

</div>

</section>

)

}