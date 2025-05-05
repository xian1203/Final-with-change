import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { rtdb } from "@/lib/firebase";
import { ref, set, get } from "firebase/database";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  discount?: number;
}

const ProductCard = ({ id, name, price, image, rating, discount = 0 }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [canRate, setCanRate] = useState(false);
  const [averageRating, setAverageRating] = useState(rating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const formatPrice = (price: number) => {
    return `₱${price}`;
  };

  const calculateDiscountedPrice = (originalPrice: number, discount: number) => {
    if (!discount) return originalPrice;
    const discountAmount = (originalPrice * discount) / 100;
    return originalPrice - discountAmount;
  };

  const handleBuyNow = () => {
    const discountedPrice = calculateDiscountedPrice(price, discount);
    addToCart({ id, name, price: discountedPrice, image });
    navigate('/checkout');
    toast.success("Proceeding to checkout!");
  };

  useEffect(() => {
    if (!user) return;

    const checkRatingEligibility = async () => {
      const ordersRef = ref(rtdb, 'orders');
      const snapshot = await get(ordersRef);
      const orders = snapshot.val();

      if (orders) {
        const userOrders = Object.values(orders).filter((order: any) => 
          order.userId === user.uid && 
          order.status === 'delivered' &&
          order.items.some((item: any) => item.id === id)
        );
        setCanRate(userOrders.length > 0);
      }

      const userRatingRef = ref(rtdb, `ratings/${id}/${user.uid}`);
      const userRatingSnapshot = await get(userRatingRef);
      if (userRatingSnapshot.exists()) {
        setUserRating(userRatingSnapshot.val().rating);
      }
    };

    const getAverageRating = async () => {
      const ratingsRef = ref(rtdb, `ratings/${id}`);
      const snapshot = await get(ratingsRef);
      const ratings = snapshot.val();
      
      if (ratings) {
        const ratingValues = Object.values(ratings).map((r: any) => r.rating);
        const average = ratingValues.reduce((a: number, b: number) => a + b, 0) / ratingValues.length;
        setAverageRating(average);
      }
    };

    checkRatingEligibility();
    getAverageRating();
  }, [id, user]);

  const handleRating = async (rating: number) => {
    if (!user || !canRate) return;

    try {
      const ratingRef = ref(rtdb, `ratings/${id}/${user.uid}`);
      await set(ratingRef, {
        rating,
        userId: user.uid,
        timestamp: new Date().toISOString()
      });

      setUserRating(rating);
      toast.success("Thank you for rating this product!");

      const ratingsRef = ref(rtdb, `ratings/${id}`);
      const snapshot = await get(ratingsRef);
      const ratings = snapshot.val();
      
      if (ratings) {
        const ratingValues = Object.values(ratings).map((r: any) => r.rating);
        const average = ratingValues.reduce((a: number, b: number) => a + b, 0) / ratingValues.length;
        setAverageRating(average);
      }
    } catch (error) {
      console.error("Error saving rating:", error);
      toast.error("Failed to save your rating. Please try again.");
    }
  };

  return (
    <div className="bg-green-100 dark:bg-greenPalette.gunmetal rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            -{discount}%
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-greenPalette.castletonDark">{name}</h3>
        
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 cursor-${canRate ? 'pointer' : 'default'} ${
                (hoverRating !== null ? i < hoverRating : i < (userRating || averageRating))
                  ? "text-greenPalette.castleton fill-greenPalette.castleton"
                  : "text-gray-300"
              }`}
              onClick={() => canRate && handleRating(i + 1)}
              onMouseEnter={() => canRate && setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(null)}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
            ({averageRating.toFixed(1)})
          </span>
        </div>

        <div className="mb-4">
          <span className="text-xl font-bold text-greenPalette.castleton">
            {formatPrice(calculateDiscountedPrice(price, discount))}
          </span>
          {discount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                {formatPrice(price)}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Button
            onClick={() => {
              const discountedPrice = calculateDiscountedPrice(price, discount);
              addToCart({ id, name, price: discountedPrice, image });
              toast.success("Added to cart!");
            }}
            className="w-full bg-greenPalette.castleton hover:bg-greenPalette.castletonDark text-white transition-colors"
          >
            Add to Cart
          </Button>

          <Button
            onClick={handleBuyNow}
            variant="outline"
            className="w-full border-greenPalette.castleton text-greenPalette.castleton hover:bg-greenPalette.castleton/10 dark:border-greenPalette.castletonDark dark:text-greenPalette.castletonDark dark:hover:bg-greenPalette.castletonDark/20"
          >
            Buy Now
          </Button>
        </div>

        {user && !canRate && !userRating && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            Purchase and receive this item to rate it
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;