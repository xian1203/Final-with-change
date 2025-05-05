import { format } from "date-fns";
import { Receipt } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import OrderItems from "./OrderItems";
import OrderPaymentDetails from "./OrderPaymentDetails";
import OrderDeliveryAddress from "./OrderDeliveryAddress";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderProps {
  order: {
    key: string;
    items: OrderItem[];
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
    paymentMethod: string;
    paymentStatus: string;
  };
}

const OrderCard = ({ order }: OrderProps) => {
  return (
    <Card key={order.key} className="overflow-hidden">
      <CardHeader className="bg-gray-50 dark:bg-gray-800">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Order Receipt
            </CardTitle>
            <CardDescription>
              Order Date: {format(new Date(order.createdAt), 'PPP')}
            </CardDescription>
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium capitalize bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            {order.status}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          <OrderItems items={order.items} />
          <Separator />
          <OrderPaymentDetails order={order} />
          <OrderDeliveryAddress address={order.address} />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;