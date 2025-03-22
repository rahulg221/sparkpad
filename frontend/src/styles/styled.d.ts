import 'styled-components';
import { Theme } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
} 

declare module 'react-chrome-dino' {
  export const ChromeDinoGame: React.FC;
}

