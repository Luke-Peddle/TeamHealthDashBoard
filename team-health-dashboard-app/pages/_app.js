import '../app/globals.css';
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '../app/contexts/AuthContext'; // Fixed import path
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, 
        refetchOnWindowFocus: true,
        retry: 3, 
      },
    },
  }));

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default MyApp;