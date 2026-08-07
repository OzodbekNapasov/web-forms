import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
        secondary: "border-transparent bg-emerald-500 text-white hover:bg-emerald-600",
        destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
        outline: "text-slate-950 dark:text-slate-50 border border-slate-300 dark:border-slate-700",
        draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        published: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
        archived: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
        closed: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
