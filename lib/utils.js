import clsx from "clsx";
import { twMerge } from "tailwind-merge";

// `cn` combines classes and resolves Tailwind CSS conflicts.
export function cn(...classes) {
  return twMerge(clsx(classes));
}
