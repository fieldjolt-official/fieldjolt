"use client";

import { Toaster } from "@fieldjolt/ui/components/sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/react";
import { QueryClientWrapper } from "./query-client";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <QueryClientWrapper>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          {children}
          <Toaster richColors />
        </ThemeProvider>
        <ReactQueryDevtools />
      </QueryClientWrapper>
    </NuqsAdapter>
  );
}
