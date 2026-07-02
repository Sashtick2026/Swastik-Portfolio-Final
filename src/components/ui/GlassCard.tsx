import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
}

export default function GlassCard({ children, className = "", onClick, id }: GlassCardProps) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`glass-card glass-card-hover rounded-2xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden group ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Subtle top reflection glare lines */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />

      {/* Interactive internal hover glow spot */}
      <div className="absolute -inset-px bg-gradient-to-r from-accent-purple/0 via-accent-purple/5 to-accent-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {children}
    </div>
  );
}
