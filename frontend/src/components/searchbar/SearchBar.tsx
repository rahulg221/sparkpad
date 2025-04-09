import { useState } from 'react';
import { SearchInput } from './SearchBar.Styles';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(searchQuery);
    }
  };

  return (
    <SearchInput
      type="text"
      placeholder="Search for notes..."
      value={searchQuery}
      onChange={handleSearch}
      onKeyDown={handleSubmit}
    />
  );
};