import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, className }) => {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={cn('relative bg-white rounded-lg shadow-lg w-full max-w-md p-6', className)}>
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
