import { useState } from 'react';
import styled from 'styled-components';
import { FaCalendarAlt } from 'react-icons/fa';
import { IconButton } from '../../../styles/shared/Button.styles';
import { Row, Spacer } from '../../../styles/shared/BaseLayout';

const DatePickerContainer = styled.div`
  position: relative;
`;

const DatePickerDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${({ theme }) => theme.colors.bgPure};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  min-width: 250px;
`;

const DateInput = styled.input`
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSize.xs};
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const FilterButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: black;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.xs};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const ClearButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.xs};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.bgLight};
  }
`;

interface DateFilterProps {
  onDateFilter?: (date: string | null) => void;
}

export const DateFilter = ({ onDateFilter }: DateFilterProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleApplyFilter = () => {
    if (selectedDate) {
      setActiveFilter(selectedDate);
      if (onDateFilter) onDateFilter(selectedDate);
      setIsOpen(false);
      console.log(selectedDate);
    }
  };

  const handleClearFilter = () => {
    setSelectedDate('');
    setActiveFilter(null);
    if (onDateFilter) onDateFilter(null);
    setIsOpen(false);
  };

  return (
    <DatePickerContainer>
      <IconButton 
        title={activeFilter ? `Filtering by: ${activeFilter}` : "Filter by date"} 
        onClick={handleToggleDropdown}
        style={{ color: activeFilter ? '#f59e0b' : undefined }}
      >
        <FaCalendarAlt size={14} />
      </IconButton>
      
      <DatePickerDropdown isOpen={isOpen}>
        <DateInput 
          type="date" 
          value={selectedDate} 
          onChange={handleDateChange}
        />
        <Spacer height="md" />
        <Row main="spaceBetween" cross="center">
          <ClearButton onClick={handleClearFilter}>Clear</ClearButton>
          <FilterButton onClick={handleApplyFilter}>Apply Filter</FilterButton>
        </Row>
      </DatePickerDropdown>
    </DatePickerContainer>
  );
};
