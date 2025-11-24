import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-niyya-lime text-niyya-darker hover:bg-niyya-lime/90 hover:scale-105",
    secondary: "bg-white/10 text-white hover:bg-white/20",
    outline: "border-2 border-niyya-lime text-niyya-lime hover:bg-niyya-lime hover:text-niyya-darker",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
