import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DollarSign } from "lucide-react";

interface CashPaymentButtonProps {
  amount: number;
  onSuccess: () => void;
}

const CashPaymentButton = ({ amount, onSuccess }: CashPaymentButtonProps) => {
  const navigate = useNavigate();

  const handleCashPayment = async () => {
    try {
      console.log("Processing cash payment for amount:", amount);
      toast.success("Cash payment successful!");
      onSuccess(); // Trigger the onSuccess callback
      navigate("/orders");
    } catch (error) {
      console.error("Cash payment error:", error);
      toast.error("Cash payment failed. Please try again.");
    }
  };

  return (
    <Button
      onClick={handleCashPayment}
      className="w-full bg-green-600 hover:bg-green-500 text-white flex items-center justify-center gap-2 py-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
    >
      <DollarSign className="h-6 w-6" />
      <span className="text-lg font-semibold">Pay with Cash</span>
    </Button>
  );
};

export default CashPaymentButton;
