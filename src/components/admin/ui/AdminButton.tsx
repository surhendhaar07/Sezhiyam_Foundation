// src/components/admin/ui/AdminButton.tsx
"use client";

import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}

export default function AdminButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
}: Props) {
  const variants = {
    primary: "bg-brand-orange text-white hover:bg-brand-orange-dark shadow-sm",
    secondary: "bg-brand-green text-white hover:bg-brand-green-dark shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    ghost: "text-neutral-700 hover:bg-neutral-100 border border-neutral-200",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]}`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}