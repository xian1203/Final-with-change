import { Button } from "@/components/ui/button";
import { deleteProduct, updateProduct } from "@/lib/firebase";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  discount?: number;
}

interface ProductListProps {
  products: Product[];
}

const ProductList = ({ products }: ProductListProps) => {
  const handleDeleteProduct = async (productId: number) => {
    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleUpdateProduct = async (productId: number, updates: Partial<Product>) => {
    try {
      await updateProduct(productId, updates);
      toast.success("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold p-6 border-b">Product List</h2>
      <div className="divide-y">
        {products.map((product) => (
          <div key={product.id} className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-gray-600">
                  ₱{product.price}
                  {product.discount > 0 && (
                    <span className="text-green-600 ml-2">
                      ({product.discount}% off)
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  const newPrice = window.prompt("Enter new price (₱):");
                  if (newPrice) {
                    handleUpdateProduct(product.id, {
                      price: Number(newPrice),
                    });
                  }
                }}
              >
                Update Price
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const newDiscount = window.prompt("Enter new discount (%):");
                  if (newDiscount) {
                    handleUpdateProduct(product.id, {
                      discount: Number(newDiscount),
                    });
                  }
                }}
              >
                Update Discount
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteProduct(product.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;