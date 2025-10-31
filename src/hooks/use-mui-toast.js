import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';



const ToastContext = createContext(undefined);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, variant = 'info', duration = 6000) => {
    const id = Date.now().toString();
    const newToast = { id, message, variant, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  };

  const toast = (options) => {
    const message = options.title ? `${options.title}: ${options.description}` : options.description;
    const variant = options.variant === 'destructive' ? 'error' : 'success';
    showToast(message, variant);
  };

  const handleClose = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, toast }}>
      {children}
      {toasts.map((toastItem) => (
        <Snackbar
          key={toastItem.id}
          open={true}
          autoHideDuration={toastItem.duration}
          onClose={() => handleClose(toastItem.id)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          sx={{ 
            '& .MuiSnackbar-root': { 
              position: 'relative',
              marginBottom: toasts.findIndex(t => t.id === toastItem.id) * 70 
            }
          }}
        >
          <Alert 
            onClose={() => handleClose(toastItem.id)} 
            severity={toastItem.variant}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {toastItem.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Compatibility layer for existing shadcn/ui toast usage
export const useMuiToast = useToast;