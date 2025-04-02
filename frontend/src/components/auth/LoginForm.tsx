import { useState } from 'react';
import { useAuth } from '../../context/authContext';
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
} from './Auth.styles';
import { PrimaryButton } from '../../styles/shared/Button.styles';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signIn, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await signIn(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login failed:', err);
            setError(err instanceof Error ? err.message : 'Failed to login. Please try again.');
        }
    };

    return (
        <AuthPageContainer>
            <FormContainer>
                <Title>Login</Title>
                <Form onSubmit={handleSubmit}>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <FormGroup>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </FormGroup>
                    <PrimaryButton type="submit" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </PrimaryButton>
                </Form>
                <LinkText>
                    Don't have an account? <StyledLink to="/signup">Sign up</StyledLink>
                </LinkText>
            </FormContainer>
        </AuthPageContainer>
    );
};
