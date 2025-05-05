import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import CartSidebar from "@/components/CartSidebar";
import { rtdb } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  discount?: number;
}

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const productsRef = ref(rtdb, 'products');
    console.log('Fetching products from Firebase...');
    
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Products data received:', data);
      
      if (data) {
        // Convert object to array and ensure all required fields are present
        const productsArray = Object.values(data)
          .filter((product: any) => 
            product && 
            product.id && 
            product.name && 
            product.price !== undefined && 
            product.image && 
            product.rating !== undefined
          ) as Product[];
        
        console.log('Transformed products array:', productsArray);
        setProducts(productsArray);
      } else {
        console.log('No products found in database');
        setProducts([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching products:', error);
      toast.error("Failed to load products");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold dark:text-white">Featured Products</h1>
          
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full dark:bg-gray-800 dark:text-white"
            />
          </div>

          {loading ? (
            <div className="text-center py-8 dark:text-white">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 dark:text-white">
              {searchQuery ? "No products found matching your search" : "No products available"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Index;