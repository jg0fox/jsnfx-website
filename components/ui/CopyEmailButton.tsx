"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Check, Copy } from "lucide-react";

interface CopyEmailButtonProps {
  email?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

export function CopyEmailButton({
  email = "jasongfox@gmail.com",
  variant = "primary",
  size = "md",
  children,
}: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  return (
    <Button variant={variant} size={size} onClick={handleCopy}>
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Copied!
        </>
      ) : (
        children || email
      )}
    </Button>
  );
}
