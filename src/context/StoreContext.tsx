"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, Order, UserProfile, OrderStatus } from "@/types/store";
import { INITIAL_PRODUCTS } from "@/data/products";

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  user: UserProfile;
  promoCode: string | null;
  discountRate: number;
  isCartOpen: boolean;
  quickViewProduct: Product | null;
  setIsCartOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  createOrder: (orderInput: Omit<Order, "id" | "orderNumber" | "createdAt" | "status" | "trackingNumber" | "estimatedDelivery">) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addProduct: (product: Omit<Product, "id" | "rating" | "reviewsCount" | "reviews">) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTax: number;
  cartTotal: number;
  cartItemsCount: number;
}

const DEFAULT_USER: UserProfile = {
  name: "Julian Sterling",
  email: "julian.sterling@mayfair.co.uk",
  phone: "+44 20 7946 0912",
  vipTier: "Burgundy Connoisseur (VIP Tier 1)",
  rewardPoints: 2450,
  savedAddresses: [
    {
      id: "addr-1",
      label: "Savile Row Residence",
      fullName: "Julian Sterling",
      address: "14 Savile Row, Mayfair",
      city: "London",
      postalCode: "W1S 3JN",
      isDefault: true,
    },
    {
      id: "addr-2",
      label: "Milan Pied-à-terre",
      fullName: "Julian Sterling",
      address: "Via Montenapoleone 8",
      city: "Milan",
      postalCode: "20121",
      isDefault: false,
    },
  ],
  measurements: {
    jacketSize: "40R",
    chest: "40 inches / 101.6 cm",
    waist: "33 inches / 83.8 cm",
    inseam: "32 inches / 81.2 cm",
    collar: "15.5 inches / 39.5 cm",
    sleeve: "34 inches / 86.4 cm",
    shoeSize: "UK 9 / US 10 / EU 43",
  },
};

const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-1001",
    orderNumber: "TS-2026-8941",
    createdAt: "2026-10-14T14:32:00Z",
    status: "Delivered",
    items: [
      {
        productId: "ts-001",
        productName: "The Mayfair Peak Lapel Tuxedo",
        price: 1450,
        selectedSize: "40R",
        selectedColor: "Midnight Black",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
      },
      {
        productId: "ts-010",
        productName: "Mulberry Silk & Wool Pocket Square",
        price: 120,
        selectedSize: "One Size",
        selectedColor: "Burgundy & Gold Medallion",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop",
      },
    ],
    subtotal: 1570,
    discount: 157,
    shipping: 0,
    tax: 113.04,
    total: 1526.04,
    promoCode: "TREND10",
    customer: {
      fullName: "Julian Sterling",
      email: "julian.sterling@mayfair.co.uk",
      phone: "+44 20 7946 0912",
      address: "14 Savile Row, Mayfair",
      city: "London",
      postalCode: "W1S 3JN",
      country: "United Kingdom",
    },
    deliveryMethod: "vip_courier",
    paymentMethod: "card",
    trackingNumber: "TS-VIP-994821-GB",
    estimatedDelivery: "2026-10-16",
  },
  {
    id: "ord-1002",
    orderNumber: "TS-2026-9214",
    createdAt: "2026-10-18T09:15:00Z",
    status: "In Transit",
    items: [
      {
        productId: "ts-004",
        productName: "Tuscan Suede Flight Bomber",
        price: 1250,
        selectedSize: "L",
        selectedColor: "Deep Burgundy",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
      },
    ],
    subtotal: 1250,
    discount: 0,
    shipping: 0,
    tax: 100,
    total: 1350,
    customer: {
      fullName: "Julian Sterling",
      email: "julian.sterling@mayfair.co.uk",
      phone: "+44 20 7946 0912",
      address: "14 Savile Row, Mayfair",
      city: "London",
      postalCode: "W1S 3JN",
      country: "United Kingdom",
    },
    deliveryMethod: "vip_courier",
    paymentMethod: "card",
    trackingNumber: "TS-EXP-773190-GB",
    estimatedDelivery: "2026-10-20",
  },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(["ts-001", "ts-003", "ts-008"]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Hydrate from localStorage safely on mount
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem("ts_products");
      if (storedProducts) {
        const parsed = JSON.parse(storedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }

      const storedCart = localStorage.getItem("ts_cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }

      const storedWishlist = localStorage.getItem("ts_wishlist");
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }

      const storedOrders = localStorage.getItem("ts_orders");
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }

      const storedUser = localStorage.getItem("ts_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to load local storage state:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("ts_products", JSON.stringify(products));
      localStorage.setItem("ts_cart", JSON.stringify(cart));
      localStorage.setItem("ts_wishlist", JSON.stringify(wishlist));
      localStorage.setItem("ts_orders", JSON.stringify(orders));
      localStorage.setItem("ts_user", JSON.stringify(user));
    } catch (e) {
      console.error("Failed to persist state:", e);
    }
  }, [products, cart, wishlist, orders, user, isHydrated]);

  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { product, selectedSize: size, selectedColor: color, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(item.product.id === productId && item.selectedSize === size && item.selectedColor === color)
      )
    );
  };

  const updateCartQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.selectedSize === size && item.selectedColor === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode(null);
    setDiscountRate(0);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const applyPromoCode = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "TREND10") {
      setPromoCode("TREND10");
      setDiscountRate(0.1);
      return { success: true, message: "VIP Privilege: 10% discount applied." };
    }
    if (cleanCode === "VIP20") {
      setPromoCode("VIP20");
      setDiscountRate(0.2);
      return { success: true, message: "Bespoke Connoisseur: 20% discount applied." };
    }
    if (cleanCode === "FREESHIP") {
      setPromoCode("FREESHIP");
      setDiscountRate(0.05);
      return { success: true, message: "Complimentary VIP courier & 5% courtesy discount applied." };
    }
    return { success: false, message: "Invalid promo code. Try 'TREND10' or 'VIP20'." };
  };

  const removePromoCode = () => {
    setPromoCode(null);
    setDiscountRate(0);
  };

  const createOrder = (
    orderInput: Omit<Order, "id" | "orderNumber" | "createdAt" | "status" | "trackingNumber" | "estimatedDelivery">
  ): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const date = new Date();
    const estDate = new Date();
    estDate.setDate(date.getDate() + 3);

    const newOrder: Order = {
      ...orderInput,
      id: `ord-${Date.now()}`,
      orderNumber: `TS-${date.getFullYear()}-${randomSuffix}`,
      createdAt: date.toISOString(),
      status: "Confirmed",
      trackingNumber: `TS-TRACK-${randomSuffix}-GB`,
      estimatedDelivery: estDate.toISOString().split("T")[0],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const addProduct = (productInput: Omit<Product, "id" | "rating" | "reviewsCount" | "reviews">): Product => {
    const newProduct: Product = {
      ...productInput,
      id: `ts-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      reviews: [
        {
          id: `rev-${Date.now()}`,
          author: "Trend Street Atelier",
          rating: 5,
          date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
          title: "Craftsmanship Certified",
          comment: "Inspected and approved by Master Tailors.",
          verified: true,
        },
      ],
    };

    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...profile }));
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartDiscount = Math.round(cartSubtotal * discountRate);
  const cartShipping = cartSubtotal >= 200 || cartSubtotal === 0 ? 0 : 25;
  const cartTax = Math.round((cartSubtotal - cartDiscount) * 0.08 * 100) / 100;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping + cartTax);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        user,
        promoCode,
        discountRate,
        isCartOpen,
        quickViewProduct,
        setIsCartOpen,
        setQuickViewProduct,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyPromoCode,
        removePromoCode,
        createOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        updateUserProfile,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTax,
        cartTotal,
        cartItemsCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
