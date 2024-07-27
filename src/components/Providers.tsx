"use client";

import * as React from "react";
// import { ThemeProvider as NextThemesProvider } from "next-themes";
// import { type ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();
export function Provider({ children}: any) {
  return (
    <QueryClientProvider client={queryClient}> {children}
      {/* <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        {...props}
      >
        <SessionProvider>{children}</SessionProvider>
      </NextThemesProvider> */}
    </QueryClientProvider>
  );
}