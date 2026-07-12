
import { AlertTriangle } from "lucide-react";
import Button from "./Button";
import Modal from "./Modal";

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm action",
  description = "Are you sure you want to continue?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {cancelLabel}
          </Button>

          <Button
            variant={danger ? "danger" : "primary"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="ui-confirm">
        <div
          className={ui-confirm__icon ${
            danger ? "ui-confirm__icon--danger" : ""
          }}
        >
          <AlertTriangle size={22} />
        </div>

        <p>{description}</p>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
