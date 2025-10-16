import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, showClose = true, duration, ...props }) {
        const hasDuration = duration && duration !== Infinity && duration > 0;
        
        return (
          <Toast key={id} duration={duration} {...props}>
            <div className="grid gap-1 flex-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
              {hasDuration && (
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden mt-2">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ 
                      animation: `progress-bar ${duration}ms linear forwards`
                    }}
                  />
                </div>
              )}
            </div>
            {action}
            {showClose && <ToastClose />}
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
