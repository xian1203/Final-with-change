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
    onSuccess();
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
            src="/gcash-logo.png" 
            alt="GCash" 
            className="h-8 w-auto object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://example.com/fastfood-logo-fallback.png";
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