import { toast as sonnerToast } from "sonner";

interface ToastProps {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

export const useToast = () => {
  return {
    toast: ({ title, description, variant = "default" }: ToastProps) => {
      if (variant === "destructive") {
        sonnerToast.error(title, {
          description,
        });
      } else {
        sonnerToast.success(title, {
          description,
        });
      }
    },
  };
};

// For direct usage without the hook
export const toast = {
  success: (title: string, description?: string) => {
    sonnerToast.success(title, { description });
  },
  error: (title: string, description?: string) => {
    sonnerToast.error(title, { description });
  },
  info: (title: string, description?: string) => {
    sonnerToast.info(title, { description });
  },
  warning: (title: string, description?: string) => {
    sonnerToast.warning(title, { description });
  },
};
