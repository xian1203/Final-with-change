import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { rtdb } from "@/lib/firebase";
import { ref, onValue, update } from "firebase/database";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import OrderCard from "@/components/orders/OrderCard";
import { toast } from "sonner"; // Use the existing toast utility

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPreviousOrders, setShowPreviousOrders] = useState(false); // Toggle for previous orders
  const { user } = useAuth();
  const navigate = useNavigate();

  const calculateRemainingTime = (createdAt) => {
    const orderTime = new Date(createdAt).getTime();
    const currentTime = Date.now();
    const timeDifference = 180000 - (currentTime - orderTime); // 3 minutes in milliseconds
    return timeDifference > 0 ? timeDifference : 0;
  };

  const cancelOrder = async (orderKey: string, createdAt: string) => {
    const remainingTime = calculateRemainingTime(createdAt);

    if (remainingTime <= 0) {
      toast.error("You can no longer cancel this order.");
      return;
    }

    try {
      const orderRef = ref(rtdb, `orders/${orderKey}`);
      await update(orderRef, { status: "cancelled" });
      toast.success("Order cancelled successfully.");
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order. Please try again.");
    }
  };

  useEffect(() => {
    if (!user) return;

    const ordersRef = ref(rtdb, "orders");
    console.log("Fetching orders...");

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Orders data received:", data);

      if (data) {
        const ordersArray = Object.entries(data)
          .map(([key, value]: [string, any]) => ({
            key,
            ...value,
            remainingTime: calculateRemainingTime(value.createdAt), // Add remaining time
          }))
          .filter((order) =>
            showPreviousOrders
              ? order.userId === user.uid && (order.status === "delivered" || order.status === "cancelled")
              : order.userId === user.uid && order.status !== "delivered" && order.status !== "cancelled"
          )
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        console.log("Processed orders:", ordersArray);
        setOrders(ordersArray);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, showPreviousOrders]); // Re-fetch orders when toggle changes

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          remainingTime: calculateRemainingTime(order.createdAt),
        }))
      );
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [orders]);

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

        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={() => setShowPreviousOrders(!showPreviousOrders)}
            className="flex items-center gap-2"
          >
            {showPreviousOrders ? "View Active Orders" : "View Previous Orders"}
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center">
            <p className="text-xl mb-4 dark:text-white">
              {showPreviousOrders ? "No previous orders found" : "No active orders found"}
            </p>
            <Button onClick={() => navigate("/")} className="bg-amazon-orange hover:bg-amazon-hover text-black">
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.key} className="border rounded-lg p-4 shadow-md">
                <OrderCard order={order} />
                {order.status === "processing" && (
                  <>
                    {order.remainingTime > 0 ? (
                      <div className="text-sm text-gray-600 mb-2">
                        Time left to cancel: {Math.floor(order.remainingTime / 1000)} seconds
                      </div>
                    ) : (
                      <div className="text-sm text-red-600 mb-2">Cancellation period expired</div>
                    )}
                    <Button
                      variant="destructive"
                      onClick={() => cancelOrder(order.key, order.createdAt)}
                      className="mt-4 w-full"
                      disabled={order.remainingTime <= 0}
                    >
                      Cancel Order
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;