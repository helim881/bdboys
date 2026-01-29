"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react"; // Optional: adding icons for better UX
import { useEffect } from "react";

interface ErrorPageProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Data fetching error:", error);
  }, [error]);

  return (
    <div className="h-screen flex justify-center items-center p-10 bg-background">
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-6">
        <div className="p-4 bg-destructive/10 rounded-full">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Oops! Data fetch failed
          </h1>
          <p className="text-muted-foreground">
            {error?.message ||
              "We encountered an unexpected error while loading this content."}
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={reset || (() => window.location.reload())}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Try again
          </Button>

          <Button variant="outline" onClick={() => window.location.assign("/")}>
            Go Home
          </Button>
        </div>

        {error?.digest && (
          <p className="text-xs text-muted-foreground mt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
