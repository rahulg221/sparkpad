import { useState } from 'react';
import {
  Wrapper,
  Container,
  Title,
  Content,
  TextArea
} from '../styles/ElevatedContainerStyles';
import { SubmitButton } from '../styles/DashboardStyles';

interface ElevatedContainerProps {
    onSubmit: (content: string) => void;
    title?: string;
    buttonText?: string;
}

export const ElevatedContainer = ({ 
    onSubmit, 
    title = "Create Note", 
    buttonText = "Submit" 
}: ElevatedContainerProps) => {
    const [content, setContent] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        if (content.trim()) {
            onSubmit(content);
            setContent('');
            setIsOpen(false);
        }
    };

    return (
        <Wrapper>
            {isOpen && (
                <Container>
                    <Title>{title}</Title>
                    <Content>
                        <TextArea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Type your content here..."
                            autoFocus
                        />
                        <SubmitButton 
                            type="button"
                            onClick={handleSubmit}
                            disabled={!content.trim()}
                        >
                            {buttonText}
                        </SubmitButton>
                    </Content>
                </Container>
            )}
        </Wrapper>
    );
}; 