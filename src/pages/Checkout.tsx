import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { rtdb } from "@/lib/firebase";
import { ref, push, serverTimestamp } from "firebase/database";
import { useAuth } from "@/context/AuthContext";
import PayPalButton from "@/components/PayPalButton";
import GCashButton from "@/components/GCashButton";
import CashPaymentButton from "@/components/CashPaymentButton";
import { ArrowLeft } from "lucide-react";
import SuccessNotification from "../components/SuccessNotification"; // Relative path

const Modal = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
        {children}
      </div>
    </div>
  );
};

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    description: "", // Add the description property
    fullName: "", // Add the fullName property
  });
  const [showSuccessNotification, setShowSuccessNotification] = useState(false); // State for success notification

  const handleOrderSuccess = async () => {
    try {
      const ordersRef = ref(rtdb, 'orders');
      const estimatedDeliveryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      await push(ordersRef, {
        userId: user?.uid,
        items,
        total,
        status: "processing",
        address,
        createdAt: serverTimestamp(),
        estimatedDeliveryDate: estimatedDeliveryDate.toISOString(),
        actualDeliveryDate: null,
        paymentMethod: "Cash/GCash",
        paymentStatus: "completed"
      });

      clearCart();
      setShowSuccessNotification(true); // Show success notification
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => navigate("/")} className="bg-amazon-orange hover:bg-amazon-hover text-black">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
              </div>
              <p className="font-bold">₱{item.price * item.quantity}</p>
            </div>
          ))}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-lg font-bold">₱{total}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <Input
                id="fullName"
                required
                value={address.fullName || ""}
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                placeholder="Full Name"
              />
            </div>
            <div>
              <label htmlFor="street" className="block text-sm font-medium mb-1">
                Street Address
              </label>
              <Input
                id="street"
                required
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                placeholder="1234 Main St"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <Input
                id="description"
                value={address.description || ""}
                onChange={(e) => setAddress({ ...address, description: e.target.value })}
                placeholder="Additional details about the delivery"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email/Username
              </label>
              <Input
                id="email"
                value={user?.email || user?.uid || ""}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <h2 className="text-xl font-semibold">Payment Method</h2>
            <div className="space-y-4">
              <PayPalButton amount={total} onSuccess={handleOrderSuccess} />
              <GCashButton amount={total} onSuccess={handleOrderSuccess} />
              <CashPaymentButton amount={total} onSuccess={handleOrderSuccess} />
            </div>
          </div>
        </div>
      </div>
      {showSuccessNotification && (
        <SuccessNotification
          onViewStatus={() => {
            setShowSuccessNotification(false);
            navigate("/orders"); // Navigate to orders page
          }}
          onDismiss={() => setShowSuccessNotification(false)} // Dismiss notification
        />
      )}
    </div>
  );
};

export default Checkout;