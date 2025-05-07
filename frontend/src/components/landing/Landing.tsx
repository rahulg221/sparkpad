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
        <h1>Sparkpad</h1>
        <br />
        <p>Low friction productivity tool built for ADHD minds, creatives, and fast-paced thinkers.</p>
        <ButtonContainer>
            <PrimaryButton onClick={handleLogin}>Login</PrimaryButton>
            <PrimaryButton onClick={handleSignup}>Signup</PrimaryButton>
        </ButtonContainer>
      </ContentContainer>
    </LandingContainer>
  );
};

export default Landing;
