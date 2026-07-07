export interface Product {

    id:number;

    name:string;

    brand:string;

    category:string;

    price:number;

    rating:number;

    image:string;

    stock:number;

    discount:number;

}

export const products:Product[]=[

{

id:1,

name:"iPhone 16 Pro",

brand:"Apple",

category:"Phones",

price:185000,

rating:4.9,

image:"/images/iphone.png",

stock:15,

discount:10

},

{

id:2,

name:"Galaxy S25 Ultra",

brand:"Samsung",

category:"Phones",

price:170000,

rating:4.8,

image:"/images/samsung.png",

stock:20,

discount:8

},

{

id:3,

name:"MacBook Pro M4",

brand:"Apple",

category:"Laptops",

price:320000,

rating:5,

image:"/images/macbook.png",

stock:10,

discount:5

},

{

id:4,

name:"Sony WH-1000XM5",

brand:"Sony",

category:"Audio",

price:58000,

rating:4.7,

image:"/images/sony.png",

stock:30,

discount:15

}

];