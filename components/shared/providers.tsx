"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: "text-sm",
            duration: 3000,
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
