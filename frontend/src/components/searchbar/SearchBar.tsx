import { useState } from 'react';
import { SearchInput, SearchIcon } from './SearchBar.Styles';
import { Stack } from '../../styles/shared/BaseLayout';

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
      setSearchQuery('');
    }
  };

  return (
    <Stack width="100%">
      <SearchIcon />
      <SearchInput
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={handleSearch}
        onKeyDown={handleSubmit}
      />
    </Stack>
  );
};