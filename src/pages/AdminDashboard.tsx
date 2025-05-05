import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { rtdb } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Button } from "@/components/ui/button";
import OrderManagement from "@/components/OrderManagement";
import AddProductForm from "@/components/admin/AddProductForm";
import ProductList from "@/components/admin/ProductList";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  discount?: number;
}

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const productsRef = ref(rtdb, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsArray = Object.values(data) as Product[];
        setProducts(productsArray);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <AddProductForm />
        <ProductList products={products} />
        <div className="bg-white rounded-lg shadow p-6">
          <OrderManagement />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;