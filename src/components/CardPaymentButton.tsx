import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";

interface CardPaymentButtonProps {
  amount: number;
  onSuccess: () => void;
}

const CardPaymentButton = ({ amount, onSuccess }: CardPaymentButtonProps) => {
  const navigate = useNavigate();

  const handleCardPayment = async () => {
    try {
      console.log("Processing card payment for amount:", amount);
      // Simulating payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Card payment successful");
      toast.success("Card payment successful!");
      onSuccess();
      navigate("/orders");
    } catch (error) {
      console.error("Card payment error:", error);
      toast.error("Card payment failed. Please try again.");
    }
  };

  return (
    <Button 
      onClick={handleCardPayment}
      className="w-full bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center gap-2 py-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
    >
      <CreditCard className="h-6 w-6" />
      <span className="text-lg font-semibold">Pay with Card</span>
    </Button>
  );
};

export default CardPaymentButton;