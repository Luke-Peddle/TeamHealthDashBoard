import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

const DarkModeButton = ({isDark, onToggle, isLoading = false}) => {

  return (
    <Button
    variant = "ghost"
    size = "icon"
    onClick = {onToggle}
    disabled = {isLoading}
    className = "h-10 w-10"
    >
        
            {isDark ? (
                <Moon className="h-5 w-5" />
            ) : (
                <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export default DarkModeButton