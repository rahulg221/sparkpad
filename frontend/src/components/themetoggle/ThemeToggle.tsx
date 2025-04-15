import { useTheme } from '../../context/ThemeContext';
import { SecondaryButton } from '../../styles/shared/Button.styles';
import { MdLightbulb, MdDarkMode } from 'react-icons/md';

export const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <SecondaryButton onClick={toggleTheme}>
      {isDarkMode ? <MdLightbulb size={20}/> : <MdDarkMode size={20}/>}
      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
    </SecondaryButton>
  );
};