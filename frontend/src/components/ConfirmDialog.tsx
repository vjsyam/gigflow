interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-sm p-6 animate-slide-up">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-[var(--text-muted)] text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button className="btn-ghost flex-1" onClick={onCancel}>Cancel</button>
          <button className="btn-danger flex-1" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
