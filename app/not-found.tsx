"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <p className="text-8xl font-bold text-palm-leaf mb-4">404</p>

        {/* Message */}
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Page not found
        </h1>
        <p className="text-text-secondary mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-palm-leaf text-white font-medium rounded-lg hover:bg-palm-leaf-3 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go home
          </Link>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-soft-linen-dark text-text-primary font-medium rounded-lg hover:bg-soft-linen-dark/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
