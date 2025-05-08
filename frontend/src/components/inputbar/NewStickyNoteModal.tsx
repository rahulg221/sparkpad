import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalContent,
  ModalFooter,
  ModalDateHint
} from './NewStickyNoteModal.Styles';
import { PrimaryButton, SecondaryButton } from '../../styles/shared/Button.styles';
import { FaCalendar } from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa';

interface NewStickyNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  title: string;
  dateHint: string;
  content: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const NewStickyNoteModal: React.FC<NewStickyNoteModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  title, 
  dateHint,
  content,
  children}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Close on escape key press
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent scrolling while modal is open
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto'; // Restore scrolling
    };
  }, [isOpen, onClose]);

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  // Create a portal to render the modal outside the normal DOM hierarchy
  return createPortal(
    <ModalOverlay>
      <ModalContainer ref={modalRef}>
        <ModalContent>
          {children}
          {dateHint && <ModalDateHint>
          <span>
            <strong>Adding</strong> "{content}" <strong>on</strong> <em>{dateHint}</em>
          </span>
          <FaCalendar size={14} />
          </ModalDateHint>}
        </ModalContent>
        <ModalFooter>
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          {onSave && <PrimaryButton onClick={onSave}>Save</PrimaryButton>}
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>,
    document.body
  );
};