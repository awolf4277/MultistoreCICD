export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl?: string;
}

const baseProducts: Omit<Product, "id" | "name">[] = [
  {
    category: "Displays",
    price: 499.99,
    description:
      "Ultra-sharp 4K panel, 144Hz refresh rate, built for high-FPS domination.",
    imageUrl:
      "https://images.pexels.com/photos/845451/pexels-photo-845451.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    category: "Audio",
    price: 199.99,
    description:
      "Wireless over-ear headphones with deep bass, clear mids, and all-day battery life.",
    imageUrl:
      "https://images.pexels.com/photos/3394664/pexels-photo-3394664.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    category: "Input",
    price: 129.99,
    description:
      "Mechanical keyboard with hot-swap switches and per-key RGB lighting.",
    imageUrl:
      "https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    category: "Apparel",
    price: 69.99,
    description:
      "Mid-weight streetwear hoodie with a relaxed fit and soft interior lining.",
    imageUrl:
      "https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    category: "Apparel",
    price: 89.99,
    description:
      "Sneaker pack built for daily wear with cushioned soles and breathable uppers.",
    imageUrl:
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    category: "Apparel",
    price: 79.99,
    description:
      "Slim fit jeans with stretch fabric for all-day comfort and clean lines.",
    imageUrl:
      "https://images.pexels.com/photos/769109/pexels-photo-769109.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    category: "Home",
    price: 59.99,
    description:
      "Minimalist floor lamp that throws a warm, diffused glow over your setup.",
    imageUrl:
      "https://images.pexels.com/photos/6585763/pexels-photo-6585763.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    category: "Audio",
    price: 89.99,
    description:
      "Portable Bluetooth speaker with punchy sound and water-resistant housing.",
    imageUrl:
      "https://images.pexels.com/photos/920114/pexels-photo-920114.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    category: "Accessories",
    price: 19.99,
    description:
      "Classic baseball cap with adjustable strap and structured crown.",
    imageUrl:
      "https://images.pexels.com/photos/769732/pexels-photo-769732.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    category: "Home",
    price: 39.99,
    description:
      "Cozy throw blanket that upgrades any couch, chair, or battlestation.",
    imageUrl:
      "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    category: "Home",
    price: 24.99,
    description:
      "Ceramic plant pot perfect for small greens, succulents, or desk plants.",
    imageUrl:
      "https://images.pexels.com/photos/2067643/pexels-photo-2067643.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    category: "Furniture",
    price: 149.99,
    description:
      "Upholstered dining chair with a modern profile and supportive cushioning.",
    imageUrl:
      "https://images.pexels.com/photos/1866140/pexels-photo-1866140.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

export const products: Product[] = Array.from({ length: 100 }, (_, index) => {
  const base = baseProducts[index % baseProducts.length];
  const number = index + 1;
  const nameIndex = index % baseProducts.length;

  const name =
    nameIndex === 0
      ? `4K Gaming Monitor #${number}`
      : nameIndex === 1
      ? `Wireless Headphones #${number}`
      : nameIndex === 2
      ? `Mechanical Keyboard #${number}`
      : nameIndex === 3
      ? `Streetwear Hoodie #${number}`
      : nameIndex === 4
      ? `Sneaker Pack #${number}`
      : nameIndex === 5
      ? `Slim Jeans #${number}`
      : nameIndex === 6
      ? `Floor Lamp #${number}`
      : nameIndex === 7
      ? `Bluetooth Speaker #${number}`
      : nameIndex === 8
      ? `Baseball Cap #${number}`
      : nameIndex === 9
      ? `Throw Blanket #${number}`
      : nameIndex === 10
      ? `Plant Pot #${number}`
      : `Dining Chair #${number}`;

  return {
    id: `prod-${number}`,
    name,
    price: base.price,
    category: base.category,
    description: `${name} — ${base.description}`,
    imageUrl: base.imageUrl,
  };
});



