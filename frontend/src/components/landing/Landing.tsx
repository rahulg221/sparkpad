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
        <p>Low-friction thought organization and productivity tool. Turn your chaos into clarity.</p>
        <ButtonContainer>
            <PrimaryButton onClick={handleLogin}>Login</PrimaryButton>
            <PrimaryButton onClick={handleSignup}>Signup</PrimaryButton>
        </ButtonContainer>
      </ContentContainer>
      <ContentContainer>
        <p>Write now, organize later. The Organize feature leverages semantic grouping and labeling to automatically sort your notes into labeled notebooks, minimizing friction and maximizing organization.</p>
      </ContentContainer>
      <ContentContainer>
        <p>Don't feel like reading your notes? The Summarize feature uses AI to summarize your current view of notes into distinct bullet points, making them easier to digest.</p>
      </ContentContainer>
      <ContentContainer>
        <p>No more excuses for not using your calendar. The Connect feature allows you to create and view events and tasks using only natural language from your notes.</p>
      </ContentContainer>
    </LandingContainer>
  );
};

export default Landing;
