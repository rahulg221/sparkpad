import React from 'react';
import { Modal } from './Modal';
import { ModalContent } from './Modal.Styles';
import { LoadingSpinner } from '../../styles/shared/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MarkdownWrapper } from '../../styles/shared/BaseLayout';
import { SmallHeader } from '../toolbar/ToolBar.Styles';

interface SortingUpdatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sortingUpdates: string[];
  clusteredUpdates: string[];
  onSave: () => void;
}

export const SortingUpdatesModal: React.FC<SortingUpdatesModalProps> = ({
  isOpen,
  onClose,
  sortingUpdates,
  clusteredUpdates,
  onSave
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} onSave={onSave} title="Sorting Updates">
        <SmallHeader>Moved to existing sparkpad</SmallHeader>
        {sortingUpdates.length > 0 ? (
            sortingUpdates.map((update, index) => (
                <h2 key={index}>{update}</h2>
            ))
        ) : (
            <h2>No notes moved to existing sparkpads</h2>
        )}
        <SmallHeader>Moved to suggested sparkpad</SmallHeader>
        {clusteredUpdates.length > 0 ? (
            clusteredUpdates.map((update, index) => (
                <h2 key={index}>{update}</h2>
            ))
        ) : (
            <h2>No new sparkpads created</h2>
        )}
      </Modal>
    );
};
