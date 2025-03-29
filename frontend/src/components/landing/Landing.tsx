import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../../styles/shared/Button.styles';
import { LandingContainer, ButtonContainer } from './Landing.Styles';

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
      <h3>Welcome to Unnamed Note Organizer</h3>
      <ButtonContainer>
        <PrimaryButton onClick={handleLogin}>Login</PrimaryButton>
        <PrimaryButton onClick={handleSignup}>Signup</PrimaryButton>
      </ButtonContainer>
    </LandingContainer>
  );
};

export default Landing;
