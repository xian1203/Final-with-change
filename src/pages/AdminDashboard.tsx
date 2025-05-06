import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { rtdb } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Button } from "@/components/ui/button";
import OrderManagement from "@/components/OrderManagement";
import AddProductForm from "@/components/admin/AddProductForm";
import ProductList from "@/components/admin/ProductList";
import { Link } from "react-router-dom";
import { Home, ClipboardList, PlusCircle, ShoppingBag } from "lucide-react";

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
  const [activeSection, setActiveSection] = useState<"orders" | "addProduct" | "viewProducts">("orders");
  const { user } = useAuth();

  useEffect(() => {
    const productsRef = ref(rtdb, "products");
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Admin Dashboard</h1>
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <Button
          variant={activeSection === "orders" ? "default" : "outline"}
          onClick={() => setActiveSection("orders")}
          className="flex items-center gap-2"
        >
          <ClipboardList className="h-5 w-5" />
          Order Management
        </Button>
        <Button
          variant={activeSection === "addProduct" ? "default" : "outline"}
          onClick={() => setActiveSection("addProduct")}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          Add Product
        </Button>
        <Button
          variant={activeSection === "viewProducts" ? "default" : "outline"}
          onClick={() => setActiveSection("viewProducts")}
          className="flex items-center gap-2"
        >
          <ShoppingBag className="h-5 w-5" />
          View Products
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activeSection === "orders" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <OrderManagement />
          </div>
        )}
        {activeSection === "addProduct" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <AddProductForm />
          </div>
        )}
        {activeSection === "viewProducts" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <ProductList products={products} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;