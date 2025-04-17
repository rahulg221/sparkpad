import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { DropdownWrapper, DropdownHeader, DropdownList, DropdownItem } from './Dropdown.Styles';

export const CustomDropdown = ({
  value,
  onChange,
  options,
}: {
  value: number;
  onChange: (val: number) => void;
  options: number[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (val: number) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <DropdownWrapper>
      <DropdownHeader onClick={() => setIsOpen(prev => !prev)}>
        Show {value} notes <FaChevronDown size={12} />
      </DropdownHeader>
      {isOpen && (
        <DropdownList>
          {options.map((opt) => (
            <DropdownItem key={opt} onClick={() => handleSelect(opt)}>
              Show {opt} notes
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownWrapper>
  );
};
