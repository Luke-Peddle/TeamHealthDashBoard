import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

const DarkModeButton = ({isDark, onToggle, isLoading = false}) => {
  


  const handleClick = () => {
    console.log('DarkModeButton clicked - current isDark:', isDark);
    onToggle();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isLoading}
      className="h-10 w-10 relative"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isLoading ? (
        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <>
          {isDark ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </>
      )}
      <span className="sr-only">
        {isLoading ? "Switching theme..." : "Toggle theme"}
      </span>
      {/* Debug indicator - remove in production */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
        {isDark ? 'Dark' : 'Light'}
      </div>
    </Button>
  )
}

export default DarkModeButton