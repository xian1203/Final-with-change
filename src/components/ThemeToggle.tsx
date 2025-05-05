import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-10 h-10 bg-greenPalette.castleton text-greenPalette.white"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 transition-all text-greenPalette.britishRacing" />
      ) : (
        <Moon className="h-5 w-5 transition-all text-greenPalette.castletonDark" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}