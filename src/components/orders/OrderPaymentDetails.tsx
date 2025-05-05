import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface OrderPaymentDetailsProps {
  order: {
    paymentMethod: string;
    paymentStatus: string;
    estimatedDeliveryDate: string;
    total: number;
  };
}

const OrderPaymentDetails = ({ order }: OrderPaymentDetailsProps) => {
  const formatPrice = (price: number) => {
    return `₱${price.toFixed(2)}`;
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold mb-4 dark:text-white">Payment Details</h3>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
        <span className="font-medium dark:text-white capitalize">{order.paymentMethod}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">Payment Status</span>
        <span className="font-medium dark:text-white capitalize">{order.paymentStatus}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">Estimated Delivery</span>
        <span className="font-medium dark:text-white">
          {format(new Date(order.estimatedDeliveryDate), 'PPP')}
        </span>
      </div>
      <Separator className="my-2" />
      <div className="flex justify-between text-lg font-bold">
        <span className="dark:text-white">Total Amount</span>
        <span className="dark:text-white">{formatPrice(order.total)}</span>
      </div>
    </div>
  );
};

export default OrderPaymentDetails;