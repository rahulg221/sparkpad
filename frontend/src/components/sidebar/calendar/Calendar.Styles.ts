import styled from 'styled-components';

export const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.3s ease-in-out;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.border} ${({ theme }) => theme.colors.bgDark};
`;

export const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.taskBackground};
  transition: all 0.3s ease-in-out;
  padding: ${({ theme }) => theme.spacing.md};
  //border: 1px solid ${({ theme }) => theme.colors.border};
  overflow-y: none;
`;

export const TaskCard = styled.div`
  background-color: ${({ theme }) => theme.colors.taskBackground};
  color: ${({ theme }) => theme.colors.textLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  //border: 1px solid ${({ theme }) => theme.colors.border};
  width: 100%;           
  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  transition: all 0.3s ease-in-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors.taskColor};
  }
`;

export const EventCard = styled.div`
  background-color: ${({ theme }) => theme.colors.eventBackground};
  color: ${({ theme }) => theme.colors.textLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  //border: 1px solid ${({ theme }) => theme.colors.border};
  width: 100%;           
  box-sizing: border-box;
  height: 100px;

  display: flex;
  flex-direction: column;

  transition: all 0.3s ease-in-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors.eventColor};
  }
`;

export const CardPreview = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.xxs};
  word-break: break-word;
  overflow-wrap: anywhere;
  flex: 1;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 1;

  -webkit-line-clamp: 1;

  transition: all 0.4s ease-in-out;

  ${TaskCard}:hover & {
    -webkit-line-clamp: unset;
    display: block;
    overflow: visible;
    text-overflow: unset;
    opacity: 1;
    transition: all 0.4s ease-in-out;
  }

  ${EventCard}:hover & {
    -webkit-line-clamp: unset;
    display: block;
    overflow: visible;
    text-overflow: unset;
    opacity: 1;
    transition: all 0.4s ease-in-out;
  }

  .markdown-ul {
    padding-left: 1.2rem;
    list-style-type: disc;
    margin: 0;
  }

  .markdown-li {
    margin-bottom: 0.25rem;
  }
`;

export const SmallTextButton = styled.p`
  font-size: ${({ theme }) => theme.fontSize.xxs};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.taskColor};
  }
`;  

export const DateContainer = styled.p`
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: ${({ theme }) => theme.fontSize.xxs};
`;

