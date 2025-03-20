import { useState } from 'react';
import { 
  TextBarContainer, 
  TextBarForm, 
  TextInput, 
  SubmitButton 
} from '../styles/components/textbar/TextBar.styles';

interface TextBarProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export const TextBar = ({ 
  onSubmit, 
  placeholder = 'Type a message...', 
  isLoading = false 
}: TextBarProps) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
    }
  };

  return (
    <TextBarContainer>
      <TextBarForm onSubmit={handleSubmit}>
        <TextInput
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
        />
        <SubmitButton type="submit" disabled={isLoading || !text.trim()}>
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </SubmitButton>
      </TextBarForm>
    </TextBarContainer>
  );
}; 