import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { rtdb } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import OrderCard from "@/components/orders/OrderCard";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const ordersRef = ref(rtdb, 'orders');
    console.log('Fetching orders...');

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Orders data received:', data);

      if (data) {
        const ordersArray = Object.entries(data)
          .map(([key, value]: [string, any]) => ({
            key,
            ...value,
          }))
          .filter((order) => order.userId === user.uid)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        console.log('Processed orders:', ordersArray);
        setOrders(ordersArray);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Your Orders</h1>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Button>
        </div>
        
        {orders.length === 0 ? (
          <div className="text-center">
            <p className="text-xl mb-4 dark:text-white">No orders found</p>
            <Button onClick={() => navigate("/")} className="bg-amazon-orange hover:bg-amazon-hover text-black">
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order.key} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;