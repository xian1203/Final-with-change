import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import GCashModal from "./GCashModal";

interface GCashButtonProps {
  amount: number;
  onSuccess: () => void;
}

const GCashButton = ({ amount, onSuccess }: GCashButtonProps) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleGCashPayment = () => {
    setShowModal(true);
  };

  const handlePaymentSuccess = async () => {
    console.log("GCash payment successful");
    toast.success("GCash payment successful!");
    onSuccess(); // Trigger the onSuccess callback
    setShowModal(false); // Close the modal
    navigate("/orders");
  };

  return (
    <>
      <Button 
        onClick={handleGCashPayment}
        className="w-full bg-greenPalette.castleton hover:bg-greenPalette.castletonDark text-greenPalette.white flex items-center justify-center gap-2 py-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
      >
        <div className="flex items-center justify-center w-full gap-4">
          <img 
            src="/assets/gcash.png" // Ensure this path matches the actual location of the GCash logo
            alt="GCash" 
            className="h-8 w-auto object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/150?text=GCash+Logo+Not+Found"; // Fallback image
            }}
          />
          <span className="text-xl font-semibold tracking-wide">Pay with GCash</span>
        </div>
      </Button>
      <GCashModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        onSuccess={handlePaymentSuccess}
        amount={amount}
      />
    </>
  );
};

export default GCashButton;