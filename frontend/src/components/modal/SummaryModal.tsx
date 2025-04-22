import React from 'react';
import { Modal } from './Modal';
import { ModalContent } from './Modal.Styles';
import { LoadingSpinner } from '../../styles/shared/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MarkdownWrapper } from '../../styles/shared/BaseLayout';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string;
  isSummaryLoading: boolean;
  onSave: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  onClose,
  summary,
  isSummaryLoading,
  onSave
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} onSave={onSave} title="Snapshot">
      {isSummaryLoading ? <LoadingSpinner /> : (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                p: ({node, ...props}) => (
                    <p style={{ fontSize: "1rem", margin: "0.25rem 0" }} {...props} />
                )
            }}
            >
            {summary}
        </ReactMarkdown>
      )}
      </Modal>
    );
};
