import { useEffect } from "react";

export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 1600);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="brutal-border brutal-shadow pointer-events-none fixed bottom-10 left-1/2 z-[60] -translate-x-1/2 bg-arcio-accent px-3 py-2 font-ui text-[13px] font-semibold text-arcio-text"
      style={{ borderRadius: "var(--radius)" }}
      role="status"
    >
      {message}
    </div>
  );
}
