'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Button({ children, className, variant = 'primary', size = 'md', ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-tata-red/50 disabled:opacity-50 disabled:cursor-not-allowed font-display";
  
  const variants = {
    primary: "bg-tata-red hover:bg-tata-red-dark text-white shadow-lg shadow-tata-red/20 hover:shadow-tata-red/40",
    secondary: "bg-white/5 border border-white/10 hover:bg-white/10 text-white backdrop-blur-sm",
    outline: "border border-tata-red text-tata-red hover:bg-tata-red/10 bg-transparent",
    ghost: "bg-transparent hover:bg-white/5 text-muted-foreground hover:text-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg font-semibold",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
