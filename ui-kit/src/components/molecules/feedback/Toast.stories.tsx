import type { Story, StoryDefault } from "@ladle/react";

import { useState } from "react";

import { Toast } from "./Toast";

export default {
  title: "Molecules/Feedback/Toast",
} satisfies StoryDefault;

export const Default: Story = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="p-8">
      <ul className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
        <Toast
          message="This is a toast notification"
          onClose={() => setOpen(false)}
          open={open}
        />
      </ul>
    </div>
  );
};

export const WithTitle: Story = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="p-8">
      <ul className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
        <Toast
          message="Your transaction was completed successfully"
          onClose={() => setOpen(false)}
          open={open}
          title="Success"
        />
      </ul>
    </div>
  );
};

export const Closeable: Story = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="p-8">
      <ul className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
        <Toast
          closeable
          message="You can close this toast"
          onClose={() => setOpen(false)}
          open={open}
          title="Notification"
        />
      </ul>
      {!open && (
        <button
          className="bg-primary text-fg rounded px-4 py-2"
          onClick={() => setOpen(true)}
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
      <ul className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
        <Toast
          closeable
          duration={3000}
          message="This will auto-dismiss in 3 seconds"
          onClose={() => setOpen(false)}
          open={open}
        />
      </ul>
      {!open && (
        <button
          className="bg-primary text-fg rounded px-4 py-2"
          onClick={() => setOpen(true)}
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
      <ul className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <Toast
            closeable
            key={toast.id}
            message={toast.message}
            onClose={() => {
              setToasts(prev =>
                prev.map(t => (t.id === toast.id ? { ...t, open: false } : t))
              );
            }}
            open={toast.open}
          />
        ))}
      </ul>
      <button
        className="bg-primary text-fg rounded px-4 py-2"
        onClick={() => {
          const newId = Math.max(...toasts.map(t => t.id), 0) + 1;
          setToasts(prev => [
            ...prev,
            { id: newId, message: `Notification ${newId}`, open: true },
          ]);
        }}
      >
        Add Toast
      </button>
    </div>
  );
};

export const DifferentVariants: Story = () => {
  const [toasts, setToasts] = useState([
    { id: 1, message: "Operation completed", open: true, title: "Success" },
    { id: 2, message: "Something went wrong", open: true, title: "Error" },
    { id: 3, message: "Please check your input", open: true, title: "Warning" },
    { id: 4, message: "Here's some information", open: true, title: "Info" },
  ]);

  return (
    <div className="p-8">
      <ul className="fixed right-4 bottom-4 z-50 flex max-w-sm flex-col gap-2">
        {toasts.map(toast => (
          <Toast
            closeable
            key={toast.id}
            message={toast.message}
            onClose={() => {
              setToasts(prev =>
                prev.map(t => (t.id === toast.id ? { ...t, open: false } : t))
              );
            }}
            open={toast.open}
            title={toast.title}
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
      <ul className="fixed right-4 bottom-4 z-50 flex max-w-md flex-col gap-2">
        <Toast
          closeable
          message="This is a much longer toast message that contains multiple sentences and more detailed information. It demonstrates how the toast handles longer content and whether it wraps properly."
          onClose={() => setOpen(false)}
          open={open}
          title="Detailed Information"
        />
      </ul>
    </div>
  );
};
