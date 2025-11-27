export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

const baseProducts: Omit<Product, "id">[] = [
  { name: "4K Gaming Monitor", price: 499.99, imageUrl: "https://picsum.photos/seed/monitor/600/400" },
  { name: "Wireless Headphones", price: 199.99, imageUrl: "https://picsum.photos/seed/headphones/600/400" },
  { name: "Mechanical Keyboard", price: 129.99, imageUrl: "https://picsum.photos/seed/keyboard/600/400" },
  { name: "Streetwear Hoodie", price: 69.99, imageUrl: "https://picsum.photos/seed/hoodie/600/400" },
  { name: "Sneaker Pack", price: 89.99, imageUrl: "https://picsum.photos/seed/sneakers/600/400" },
  { name: "Slim Jeans", price: 79.99, imageUrl: "https://picsum.photos/seed/jeans/600/400" },
  { name: "Floor Lamp", price: 59.99, imageUrl: "https://picsum.photos/seed/lamp/600/400" },
  { name: "Bluetooth Speaker", price: 89.99, imageUrl: "https://picsum.photos/seed/speaker/600/400" },
  { name: "Baseball Cap", price: 19.99, imageUrl: "https://picsum.photos/seed/cap/600/400" },
  { name: "Throw Blanket", price: 39.99, imageUrl: "https://picsum.photos/seed/blanket/600/400" },
  { name: "Plant Pot", price: 24.99, imageUrl: "https://picsum.photos/seed/plant/600/400" },
  { name: "Dining Chair", price: 149.99, imageUrl: "https://picsum.photos/seed/chair/600/400" }
];

export const products: Product[] = Array.from({ length: 100 }, (_, index) => {
  const base = baseProducts[index % baseProducts.length];
  const suffix = index + 1;
  return {
    id: `p${suffix}`,
    name: `${base.name} #${suffix}`,
    price: base.price,
    imageUrl: `${base.imageUrl}?v=${suffix}`,
  };
});
