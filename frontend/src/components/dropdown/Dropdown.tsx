import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { DropdownWrapper, DropdownHeader, DropdownList, DropdownItem } from './Dropdown.Styles';

export const CustomDropdown = ({
  value,
  onChange,
  options,
}: {
  value: number | string;
  onChange: (val: number | string) => void;
  options: number[] | string[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (val: number | string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <DropdownWrapper>
      <DropdownHeader onClick={() => setIsOpen(prev => !prev)}>
        {typeof value === 'number' ? `${value} notes` : value}
        <FaChevronDown size={12} />
      </DropdownHeader>
      {isOpen && (
        <DropdownList>
          {options.map((opt) => (
            <DropdownItem key={opt} onClick={() => handleSelect(opt)}>
              {typeof opt === 'number' ? `${opt} notes` : opt}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownWrapper>
  );
};
