"use client";

import { Copy, CheckCheck } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface CopyButtonProps {
  couponCode: string;
}

export default function CopyButton({ couponCode }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!navigator.clipboard) {
      toast("Failed to copy.")
      return;
    }
  
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Failed to copy.")
    }
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
