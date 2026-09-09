import React from 'react';

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  danger?: boolean;
}

/** Confirmation modal for destructive or major actions */
export function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  danger = true,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" 
        onClick={onCancel} 
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm m-4 z-10 p-8 text-center border border-stone-100">
        <h3 className="font-serif text-xl font-bold text-luxury-emerald-950 mb-2">{title}</h3>
        <p className="text-stone-500 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={onCancel} 
            className="flex-1 py-3 bg-stone-100 text-stone-700 text-xs font-bold rounded-lg hover:bg-stone-200 uppercase transition-all duration-250 cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={onConfirm} 
            className={`flex-1 py-3 text-white text-xs font-bold rounded-lg uppercase transition-all duration-250 cursor-pointer ${
              danger 
                ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-md shadow-red-200' 
                : 'bg-luxury-emerald-950 hover:bg-luxury-emerald-900 active:bg-luxury-emerald-800 shadow-md shadow-emerald-900/10'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
