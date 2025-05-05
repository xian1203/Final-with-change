import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface PayPalButtonProps {
  amount: number;
  onSuccess: () => void;
}

const PayPalButton = ({ amount, onSuccess }: PayPalButtonProps) => {
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  if (!clientId) {
    console.error("PayPal Client ID is not configured");
    return <div>PayPal configuration error</div>;
  }

  return (
    <PayPalScriptProvider options={{ 
      clientId: clientId,
      currency: "PHP",
      components: "buttons"
    }}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "PHP",
                  value: amount.toString(),
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          if (actions.order) {
            const order = await actions.order.capture();
            console.log("Payment successful:", order);
            toast.success("Payment successful!");
            onSuccess();
            navigate("/orders");
          }
        }}
        onError={(err) => {
          console.error("PayPal error:", err);
          toast.error("Payment failed. Please try again.");
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;