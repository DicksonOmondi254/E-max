export interface Slide {
  id: number;
  title: string;
  subtitle: string;
  button: string;
  image: string;
  background: string;
}

export const slides: Slide[] = [
  {
    id: 1,
    title: "Genuine Electronics",
    subtitle: "Shop original smartphones, laptops and accessories.",
    button: "Shop Now",
    image: "/images/slides/phones.png",
    background: "#0F4C81",
  },
  {
    id: 2,
    title: "Gaming Zone",
    subtitle: "Gaming laptops, consoles and accessories.",
    button: "Explore",
    image: "/images/slides/gaming.png",
    background: "#1E3A8A",
  },
  {
    id: 3,
    title: "Smart Home",
    subtitle: "Upgrade your home with smart devices.",
    button: "Discover",
    image: "/images/slides/smarthome.png",
    background: "#047857",
  },
];