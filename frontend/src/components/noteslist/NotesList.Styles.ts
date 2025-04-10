import { MdDeleteOutline } from "react-icons/md";
import styled from "styled-components";

export const TrashIcon = styled(MdDeleteOutline)`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }
`;
