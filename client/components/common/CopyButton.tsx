"use client";

import { Copy, CheckCheck } from "lucide-react";
import { useState } from "react";

interface CopyButtonProps {
  couponCode: string;
}

export default function CopyButton({ couponCode }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className="ml-2 p-2 text-blue-600 hover:bg-blue-50 active:bg-green-200 transition-all duration-200 rounded-full transition-colors"
      onClick={handleCopy}
      aria-label="Copy coupon code"
    >
      {copied ? <CheckCheck size={16} color="green" /> : <Copy size={16} />}
    </button>
  );
}
