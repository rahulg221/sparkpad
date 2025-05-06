import React from 'react';
import { Modal } from './Modal';
import { ModalContent, CategoryHeader, ModalText } from './Modal.Styles';
import { SmallHeader } from '../toolbar/ToolBar.Styles';
import { CustomDropdown } from '../dropdown/Dropdown';

interface UpdateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  noteContent: string;
  newCategory: string;
  setNewCategory: (val: string) => void;
  categories: string[];
}

export const UpdateNoteModal: React.FC<UpdateNoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  noteContent,
  newCategory,
  setNewCategory,
  categories
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} onSave={onSave} title="Move Spark">
      <ModalContent>
        <CategoryHeader>Content</CategoryHeader>
        <ModalText>{noteContent}</ModalText>
        <CategoryHeader>Move to</CategoryHeader>
        <CustomDropdown
          value={newCategory}
          onChange={(val: string | number) => setNewCategory(val as string)}
          options={categories}
        />
      </ModalContent>
    </Modal>
  );
};
