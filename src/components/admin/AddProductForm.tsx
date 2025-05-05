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
    price: 168, // Set default price to 168 for Samsung S24 Ultra
    image: "",
    rating: 5,
    discount: 0,
  });

  const handleAddProduct = async () => {
    try {
      const productId = Date.now();
      // Ensure price is stored as a number
      const price = Number(newProduct.price);
      console.log('Adding product with price:', price);
      
      await addProduct({
        ...newProduct,
        id: productId,
        price: price,
      });
      
      setNewProduct({
        name: "",
        price: 168,
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
    <div className="bg-card rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">Add New Product</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-card-foreground mb-1">Product Name</label>
          <Input
            id="productName"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="bg-background text-foreground"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-card-foreground mb-1">Price (₱)</label>
          <Input
            id="price"
            type="number"
            placeholder="Price (₱)"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
            className="bg-background text-foreground"
          />
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-card-foreground mb-1">Image URL</label>
          <Input
            id="imageUrl"
            placeholder="Image URL"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            className="bg-background text-foreground"
          />
        </div>
        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-card-foreground mb-1">Discount (%)</label>
          <Input
            id="discount"
            type="number"
            placeholder="Discount (%)"
            value={newProduct.discount}
            onChange={(e) => setNewProduct({ ...newProduct, discount: Number(e.target.value) })}
            className="bg-background text-foreground"
          />
        </div>
      </div>
      <Button
        onClick={handleAddProduct}
        className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Add Product
      </Button>
    </div>
  );
};

export default AddProductForm;