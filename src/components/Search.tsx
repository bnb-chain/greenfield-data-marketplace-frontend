import { useCallback, useEffect, useMemo, useState } from 'react';
import { SearchInput } from './SearchInput';

import styled from '@emotion/styled';
import { Box, Flex } from '@totejs/uikit';
import ScrollSelect from './ScrollSelect';
import { useDebounce } from '../hooks';
import { searchKey } from '../utils/gfSDK';
import { parseGroupName } from '../utils';

const Group = (props: any) => {
  const {
    group: { group_name },
  } = props;
  const { name, type } = parseGroupName(group_name);
  return <div>{name}</div>;
};

const Search = () => {
  const [searchValue, setSearchValue] = useState('');

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);

  const handleSearchChange = useCallback((v: string) => {
    setSearchValue(v);
    if (!v) {
      setShow(false);
    }
  }, []);

  const searchList = useDebounce(async () => {
    if (searchValue) {
      setShow(true);
      setList([]);
      console.log(searchValue, '-----searchValue');
      setLoading(true);
      const result: any = await searchKey(searchValue);
      const { groups } = result;
      if (groups.length) {
        setList(groups);
      }
      setLoading(false);
    }
  }, 500);

  useMemo(async () => {
    searchList();
  }, [searchValue]);

  const render = (item: any) => {
    const { group } = item;
    return <Group group={group}></Group>;
  };
  const link = (item: any) => {
    const {
      group: { group_name, id, owner },
    } = item;
    return `resource?gid=${id}&gn=${group_name}&address=${owner}&tab=description`;
  };
  const filteredData = useMemo(() => {
    if (searchValue) {
      console.log(searchValue, '-----filteredData');
      const collectionList = {
        title: 'Collection',
        list: [],
        render,
        link,
      };
      const dataList = {
        title: 'Data',
        list: [],
        render,
        link,
      };
      list.forEach((d: any) => {
        const {
          group: { group_name },
        } = d;
        const { type } = parseGroupName(group_name);
        if (type === 'Collection') {
          collectionList.list.push(d as never);
        }
        if (type === 'Data') {
          dataList.list.push(d as never);
        }
      });
      return [collectionList, dataList];
    }
    return [{ title: '', list: [], render: () => <></>, link: () => '12' }];
  }, [list]);

  const eventListener = useCallback((e: any) => {
    const { target } = e;
    const root = document.getElementById('searchRoot');
    if (!root?.contains(target)) {
      setShow(false);
    }
  }, []);

  useEffect(() => {
    const body = document.body;
    body.addEventListener('click', eventListener);

    return () => {
      body.removeEventListener('click', eventListener);
    };
  }, []);
  return (
    <Container id="searchRoot">
      <Flex
        position="relative"
        border={'1px solid readable.border'}
        borderRadius={8}
        onMouseUp={(e) => e.stopPropagation()}
        flexDirection="column"
        bg="bg.middle"
        boxShadow="0px 4px 24px rgba(0, 0, 0, 0.08)"
        minWidth={[0, 230, 230]}
      >
        <Box bg="bg.middle" boxShadow="4px 2px 8px rgba(0, 0, 0, 0.08)">
          <Input
            placeholder={'Search Data Names, Accounts'}
            value={searchValue}
            onChange={handleSearchChange}
            onConfirm={handleSearchChange}
            onReset={() => setSearchValue('')}
            hideBg
          />
        </Box>
        {show && (
          <Box
            maxHeight={340}
            position={'absolute'}
            left={0}
            top={'calc(100% + 4px)'}
            width={'420px'}
          >
            <ScrollSelect
              searchValue={searchValue}
              data={filteredData}
              showSelectIcon={false}
              loading={loading}
            />
          </Box>
        )}
      </Flex>
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
  width: 420px;
`;
