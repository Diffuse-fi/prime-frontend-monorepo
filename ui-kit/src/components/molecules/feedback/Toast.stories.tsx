import type { Story } from "@ladle/react";
import { Toast } from "./Toast";
import { useState } from "react";

export const Default: Story = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="p-8">
      <ul className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <Toast open={open} message="This is a toast notification" onClose={() => setOpen(false)} />
      </ul>
    </div>
  );
};

export const WithTitle: Story = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="p-8">
      <ul className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <Toast
          open={open}
          title="Success"
          message="Your transaction was completed successfully"
          onClose={() => setOpen(false)}
        />
      </ul>
    </div>
  );
};

export const Closeable: Story = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="p-8">
      <ul className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <Toast
          open={open}
          title="Notification"
          message="You can close this toast"
          closeable
          onClose={() => setOpen(false)}
        />
      </ul>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-primary text-fg rounded"
        >
          Show Toast
        </button>
      )}
    </div>
  );
};

export const AutoDismiss: Story = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="p-8">
      <ul className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <Toast
          open={open}
          message="This will auto-dismiss in 3 seconds"
          duration={3000}
          closeable
          onClose={() => setOpen(false)}
        />
      </ul>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-primary text-fg rounded"
        >
          Show Toast Again
        </button>
      )}
    </div>
  );
};

export const MultipleToasts: Story = () => {
  const [toasts, setToasts] = useState([
    { id: 1, message: "First notification", open: true },
    { id: 2, message: "Second notification", open: true },
    { id: 3, message: "Third notification", open: true },
  ]);

  return (
    <div className="p-8">
      <ul className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            open={toast.open}
            message={toast.message}
            closeable
            onClose={() => {
              setToasts(prev =>
                prev.map(t => (t.id === toast.id ? { ...t, open: false } : t))
              );
            }}
          />
        ))}
      </ul>
      <button
        onClick={() => {
          const newId = Math.max(...toasts.map(t => t.id), 0) + 1;
          setToasts(prev => [
            ...prev,
            { id: newId, message: `Notification ${newId}`, open: true },
          ]);
        }}
        className="px-4 py-2 bg-primary text-fg rounded"
      >
        Add Toast
      </button>
    </div>
  );
};

export const DifferentVariants: Story = () => {
  const [toasts, setToasts] = useState([
    { id: 1, title: "Success", message: "Operation completed", open: true },
    { id: 2, title: "Error", message: "Something went wrong", open: true },
    { id: 3, title: "Warning", message: "Please check your input", open: true },
    { id: 4, title: "Info", message: "Here's some information", open: true },
  ]);

  return (
    <div className="p-8">
      <ul className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            open={toast.open}
            title={toast.title}
            message={toast.message}
            closeable
            onClose={() => {
              setToasts(prev =>
                prev.map(t => (t.id === toast.id ? { ...t, open: false } : t))
              );
            }}
          />
        ))}
      </ul>
    </div>
  );
};

export const LongMessage: Story = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="p-8">
      <ul className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        <Toast
          open={open}
          title="Detailed Information"
          message="This is a much longer toast message that contains multiple sentences and more detailed information. It demonstrates how the toast handles longer content and whether it wraps properly."
          closeable
          onClose={() => setOpen(false)}
        />
      </ul>
    </div>
  );
};
