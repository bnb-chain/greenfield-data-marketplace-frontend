import styled from '@emotion/styled';
import {
  Flex,
  Button,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@totejs/uikit';
import { NavBar } from '../components/NavBar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Overview from '../components/resource/overview';
import List from '../components/folder/list';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EditModal } from '../components/modal/editModal';
import { GF_CHAIN_ID } from '../env';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import { useResourceInfo } from '../hooks/useResourceInfo';
import { Loader } from '../components/Loader';
import {
  defaultImg,
  divide10Exp,
  generateGroupName,
  trimLongStr,
  formatDateUTC,
  parseFileSize,
} from '../utils';
import BN from 'bn.js';
import { useCollectionItems } from '../hooks/useCollectionItems';
import { useSalesVolume } from '../hooks/useSalesVolume';
import { useListedDate } from '../hooks/useListedDate';
import { useStatus } from '../hooks/useStatus';
import { useModal } from '../hooks/useModal';
import { PenIcon } from '@totejs/icons';
import { useGlobal } from '../hooks/useGlobal';

enum Type {
  Description = 'description',
  DataList = 'dataList',
}

const Folder = () => {
  const navigator = useNavigate();
  const [p] = useSearchParams();
  const bucketId = p.getAll('bid')[0];
  const ownerAddress = p.getAll('address')[0];
  const folderGroup = p.getAll('f')[0];

  const { address } = useAccount();

  const [update, setUpdate] = useState(false);

  const { loading, baseInfo } = useResourceInfo({
    bucketId,
    address: ownerAddress,
    update,
  });
  console.log(baseInfo, '-----ResourceInfo');

  const {
    name,
    price,
    url,
    desc,
    listed,
    type,
    bucketName,
    objectInfo,
    bucketInfo,
  } = baseInfo;

  const [breadItems, setBreadItems] = useState<any>([]);

  const title = useMemo(() => {
    return bucketName === name ? name : `${bucketName} #${name}`;
  }, [name, bucketName]);

  const state = useGlobal();

  const folder = useMemo(() => {
    return folderGroup.split('-').slice(-1)[0];
  }, [folderGroup]);

  useEffect(() => {
    const list = state.globalState.breadList;
    if (list.length) {
      setBreadItems(
        list.concat([
          {
            name: folder,
            query: '',
            path: '',
          },
        ]),
      );
    }
  }, [state.globalState.breadList, title]);

  console.log(title, bucketName, name);

  if (loading) return <Loader></Loader>;

  return (
    <Container>
      <MyBreadcrumb>
        {breadItems.map((item: any, index: number) => {
          return (
            <MyBreadcrumbItem
              isCurrentPage={index === breadItems.length - 1}
              onClick={() => {
                state.globalDispatch({
                  type: 'DEL_BREAD',
                  name: item.name,
                });
              }}
            >
              <BreadcrumbLink
                fontSize="16px"
                href={'/#' + item.path + (item.query ? '?' + item.query : '')}
              >
                {item?.name?.replace('+', ' ')}
              </BreadcrumbLink>
            </MyBreadcrumbItem>
          );
        })}
      </MyBreadcrumb>

      <List
        folderGroup={folderGroup}
        folder={folder}
        name={name}
        listed={listed}
        bucketName={bucketName}
      ></List>
    </Container>
  );
};

export default Folder;

const Container = styled.div`
  padding-top: 60px;
`;

const MyBreadcrumb = styled(Breadcrumb)`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;

  color: #ffffff;
`;

const MyBreadcrumbItem = styled(BreadcrumbItem)``;
