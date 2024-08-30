import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value:number) {
  return Intl.NumberFormat("en-US",{
    style: "currency",
    currency: "INR",
    minimumFractionDigits:2
  }).format(value);
}