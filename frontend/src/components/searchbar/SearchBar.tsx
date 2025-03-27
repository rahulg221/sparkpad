import { useState } from 'react';
import { SearchContainer, SearchInput } from './SearchBar.Styles';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={handleSearch}
      />
    </SearchContainer>
  );
};