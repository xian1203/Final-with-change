interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderItemsProps {
  items: OrderItem[];
}

const OrderItems = ({ items }: OrderItemsProps) => {
  const formatPrice = (price: number) => {
    return `₱${price.toFixed(2)}`;
  };

  return (
    <div>
      <h3 className="font-semibold mb-4 dark:text-white">Items Purchased</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-grow">
              <h4 className="font-medium dark:text-white">{item.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Quantity: {item.quantity} × {formatPrice(item.price)}
              </p>
              <p className="font-medium dark:text-white">
                Subtotal: {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItems;