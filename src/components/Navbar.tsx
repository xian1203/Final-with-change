import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "./ui/button";
import { ShoppingCart, Package2, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface NavbarProps {
  onCartClick: () => void;
}

const Navbar = ({ onCartClick }: NavbarProps) => {
  const { items } = useCart();
  const { logout, isAdmin } = useAuth();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-card dark:bg-gray-800/95 border-b backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <img
              src="/src/assets/logo.png" // Ensure this path matches the actual location of the logo
              alt="Whispering Leaves Cafe Logo"
              className="h-8 w-8 object-contain"
            />
            <Link to="/" className="text-xl font-bold text-greenPalette.castleton hover:text-greenPalette.castletonDark transition-colors">
              Whispering Leaves Cafe
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Home
              </Button>
            </Link>

            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" className="border-greenPalette.castleton text-greenPalette.castleton hover:bg-greenPalette.castleton/10 dark:border-greenPalette.castletonDark dark:text-greenPalette.castletonDark dark:hover:bg-greenPalette.castletonDark/20">
                  Admin Dashboard
                </Button>
              </Link>
            )}
            
            <Link to="/orders">
              <Button variant="ghost" className="flex items-center gap-2">
                <Package2 className="h-5 w-5" />
                My Orders
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-greenPalette.castleton text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-greenPalette.castleton text-greenPalette.castleton hover:bg-greenPalette.castleton/10 dark:border-greenPalette.castletonDark dark:text-greenPalette.castletonDark dark:hover:bg-greenPalette.castletonDark/20"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;