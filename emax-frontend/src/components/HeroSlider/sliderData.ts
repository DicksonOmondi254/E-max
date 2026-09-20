export interface HeroSlide {
  id: number;
  badge?: string;
  eyebrow?: string;
  title: string;
  subtitle: string;
  button: string;
  link?: string;
  image: string;
  background: string;
}

export const slides: HeroSlide[] = [
  {
    id: 1,
    badge: "Hot Deal",
    title: "Premium Electronics\nUp to 40% Off",
    subtitle: "Shop the latest smartphones, laptops and gadgets at unbeatable prices. Free delivery on orders over KES 5,000.",
    button: "Shop Now",
    link: "/products",
    image: "/images/slides/phones.png",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  },
  {
    id: 2,
    badge: "New Arrivals",
    eyebrow: "Gaming Zone",
    title: "Level Up Your Setup",
    subtitle: "Discover powerful gaming laptops, consoles and accessories. Exclusive launch offers available now.",
    button: "Explore Gaming",
    link: "/categories/3",
    image: "/images/slides/gaming.png",
    background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)",
  },
  {
    id: 3,
    badge: "Smart Home",
    title: "Transform Your\nHome Experience",
    subtitle: "Smart speakers, security cameras and home automation. Make your life easier with one tap.",
    button: "Discover More",
    link: "/categories/8",
    image: "/images/slides/smarthome.png",
    background: "linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)",
  },
];
