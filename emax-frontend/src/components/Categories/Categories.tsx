import "./Categories.css";

const categories = [

"Phones",

"Laptops",

"Gaming",

"Audio",

"Networking",

"TVs",

"Accessories",

"Smart Home"

];

export default function Categories(){

return(

<section className="categories">

<h2>

Shop By Category

</h2>

<div className="category-grid">

{

categories.map((category)=>(

<div

className="category-card"

key={category}

>

{category}

</div>

))

}

</div>

</section>

)

}