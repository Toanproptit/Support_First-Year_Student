import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import "../styles/toast.css";

const ToastContext = createContext(null);

function generateId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(id);
  }, []);

  const show = useCallback(
    ({ type = "info", title, message, durationMs = 3500 } = {}) => {
      const id = generateId();
      setToasts((prev) => [{ id, type, title, message }, ...prev].slice(0, 4));
      if (durationMs > 0) {
        const timer = setTimeout(() => remove(id), durationMs);
        timersRef.current.set(id, timer);
      }
      return id;
    },
    [remove]
  );

  const value = useMemo(() => ({ show, remove }), [show, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-relevant="additions removals">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`} role="status">
            <div className="toast-body">
              {t.title ? <div className="toast-title">{t.title}</div> : null}
              {t.message ? <div className="toast-message">{t.message}</div> : null}
            </div>
            <button className="toast-close" onClick={() => remove(t.id)} aria-label="Đóng thông báo">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>.");
  return ctx;
}

