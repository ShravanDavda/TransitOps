import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you absolutely sure?',
  description = 'This action cannot be undone. This will permanently remove the record and any associated operations history.',
  confirmText = 'Delete Record',
  cancelText = 'Cancel',
  isLoading = false
}) => {
  const footerActions = (
    <>
      <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
        {cancelText}
      </Button>
      <Button variant="danger" size="sm" onClick={onConfirm} loading={isLoading}>
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={footerActions}
    >
      <div className="flex items-start gap-4 py-1">
        <div className="p-2.5 bg-rose-50 rounded-lg text-rose-600 flex-shrink-0 border border-rose-100">
          <AlertTriangle className="h-5 w-5 stroke-[2]" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
