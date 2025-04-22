import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalContent,
  ModalFooter
} from './Modal.Styles';
import { TextButton } from '../../styles/shared/Button.styles';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  title, 
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
        <ModalHeader>
          <h1>{title}</h1>
        </ModalHeader>
        <ModalContent>
          {children}
        </ModalContent>
        <ModalFooter>
          {onSave && <TextButton onClick={onSave}>Save</TextButton>}
          <TextButton onClick={onClose}>Close</TextButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>,
    document.body
  );
};