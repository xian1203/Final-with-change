interface OrderDeliveryAddressProps {
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const OrderDeliveryAddress = ({ address }: OrderDeliveryAddressProps) => {
  return (
    <div>
      <h3 className="font-semibold mb-2 dark:text-white">Delivery Address</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {address.street}, {address.city}, {address.state} {address.zipCode}, {address.country}
      </p>
    </div>
  );
};

export default OrderDeliveryAddress;