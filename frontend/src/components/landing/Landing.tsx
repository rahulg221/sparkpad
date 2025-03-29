import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../../styles/shared/Button.styles';
import { LandingContainer, ButtonContainer, ContentContainer } from './Landing.Styles';

export const Landing = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <LandingContainer>
      <ContentContainer>
        <h2>Organize.</h2>
        <h2>Summarize.</h2>
        <h2>Connect.</h2>
        <p>Low-friction note-taking and organization. Turn your chaos into clarity.</p>
        <ButtonContainer>
            <PrimaryButton onClick={handleLogin}>Login</PrimaryButton>
            <PrimaryButton onClick={handleSignup}>Signup</PrimaryButton>
        </ButtonContainer>
      </ContentContainer>
    </LandingContainer>
  );
};

export default Landing;
