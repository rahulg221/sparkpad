import { useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import {
    AuthPageContainer,
    FormContainer,
    Title,
    Form,
    FormGroup,
    Input,
    ErrorMessage,
    StyledLink,
    LinkText,
    SuccessMessage
} from './Auth.styles';
import { PrimaryButton } from '../../styles/shared/Button.styles';
import { AuthService } from '../../api/authService';
import { NoteService } from '../../api/noteService';

export const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user, signUp, signIn } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(''); 
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        setIsLoading(true);
        const message = await signUp(email, password);

        if (message === 'Signup successful') {
            signIn(email, password);
            
            navigate('/dashboard');
        } else {
            setError(message);
        }
        setIsLoading(false);
    };

    return (
        <AuthPageContainer>
            <FormContainer>
                <Title>Sign Up</Title>
                <Form onSubmit={handleSubmit}>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {success && <SuccessMessage>{success}</SuccessMessage>}
                    <FormGroup>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            required
                        />
                    </FormGroup>
                    <PrimaryButton type="submit" disabled={isLoading}>
                        {isLoading ? 'Signing up...' : 'Sign Up'}
                    </PrimaryButton>
                </Form>
                <LinkText>
                    Already have an account? <StyledLink to="/login">Login</StyledLink>
                </LinkText>
            </FormContainer>
        </AuthPageContainer>
    );
};
