import ProductCard from "../ProductCard/ProductCard";
import { products } from "../../data/products";

export default function ProductGrid(){

return(

<div className="grid grid-cols-4 gap-6">

{

products.map(product=>(

<ProductCard

id={product.id}

name={product.name}

price={product.price}

image={product.image}

/>

))

}

</div>

)

}