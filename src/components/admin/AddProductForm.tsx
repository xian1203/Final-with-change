import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addProduct } from "@/lib/firebase";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  discount?: number;
}

const AddProductForm = () => {
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    image: "",
    rating: 5,
    discount: 0,
  });

  const handleAddProduct = async () => {
    try {
      const productId = Date.now();
      const price = Number(newProduct.price);

      await addProduct({
        ...newProduct,
        id: productId,
        price: price,
      });

      setNewProduct({
        name: "",
        price: 0,
        image: "",
        rating: 5,
        discount: 0,
      });
      toast.success("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
        Add New Product
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Product Name
          </label>
          <Input
            id="productName"
            placeholder="Enter product name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Price (₱)
          </label>
          <Input
            id="price"
            type="number"
            placeholder="Enter price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Image URL
          </label>
          <Input
            id="imageUrl"
            placeholder="Enter image URL"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Discount (%)
          </label>
          <Input
            id="discount"
            type="number"
            placeholder="Enter discount"
            value={newProduct.discount}
            onChange={(e) => setNewProduct({ ...newProduct, discount: Number(e.target.value) })}
            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
        </div>
      </div>
      <Button
        onClick={handleAddProduct}
        className="mt-6 w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200"
      >
        Add Product
      </Button>
    </div>
  );
};

export default AddProductForm;