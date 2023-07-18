import styled from '@emotion/styled';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@totejs/uikit';
import { useEffect, useMemo, useState } from 'react';
import List from '../components/folder/List';
import { Link, useSearchParams } from 'react-router-dom';
import { useResourceInfo } from '../hooks/useResourceInfo';
import { Loader } from '../components/Loader';
import { useGlobal } from '../hooks/useGlobal';

const Folder = () => {
  const [p] = useSearchParams();
  const bucketId = p.getAll('bid')[0];
  const ownerAddress = p.getAll('address')[0];
  const folderGroup = p.getAll('f')[0];

  const [update] = useState(false);

  const { loading, baseInfo } = useResourceInfo({
    bucketId,
    address: ownerAddress,
    update,
  });

  const { name, listed, bucketName } = baseInfo;

  const [breadItems, setBreadItems] = useState<any>([]);

  const title = useMemo(() => {
    return bucketName === name ? name : `${bucketName} #${name}`;
  }, [name, bucketName]);

  const state = useGlobal();

  const folder = useMemo(() => {
    return folderGroup.split('__').slice(-1)[0];
  }, [folderGroup]);

  useEffect(() => {
    const list = state.globalState.breadList;
    if (list.length && list.slice(-1)[0].name !== folder) {
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
              <BreadcrumbLink fontSize="16px">
                <Link
                  to={`${item.path}` + (item.query ? '?' + item.query : '')}
                >
                  {item?.name?.replace('+', ' ')}
                </Link>
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
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;

  color: #ffffff;
`;

const MyBreadcrumbItem = styled(BreadcrumbItem)``;
