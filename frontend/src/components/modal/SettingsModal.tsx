import React from 'react';
import { Modal } from './Modal';
import { ModalText } from './Modal.Styles';
import { SmallHeader } from '../toolbar/ToolBar.Styles';
import { MdEventAvailable } from 'react-icons/md';
import { MdLogout } from 'react-icons/md';
import { SecondaryButton, TextButton } from '../../styles/shared/Button.styles';
import { ThemeToggle } from './themetoggle/ThemeToggle';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  setIsSettingsVisible: (isSettingsVisible: boolean) => void;
  handleCalendarClick: () => void;
  handleLogout: () => void; 
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  setIsSettingsVisible,
  handleCalendarClick,
  handleLogout
}) => {
  return (
    <Modal
        isOpen={true}
        onSave={() => setIsSettingsVisible(false)}
        onClose={() => setIsSettingsVisible(false)}
        title="Settings"
    >
    <ThemeToggle />
    <TextButton onClick={handleCalendarClick}>
        <MdEventAvailable size={20}/>
        Sync Google
    </TextButton>
    <TextButton onClick={handleLogout}>
        <MdLogout size={20}/>
        Logout
    </TextButton>
    </Modal>    
    );
};
