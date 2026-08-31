export type Product = {
  id: string;
  name: string;
  shortName: string;
  category: "Podi" | "Pickle" | "Combo";
  description: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  image: string;
  accent: string;
  tags: string[];
  ingredients: string[];
  shelf: string;
  heat: "gentle" | "medium" | "fiery";
  vegetarian: boolean;
};

export const products: Product[] = [
  {
    id: "nalla-karam",
    name: "Nalla Karam Garlic Podi",
    shortName: "Garlic Podi",
    category: "Podi",
    description: "Roasted urad dal, sesame and whole garlic, ground coarse so every spoon has a little crunch.",
    price: 245,
    compareAt: 280,
    rating: 4.9,
    reviews: 128,
    image: "/__mockup/images/podis-products.jpg",
    accent: "#b65b3d",
    tags: ["Bestseller", "No preservatives"],
    ingredients: ["Urad dal", "Sesame", "Whole garlic", "Byadgi chilli", "Curry leaves"],
    shelf: "45 days · pantry stable",
    heat: "medium",
    vegetarian: true,
  },
  {
    id: "gongura",
    name: "Gongura & Green Chilli Pickle",
    shortName: "Gongura Pickle",
    category: "Pickle",
    description: "Tangy gongura leaves with green chilli and cold-pressed sesame oil. A bright Andhra classic.",
    price: 295,
    rating: 4.8,
    reviews: 94,
    image: "/__mockup/images/podis-hero.jpg",
    accent: "#6f7a4b",
    tags: ["Fresh batch", "Andhra recipe"],
    ingredients: ["Gongura leaves", "Green chilli", "Mustard", "Sesame oil", "Garlic"],
    shelf: "60 days · refrigerate after opening",
    heat: "fiery",
    vegetarian: true,
  },
  {
    id: "curry-leaf",
    name: "Karivepaku Curry Leaf Podi",
    shortName: "Curry Leaf Podi",
    category: "Podi",
    description: "Fragrant curry leaves, roasted coconut and lentils. Spoon over hot rice and ghee.",
    price: 225,
    rating: 4.7,
    reviews: 67,
    image: "/__mockup/images/podis-kitchen.jpg",
    accent: "#66724e",
    tags: ["Mild", "Small batch"],
    ingredients: ["Curry leaves", "Chana dal", "Coconut", "Black pepper", "Cumin"],
    shelf: "45 days · pantry stable",
    heat: "gentle",
    vegetarian: true,
  },
  {
    id: "avakaya",
    name: "Mango Avakaya Pickle",
    shortName: "Mango Avakaya",
    category: "Pickle",
    description: "Raw summer mangoes, dark mustard and chilli. Bold, briny and made to wake up plain dal.",
    price: 315,
    compareAt: 350,
    rating: 4.9,
    reviews: 151,
    image: "/__mockup/images/podis-products.jpg",
    accent: "#c4793d",
    tags: ["Seasonal", "Customer favourite"],
    ingredients: ["Raw mango", "Mustard", "Red chilli", "Sea salt", "Sesame oil"],
    shelf: "90 days · refrigerate after opening",
    heat: "fiery",
    vegetarian: true,
  },
  {
    id: "comfort-combo",
    name: "The Comfort Rice Combo",
    shortName: "Comfort Combo",
    category: "Combo",
    description: "One jar each of garlic podi, gongura pickle and curry leaf podi for the weekday rice ritual.",
    price: 690,
    compareAt: 765,
    rating: 4.9,
    reviews: 43,
    image: "/__mockup/images/podis-hero.jpg",
    accent: "#a44e32",
    tags: ["Save ₹75", "Giftable"],
    ingredients: ["Garlic podi", "Gongura pickle", "Curry leaf podi"],
    shelf: "45–90 days · see individual jars",
    heat: "medium",
    vegetarian: true,
  },
];

export const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;