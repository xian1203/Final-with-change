import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { rtdb } from "@/lib/firebase";
import { ref, onValue, set } from "firebase/database";
import { useAuth } from "./AuthContext";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    const cartRef = ref(rtdb, `carts/${user.uid}`);
    
    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Cart data received:', data);
      if (data) {
        const cartItems = Array.isArray(data) ? data : [];
        const processedItems = cartItems.map(item => ({
          ...item,
          price: Number(item.price)
        }));
        console.log('Processed cart items with prices:', processedItems);
        setItems(processedItems);
      } else {
        setItems([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const updateCartInDatabase = async (newItems: CartItem[]) => {
    if (!user) return;
    
    try {
      const itemsToStore = newItems.map(item => ({
        ...item,
        price: Number(item.price)
      }));
      console.log('Storing items in cart with prices:', itemsToStore);
      await set(ref(rtdb, `carts/${user.uid}`), itemsToStore);
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error("Failed to update cart");
    }
  };

  const addToCart = (product: Product) => {
    const productPrice = Number(product.price);
    console.log('Adding product to cart with price:', productPrice);
    
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      
      let newItems;
      if (existingItem) {
        newItems = currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        toast.success("Added another to cart!");
      } else {
        newItems = [...currentItems, { ...product, price: productPrice, quantity: 1 }];
        toast.success("Added to cart!");
      }
      
      updateCartInDatabase(newItems);
      return newItems;
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((currentItems) => {
      const newItems = currentItems.filter((item) => item.id !== productId);
      updateCartInDatabase(newItems);
      return newItems;
    });
    toast.success("Removed from cart!");
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setItems((currentItems) => {
      const newItems = currentItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      updateCartInDatabase(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    if (user) {
      set(ref(rtdb, `carts/${user.uid}`), null);
    }
    toast.success("Cart cleared!");
  };

  const total = items.reduce((sum, item) => {
    const itemPrice = Number(item.price);
    const itemQuantity = Number(item.quantity);
    const itemTotal = itemPrice * itemQuantity;
    console.log(`Calculating total for item ${item.name}: ${itemPrice} × ${itemQuantity} = ${itemTotal}`);
    return sum + itemTotal;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};