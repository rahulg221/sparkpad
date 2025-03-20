import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
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
    LinkText
} from '../styles/components/auth/Auth.styles';
import { PrimaryButton } from '../styles/shared/Button.styles';

export const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { signUp, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await signUp(email, password);
            navigate('/dashboard', { replace: true });
        } catch (err) {
            setError('Failed to create account');
            console.error('Signup failed:', err);
        }
    };

    return (
        <AuthPageContainer>
            <FormContainer>
                <Title>Sign Up</Title>
                <Form onSubmit={handleSubmit}>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
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
