import styled from 'styled-components';

const alignmentMap = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    spaceBetween: "space-between",
    spaceAround: "space-around",
    spaceEvenly: "space-evenly",
};

export const Container = styled.div<{
    height?: string, 
    width?: string,
    padding?: 'sm' | 'md' | 'lg',
    margin?: 'sm' | 'md' | 'lg'
}>`
  background-color: transparent;
  padding: ${({ theme, padding }) => padding ? theme.spacing[padding] : '0'};
  margin: ${({ theme, margin }) => margin ? theme.spacing[margin] : '0'};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  height: ${({ height }) => height || 'auto'};
  width: ${({ width }) => width || 'auto'};
`;


export const ElevatedContainer = styled(Container)`
  background-color: ${({ theme }) => theme.colors.bgDark};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const Row = styled.div<{
    main: keyof typeof alignmentMap;
    cross: keyof typeof alignmentMap;
    gap?: 'sm' | 'md' | 'lg';
    padding?: 'sm' | 'md' | 'lg';
  }>`
    display: flex;
    flex-direction: row;
    justify-content: ${({ main }) => alignmentMap[main] || 'flex-start'};
    align-items: ${({ cross }) => alignmentMap[cross] || 'stretch'};
    width: 100%;
    padding: ${({ padding, theme }) => padding ? theme.spacing[padding] : '0'};
    gap: ${({ gap, theme }) => gap ? theme.spacing[gap] : '0'};
`;    

export const Column = styled.div<{
    main: keyof typeof alignmentMap;
    cross: keyof typeof alignmentMap; 
    gap?: 'sm' | 'md' | 'lg';
    padding?: 'sm' | 'md' | 'lg';
}>` 
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: ${({ main }) => alignmentMap[main] || 'flex-start'};
  align-items: ${({ cross }) => alignmentMap[cross] || 'stretch'};
  padding: ${({ padding, theme }) => padding ? theme.spacing[padding] : '0'};
  gap: ${({ gap, theme }) => gap ? theme.spacing[gap] : '0'};
`;

export const Stack = styled.div<{
  width?: string;
}>`
  position: relative;
  width: ${({ width }) => width || 'auto'};
`;


export const Grid = styled.div<{
  columns?: number;
  $layoutMode?: 'grid' | 'list';
}>`
  display: ${({ $layoutMode }) => ($layoutMode === 'list' ? 'flex' : 'grid')};
  flex-direction: ${({ $layoutMode }) => ($layoutMode === 'list' ? 'column' : 'initial')};
  ${({ $layoutMode, columns }) =>
    $layoutMode === 'grid' &&
    `grid-template-columns: repeat(${columns || 2}, 1fr);`}
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    grid-template-columns: none; 
  }
`;
  
export const ScrollView = styled.div<{
    maxHeight?: string;
    maxWidth?: string;
    direction?: 'vertical' | 'horizontal';
  }>`
    overflow-y: ${({ direction }) => direction === 'vertical' ? 'auto' : 'hidden'};
    overflow-x: ${({ direction }) => direction === 'horizontal' ? 'auto' : 'hidden'};
    max-height: ${({ maxHeight }) => maxHeight || '100%'};
    max-width: ${({ maxWidth }) => maxWidth || '100%'};
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.border} ${({ theme }) => theme.colors.bgPure};

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Edge */
    }
`;

export const HorizontalDivider = styled.div<{
  width?: string,
  margin?: 'sm' | 'md' | 'lg'
}>`
  width: ${({ width }) => width || '100%'};
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: ${({ theme, margin }) => margin ? theme.spacing[margin] : '0'};
`;

export const VerticalDivider = styled.div<{
  height?: string,
  margin?: 'sm' | 'md' | 'lg'
}>`
  width: 1px;
  height: ${({ height }) => height || '5px'};
  background-color: ${({ theme }) => theme.colors.border};
  margin: ${({ theme, margin }) => margin ? theme.spacing[margin] : '0'};

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Spacer = styled.div<{
  expand?: boolean,
  height?: 'sm' | 'md' | 'lg' | 'xl'  ,
  width?: 'sm' | 'md' | 'lg' | 'xl'
}>`
  flex-grow: ${({ expand }) => expand ? 1 : 0};
  height: ${({ theme, height }) => height ? theme.spacing[height] : '0'};
  width: ${({ theme, width }) => width ? theme.spacing[width] : '0'};
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
`;
