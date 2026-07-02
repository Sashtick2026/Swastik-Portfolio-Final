import React, { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

interface CustomButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline" | "minimal";
  showArrow?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function CustomButton({
  children,
  variant = "primary",
  showArrow = true,
  className = "",
  type = "button",
  disabled = false,
  onClick,
  ...props
}: CustomButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-medium tracking-wide text-sm transition-all duration-500 ease-out overflow-hidden active:scale-[0.98] cursor-pointer";

  const variants = {
    primary:
      "bg-accent-purple text-text-light hover:bg-accent-purple/90 border border-accent-purple shadow-[0_0_20px_rgba(123,46,255,0.3)] hover:shadow-[0_0_35px_rgba(123,46,255,0.5)]",
    outline:
      "border border-white/10 text-text-light hover:border-white/35 bg-white/5 hover:bg-white/10 backdrop-blur-md",
    minimal:
      "px-0 py-1 rounded-none text-text-light hover:text-accent-glow after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-accent-glow hover:after:with-all after:transition-all after:duration-300 hover:after:w-full",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {/* Glossy sheen effect on hover */}
      {variant !== "minimal" && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-none transition-transform duration-1000 ease-out group-hover:translate-x-full" />
      )}
      
      <span className="relative z-10 flex items-center gap-1.5 font-display font-medium">
        {children}
        {showArrow && (
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        )}
      </span>
    </button>
  );
}
