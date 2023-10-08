import { writable } from "svelte/store";
import uniqid from "uniqid";

type ToastMessage = {
  type: "info" | "warning" | "error" | "success";
  message: string;
  id: string;
};

function createToastsStore() {
  const { subscribe, update } = writable<ToastMessage[]>([]);
  const removeToast = (id: string) => {
    update((toasts: any[]) =>
      toasts.filter((toast: { id: string }) => toast.id !== id)
    );
  };
  const addToast = ({
    type,
    message,
    id,
    timeout = 3000,
  }: {
    type: ToastMessage["type"];
    message: string;
    id: string;
    timeout?: number;
  }) => {
    update((toasts: any[]) => [
      ...toasts,
      {
        type,
        message,
        id: id,
      },
    ]);
    if (timeout) {
      setTimeout(() => {
        removeToast(id);
      }, timeout);
    }
  };
  return {
    subscribe,
    info: (message: string, timeout?: number) =>
      addToast({ type: "info", message, id: uniqid(), timeout }),
    warning: (message: string, timeout?: number) =>
      addToast({ type: "warning", message, id: uniqid(), timeout }),
    success: (message: string, timeout?: number) =>
      addToast({ type: "success", message, id: uniqid(), timeout }),
    error: (message: string, timeout?: number) =>
      addToast({ type: "error", message, id: uniqid(), timeout }),
    remove: (id: string) => {
      removeToast(id);
    },
  };
}

export default createToastsStore();
