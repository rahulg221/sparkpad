declare module 'react-chrome-dino' {
    import { FC } from 'react';
    const ChromeDinoGame: FC;
    export default ChromeDinoGame;
  }  

// src/global.d.ts
declare module 'https://cdn.skypack.dev/chrono-node' {
    export const parse: (text: string, ref?: Date, options?: any) => any[];
  }  

declare module 'react-lottie-player' {
    import { FC } from 'react';
    export const Lottie: FC<any>;
}

declare module 'cat_animation.json' {
    const animationData: any;
    export default animationData;
}

