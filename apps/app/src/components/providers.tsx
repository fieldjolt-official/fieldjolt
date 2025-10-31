"use client";

import { ReactQueryDevtools, TRPCReactProvider } from "@fieldjolt/api/react";
import { Toaster } from "@fieldjolt/ui/components/sonner";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/react";
import { Suspense } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <NuqsAdapter>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableColorScheme
            enableSystem
          >
            {children}
            <Toaster richColors />
          </ThemeProvider>
          <ReactQueryDevtools />
        </TRPCReactProvider>
      </NuqsAdapter>
    </Suspense>
  );
}
