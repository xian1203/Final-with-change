import { useState, useEffect } from "react";
import { rtdb } from "@/lib/firebase";
import { ref, onValue, update } from "firebase/database";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";

interface Order {
  key: string;
  userId: string;
  items: any[];
  total: number;
  status: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate: string | null;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersRef = ref(rtdb, 'orders');
    console.log('Fetching orders for admin...');

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Admin orders data received:', data);

      if (data) {
        const ordersArray = Object.entries(data).map(([key, value]: [string, any]) => ({
          key,
          ...value,
        }));
        setOrders(ordersArray);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (orderKey: string, newStatus: string) => {
    try {
      const orderRef = ref(rtdb, `orders/${orderKey}`);
      await update(orderRef, { status: newStatus });
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const updateDeliveryDate = async (orderKey: string, newDate: Date) => {
    try {
      const orderRef = ref(rtdb, `orders/${orderKey}`);
      await update(orderRef, { estimatedDeliveryDate: newDate.toISOString() });
      toast.success("Delivery date updated successfully");
    } catch (error) {
      console.error("Error updating delivery date:", error);
      toast.error("Failed to update delivery date");
    }
  };

  const formatPrice = (price: number) => {
    return `₱${price}`;
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Order Management</h2>
      
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.key} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Order ID: {order.key}
                  </p>
                  <p className="text-sm text-gray-600">
                    Order placed: {format(new Date(order.createdAt), 'PPP')}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total: {formatPrice(order.total)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Delivery to: {order.address.street}, {order.address.city}, {order.address.state} {order.address.zipCode}, {order.address.country}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <select
                    className="border rounded p-2"
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.key, e.target.value)}
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Update Delivery Date
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(order.estimatedDeliveryDate)}
                        onSelect={(date) => date && updateDeliveryDate(order.key, date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Items</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
