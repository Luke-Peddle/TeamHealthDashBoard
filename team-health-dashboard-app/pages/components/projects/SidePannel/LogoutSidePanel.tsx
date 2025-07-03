import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import LogoutButton from '../../LogoutButton/LogoutButton';

const LogOutSidePanel = ({ user_id, isOpen = false, onOpenChange }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = async () => {
    if (isToggling) return;

    setIsToggling(true);

    try {
      const currentTheme = resolvedTheme || theme;
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      const newDarkMode = newTheme === 'dark';

      setTheme(newTheme);

      const updateMode = {
        user_id: user_id,
        dark_mode: newDarkMode,
      };

      await axios.patch(`http://localhost:4000/api/users/darkMode`, updateMode);
    } catch (error) {
      console.error('Error updating theme:', error);
    } finally {
      setIsToggling(false);
    }
  };

  if (!mounted) {
    return null;
  }

  const currentTheme = resolvedTheme || theme || 'light';
  const isDark = currentTheme === 'dark';

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-80 sm:max-w-sm overflow-y-auto fixed top-0 right-0 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700"
      >
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Project Management
            </SheetTitle>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                disabled={isToggling}
                className="h-10 w-10 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isToggling ? (
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                ) : isDark ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </button>
              <LogoutButton />
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default LogOutSidePanel;