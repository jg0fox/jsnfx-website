"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-bronze-spice/10 flex items-center justify-center">
          <span className="text-3xl">!</span>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Something went wrong
        </h1>
        <p className="text-text-secondary mb-8">
          An unexpected error occurred. Please try again or return to the home
          page.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-palm-leaf text-white font-medium rounded-lg hover:bg-palm-leaf-3 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-soft-linen-dark text-text-primary font-medium rounded-lg hover:bg-soft-linen-dark/50 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
