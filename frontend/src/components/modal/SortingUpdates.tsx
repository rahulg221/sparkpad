import React from 'react';
import { Modal } from './Modal';
import { ModalText } from './Modal.Styles';
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
    <Modal isOpen={isOpen} onClose={onClose} onSave={onSave} title="Results">
        <SmallHeader>Sorted into my Sparkpads</SmallHeader>
        {sortingUpdates.length > 0 ? (
            sortingUpdates.map((update, index) => (
                <ModalText key={index}>{update}</ModalText>
            ))
        ) : (
            <ModalText>No sparks sorted into my sparkpads</ModalText>
        )}
        <SmallHeader>Grouped into suggested Sparkpads</SmallHeader>
        {clusteredUpdates.length > 0 ? (
            clusteredUpdates.map((update, index) => (
                <ModalText key={index}>{update}</ModalText>
            ))
        ) : (
            <ModalText>No sparks grouped into suggested sparkpads</ModalText>
        )}
      </Modal>
    );
};
