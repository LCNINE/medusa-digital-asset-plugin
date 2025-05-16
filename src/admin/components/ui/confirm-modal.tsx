import { Prompt } from "@medusajs/ui";
import { ReactNode } from "react";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  isLoading: boolean;
  actionText: string;
  loadingText: string;
  cancelText: string;
};

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading,
  actionText,
  loadingText,
  cancelText,
}: ConfirmModalProps) => {
  return (
    <Prompt open={isOpen} onOpenChange={onClose}>
      <Prompt.Content>
        <Prompt.Header>
          <Prompt.Title>{title}</Prompt.Title>
          <Prompt.Description>{description}</Prompt.Description>
        </Prompt.Header>
        <Prompt.Footer>
          <Prompt.Cancel onClick={onClose}>{cancelText}</Prompt.Cancel>
          <Prompt.Action onClick={onConfirm} disabled={isLoading}>
            {isLoading ? loadingText : actionText}
          </Prompt.Action>
        </Prompt.Footer>
      </Prompt.Content>
    </Prompt>
  );
};

export default ConfirmModal;
