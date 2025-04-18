import React from 'react';
import { Modal } from './Modal';
import { ModalContent } from './Modal.Styles';
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
    <Modal isOpen={isOpen} onClose={onClose} onSave={onSave} title="Edit Spark">
      <ModalContent>
        <h2>{noteContent}</h2>
        <SmallHeader>Move to</SmallHeader>
        <CustomDropdown
          value={newCategory}
          onChange={(val: string | number) => setNewCategory(val as string)}
          options={categories}
        />
      </ModalContent>
    </Modal>
  );
};
