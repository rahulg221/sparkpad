import React, { useState } from 'react';
import { Modal } from './Modal';
import { ModalContent, ModalInput } from './Modal.Styles';
import { LoadingSpinner } from '../../styles/shared/LoadingSpinner';
import { SmallHeader } from '../../components/toolbar/ToolBar.Styles';

interface NewNotepadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export const NewNotepadModal: React.FC<NewNotepadModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Modal isOpen={isOpen} onClose={onClose} onSave={async () => {
            setIsLoading(true);
            await onSave(name);
            setIsLoading(false);
        }} title="New Sparkpad">
            { isLoading ? (
                <LoadingSpinner />
            ) : (
                <ModalContent>
                    <SmallHeader>Pick a name</SmallHeader>
                    <ModalInput 
                        type="text" 
                        placeholder="Favorite quotes... Project ideas... etc." 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={async (e) => { 
                            if (e.key === "Enter" && !e.shiftKey && name.trim() !== "") {
                                e.preventDefault();
                                setIsLoading(true);
                                await onSave(name);
                                setIsLoading(false);
                            }
                    }}
                    />
                </ModalContent> 
            )}
        </Modal>
    );
};
