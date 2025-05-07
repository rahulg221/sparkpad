import React from 'react';
import { Modal } from './Modal';
import { ModalText, CategoryHeader } from './Modal.Styles';
import { SmallHeader } from '../toolbar/ToolBar.Styles';
import { IoPencilOutline, IoSparkles, IoSparklesOutline } from 'react-icons/io5';
import { FaPen } from 'react-icons/fa6';
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
  const groupedSortingUpdates = groupUpdatesByCategory(sortingUpdates);
  const groupedClusteredUpdates = groupUpdatesByCategory(clusteredUpdates);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} onSave={onSave} title="Results">
        {sortingUpdates.length === 0 && clusteredUpdates.length === 0 && (
            <p>No changes made</p>
        )}
        {Object.entries(groupedSortingUpdates).map(([category, notes]) => (
            <div key={category}>
                <CategoryHeader>Moved to {category}</CategoryHeader>
                {notes.map((note, index) => (
                    <ModalText key={index}>- {note}</ModalText>
                ))}
            </div>
        ))}
        {Object.entries(groupedClusteredUpdates).map(([category, notes]) => (
            <div key={category}>
                <CategoryHeader>
                  {category} <p className="helper-text">New <IoSparkles /></p>
                </CategoryHeader>
                {notes.map((note, index) => (
                    <ModalText key={index}>- {note}</ModalText>
                ))}
            </div>
        ))}
      </Modal>
    );
};

const groupUpdatesByCategory = (updates: string[]) => {
  const grouped: Record<string, string[]> = {};

  updates.forEach((update) => {
    const [category, content] = update.split(" - ", 2);
    if (category && content) {
      const key = category.trim();
      const value = content.trim();
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(value);
    }
  });

  return grouped;
};