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
        <h1>Spark Journal</h1>
        <p>Capture the spark before it fades.</p>
        <ButtonContainer>
            <PrimaryButton onClick={handleLogin}>Login</PrimaryButton>
            <PrimaryButton onClick={handleSignup}>Signup</PrimaryButton>
        </ButtonContainer>
        <br />  
        <h2>Organize</h2>
        <p>Write now, organize later. The Organize feature leverages semantic grouping and labeling to automatically sort your notes into labeled notebooks, minimizing friction and maximizing organization.</p>
        <br />
        <h2>Snapshot</h2>
        <p>Don't feel like reading through your notes? The Snapshot feature gives you a snapshot of the notes you're currently viewing in a bullet point format, making them easier to digest.</p>
        <br />
        <h2>Connect</h2>
        <p>No more excuses for not using your calendar. The Connect feature allows you to create and view events and tasks using only natural language from your notes.</p>
        <br />
        <h2>Search</h2>
        <p>Need to find something quickly? The Search feature allows you to search for notes based on semantic meaning, making it easier to find what you need.</p>
      </ContentContainer>
    </LandingContainer>
  );
};

export default Landing;
