import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
        destructive: "bg-red-500 text-white shadow-sm hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
        outline: "border border-slate-200 bg-white shadow-xs hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        secondary: "bg-emerald-500 text-white shadow-xs hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700",
        ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
        glass: "bg-white/70 backdrop-blur-md border border-white/40 shadow-sm hover:bg-white/90 dark:bg-slate-900/70 dark:border-slate-800/80 dark:hover:bg-slate-900/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
