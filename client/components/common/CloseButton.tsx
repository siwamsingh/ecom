"use client"; // This makes it a client component

import { FiX } from "react-icons/fi";
import Button from "./Button"; // Using the reusable button component

interface CloseButtonProps {
  onClick: () => void;
}

export default function CloseButton({ onClick }: CloseButtonProps) {
  return (
    <Button onClick={onClick} className="p-2 bg-transparent text-black hover:bg-gray-200">
      <FiX size="1.5rem" />
    </Button>
  );
}
