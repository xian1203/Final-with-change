import { useState, useEffect } from "react";
import { rtdb } from "@/lib/firebase";
import { ref, onValue, update, remove } from "firebase/database";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"; // Import AlertDialog components

interface Order {
  key: string;
  userId: string;
  email?: string;
  items: any[];
  total: number;
  status: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    fullName?: string;
  };
  createdAt: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate: string | null;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedOrderKey, setSelectedOrderKey] = useState<string | null>(null); // State for selected order key

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

      // Optionally, you can add logic here to notify the customer about the status change
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const updateDeliveryDateTime = async (orderKey: string, newDate: Date, newTime: string) => {
    try {
      const [hours, minutes] = newTime.split(":").map(Number);
      newDate.setHours(hours, minutes);

      const orderRef = ref(rtdb, `orders/${orderKey}`);
      await update(orderRef, { estimatedDeliveryDate: newDate.toISOString() });
      toast.success("Delivery date and time updated successfully");
    } catch (error) {
      console.error("Error updating delivery date and time:", error);
      toast.error("Failed to update delivery date and time");
    }
  };

  const deleteOrder = async (orderKey: string) => {
    try {
      const orderRef = ref(rtdb, `orders/${orderKey}`);
      await remove(orderRef); // Use `remove` to delete the order
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const confirmDeleteOrder = async () => {
    if (selectedOrderKey) {
      await deleteOrder(selectedOrderKey);
      setSelectedOrderKey(null); // Reset selected order key
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Grid layout */}
          {orders.map((order, index) => (
            <div key={order.key} className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Order ID: C{index + 1} {/* Changed to formatted ID */}
                </p>
                <p className="text-sm text-gray-600">
                  Customer Name: {order.address.fullName || "N/A"} {/* Added full name */}
                </p>
                <p className="text-sm text-gray-600">
                  Customer Email/Username: {order.email || order.userId || "N/A"} {/* Ensure plain text */}
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

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Items</h3>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded" // Adjusted size for grid layout
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

              <div className="space-y-2 mt-4">
                <select
                  className="border rounded p-2 w-full"
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
                      Update Delivery Time
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4 bg-white shadow-lg rounded-lg">
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <label htmlFor="time" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Select Time
                        </label>
                        <input
                          id="time"
                          type="time"
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2"
                        />
                      </div>
                      <Button
                        onClick={() =>
                          selectedTime &&
                          updateDeliveryDateTime(order.key, new Date(order.estimatedDeliveryDate), selectedTime)
                        }
                        className="w-full bg-green-600 hover:bg-green-500 text-white"
                      >
                        Save
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      onClick={() => setSelectedOrderKey(order.key)} // Set selected order key
                      className="w-full"
                    >
                      Delete Order
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white shadow-lg rounded-lg p-6 border border-gray-300"> {/* Removed transparency */}
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the order.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={confirmDeleteOrder}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
