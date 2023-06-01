import { useCallback, useState } from 'react';
import { SearchInput } from './SearchInput';

import styled from '@emotion/styled';

const Search = () => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = useCallback((v: string) => {
    setSearchValue(v);
  }, []);

  return (
    <Container>
      <Input
        placeholder={'Search Datas, Accounts'}
        value={searchValue}
        onChange={handleSearchChange}
        onConfirm={handleSearchChange}
        onReset={() => setSearchValue('')}
      />
    </Container>
  );
};

export default Search;

const Input = styled(SearchInput)`
  width: 420px;
  height: 56px;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
