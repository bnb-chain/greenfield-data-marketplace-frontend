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
import Overview from '../components/resource/Overview';
import List from '../components/resource/List';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { EditModal } from '../components/modal/EditModal';
import { useAccount } from 'wagmi';
import { useResourceInfo } from '../hooks/useResourceInfo';
import { Loader } from '../components/Loader';
import {
  defaultImg,
  divide10Exp,
  trimLongStr,
  formatDateUTC,
  parseFileSize,
  roundFun,
} from '../utils';
import BN from 'bn.js';
import { useSalesVolume } from '../hooks/useSalesVolume';
import { useStatus } from '../hooks/useStatus';
import { useModal } from '../hooks/useModal';
import { PenIcon, SendIcon } from '@totejs/icons';
import { useGlobal } from '../hooks/useGlobal';
import { useBNBPrice } from '../hooks/useBNBPrice';
import { NoData } from '../components/NoData';
import { DCELLAR_URL, GF_EXPLORER_URL } from '../env';
import { useWalletModal } from '../hooks/useWalletModal';
import { useCollectionItems } from '../hooks/useCollectionItems';

enum Type {
  Description = 'description',
  DataList = 'dataList',
}

const Resource = () => {
  const navigator = useNavigate();
  const [p] = useSearchParams();

  const groupId = p.getAll('gid')[0];
  const bucketId = p.getAll('bid')[0];
  const objectId = p.getAll('oid')[0];
  const ownerAddress = p.getAll('address')[0];
  const gName = p.getAll('gn')[0];
  const bGroupName = p.getAll('bgn')[0];

  const [open, setOpen] = useState(false);

  const handleTabChange = useCallback((tab: any) => {
    navigator(
      `/resource?${p.toString().replace(/tab=([^&]*)/g, `tab=${tab}`)}`,
    );
  }, []);

  const { address, isConnected, isConnecting } = useAccount();
  const { handleModalOpen } = useWalletModal();

  const [update, setUpdate] = useState(false);

  const { loading, baseInfo, noData } = useResourceInfo({
    groupId,
    bucketId,
    objectId,
    address: ownerAddress,
    groupName: gName,
    update,
  });
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
    bucketListed,
  } = baseInfo;
  const { salesVolume } = useSalesVolume(groupId);

  const { status } = useStatus(
    bGroupName || gName,
    ownerAddress,
    address as string,
  );

  const [showEdit, setShowEdit] = useState(false);

  const [breadItems, setBreadItems] = useState<any>([]);

  const state = useGlobal();
  const showBuy = useMemo(() => {
    const list = state.globalState.breadList;
    const fromPurchase =
      list.findIndex((item) => item.name == 'My Purchase') > -1;
    return (status == 1 || status == -1) && !fromPurchase;
  }, [status, address, state.globalState.breadList]);

  const showDcellarBut = useMemo(() => {
    return status > -1;
  }, [status, address]);

  const resourceType = useMemo(() => {
    return objectId || type === 'Data' ? '0' : '1';
  }, [objectId, type]);

  const modalData = useModal();

  const title = useMemo(() => {
    return bucketName === name ? name : `${bucketName} #${name}`;
  }, [name, bucketName]);

  const { price: bnbPrice } = useBNBPrice();
  useEffect(() => {
    const list = state.globalState.breadList;
    if (list.length && list[list.length - 1].name != title) {
      setBreadItems(
        list.concat([
          {
            name: title,
            query: '',
            path: '',
          },
        ]),
      );
    } else {
      setBreadItems(list);
    }
  }, [state.globalState.breadList, title]);

  const isOwner = useMemo(() => {
    return address === ownerAddress;
  }, [address, ownerAddress]);

  const showEndPoint = useMemo(() => {
    return isOwner || (address !== ownerAddress && status === 2);
  }, [isOwner, address, ownerAddress, status]);

  const hasOwn = useMemo(() => {
    return isOwner || status === 2;
  }, [isOwner, status]);

  const navItems = useMemo(() => {
    const _navItems = [
      {
        name: 'Description',
        key: Type.Description,
      },
    ];
    if (hasOwn && resourceType === '1') {
      _navItems.unshift({
        name: 'Data List',
        key: Type.DataList,
      });
    }
    return _navItems;
  }, [address, ownerAddress, status, resourceType]);

  const currentTab = useMemo(() => {
    const tab = p.getAll('tab')[0];
    return resourceType === '1' && hasOwn
      ? tab
        ? tab
        : Type.Description
      : Type.Description;
  }, [p, resourceType, hasOwn]);

  const CreateTime = useMemo(() => {
    let obj;
    if (resourceType === '0') {
      obj = objectInfo;
    } else {
      obj = bucketInfo;
    }
    return obj?.createAt?.low || 0;
  }, [bucketInfo, objectInfo]);

  const fileSize = useMemo(() => {
    return objectInfo?.payloadSize?.low;
  }, [objectInfo]);

  const { num } = useCollectionItems(name, bucketListed);
  if (loading) return <Loader></Loader>;
  if (noData)
    return (
      <NoDataCon
        alignItems={'center'}
        justifyContent={'center'}
        flexDirection={'column'}
      >
        <NoData size={280}></NoData>
        <NoDataTitle>No Data</NoDataTitle>
        <NoDataSub>No data available</NoDataSub>
      </NoDataCon>
    );

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

      <ResourceInfo gap={20}>
        <ImgCon
          onMouseMove={() => {
            if (isOwner && listed) {
              setShowEdit(true);
            }
          }}
          onMouseLeave={() => {
            if (isOwner && listed) {
              setShowEdit(false);
            }
          }}
          onClick={() => {
            if (isOwner && listed) {
              setOpen(true);
            }
          }}
        >
          <img src={url || defaultImg(name, 246)} alt="" />
          {showEdit && (
            <EditCon alignItems={'center'} justifyContent={'center'}>
              <PenIcon />
            </EditCon>
          )}
        </ImgCon>
        <Info
          gap={4}
          flexDirection={['column', 'column', 'column']}
          justifyContent={'space-around'}
        >
          <NameCon gap={4} alignItems={'center'} justifyContent={'flex-start'}>
            <Name>{title}</Name>
            <SendIcon
              width={20}
              height={20}
              cursor={'pointer'}
              marginLeft={6}
              onClick={() => {
                const o = resourceType == '1' ? bucketInfo : objectInfo;
                const { id } = o;
                window.open(
                  `${GF_EXPLORER_URL}${
                    resourceType == '1' ? 'bucket' : 'object'
                  }/0x${Number(id).toString(16).padStart(64, '0')}`,
                );
              }}
            />
          </NameCon>
          {resourceType == '1' && (
            <CollInfo gap={8}>
              <ItemNum>{num} Items</ItemNum>
              <Tag alignItems={'center'} justifyContent={'center'}>
                Data Collection
              </Tag>
            </CollInfo>
          )}

          <OwnCon alignItems={'center'}>
            {resourceType == '0' && (
              <FileSize> {parseFileSize(fileSize)} </FileSize>
            )}
            Created by{' '}
            {address === ownerAddress ? (
              <span>You</span>
            ) : (
              <Link to={`/profile?address=${ownerAddress}`}>
                <span>{trimLongStr(ownerAddress)}</span>
              </Link>
            )}{' '}
            At {formatDateUTC(CreateTime * 1000)}
          </OwnCon>
          {listed ? (
            <MarketInfo alignItems={'center'} gap="8">
              {divide10Exp(new BN(price, 10), 18)} BNB
              <Price>
                $
                {roundFun(
                  divide10Exp(
                    new BN(price, 10).mul(new BN(Number(bnbPrice), 10)),
                    18,
                  ).toString(),
                  8,
                )}
              </Price>
              <BoughtNum>{salesVolume} Bought</BoughtNum>
            </MarketInfo>
          ) : null}
          <ActionGroup gap={10} alignItems={'center'}>
            {address === ownerAddress && !listed && !bucketListed && (
              <Button
                size={'sm'}
                onClick={async () => {
                  const initInfo = {
                    bucket_name: bucketName,
                    object_name: bucketName === name ? '' : name,
                    create_at: CreateTime,
                    payload_size: fileSize,
                  };
                  modalData.modalDispatch({
                    type: 'OPEN_LIST',
                    initInfo,
                  });
                }}
              >
                List
              </Button>
            )}
            {showBuy && (
              <Button
                size={'sm'}
                onClick={() => {
                  if (!isConnected && !isConnecting) {
                    handleModalOpen();
                  } else {
                    modalData.modalDispatch({
                      type: 'OPEN_BUY',
                      buyData: baseInfo,
                    });
                  }
                }}
              >
                Buy
              </Button>
            )}
            {showDcellarBut && (
              <Button
                size={'sm'}
                onClick={() => {
                  window.open(`${DCELLAR_URL}buckets/${bucketName}`);
                }}
                variant="ghost"
              >
                View in Dcellar
              </Button>
            )}
          </ActionGroup>
        </Info>
      </ResourceInfo>
      <Box h={30}></Box>
      <NavBar active={currentTab} onChange={handleTabChange} items={navItems} />
      <Box h={10} w={996}></Box>
      {currentTab === Type.Description ? (
        <Overview
          desc={desc}
          showEdit={address === ownerAddress}
          editFun={() => {
            setOpen(true);
          }}
          name={name}
          bucketName={bucketName}
          listed={listed}
          showEndpoints={showEndPoint}
        ></Overview>
      ) : (
        <List
          status={status}
          name={name}
          listed={bucketListed}
          bucketName={bucketName}
          bucketInfo={bucketInfo}
        ></List>
      )}
      {open && (
        <EditModal
          isOpen={open}
          handleOpen={() => {
            setOpen(false);
          }}
          detail={{
            ...baseInfo,
            desc,
            url,
          }}
          updateFn={() => {
            setUpdate(true);
          }}
        ></EditModal>
      )}
    </Container>
  );
};

export default Resource;

const Container = styled.div`
  padding-top: 60px;
`;
const ResourceInfo = styled(Flex)`
  margin-top: 30px;
`;

const MyBreadcrumb = styled(Breadcrumb)`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;

  color: #ffffff;
`;

const MyBreadcrumbItem = styled(BreadcrumbItem)``;

const ImgCon = styled.div`
  position: relative;
  width: 246px;
  height: 246px;

  img {
    width: 246px;
    height: 246px;

    background-color: #d9d9d9;
    border-radius: 8px;
  }
`;

const EditCon = styled(Flex)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #d9d9d9;

  border-radius: 8px;

  cursor: pointer;
`;

const Info = styled(Flex)``;

const NameCon = styled(Flex)``;

const CollInfo = styled(Flex)``;

const Name = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 38px;
  /* identical to box height, or 119% */

  color: #f0b90b;
`;

const Tag = styled(Flex)`
  width: 128px;
  height: 24px;

  background: rgba(255, 255, 255, 0.14);
  border-radius: 16px;
`;

const ItemNum = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;

  color: #ffffff;
`;

const OwnCon = styled(Flex)`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;

  color: #ffffff;

  span {
    margin: 0 4px;
    color: #f0b90b;
  }
`;

const MarketInfo = styled(Flex)`
  font-size: 32px;
  color: #f0b90b;
`;

const Price = styled.div`
  font-size: 20px;
  color: #f0b90b;
`;

const ActionGroup = styled(Flex)``;

const BoughtNum = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;

  color: #979797;
`;

const FileSize = styled.div`
  margin-right: 6px;

  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 18px;

  color: #ffffff;
`;

const NoDataCon = styled(Flex)``;

const NoDataTitle = styled.div`
  font-size: 32px;
  font-weight: 600;
`;

const NoDataSub = styled.div`
  font-size: 20px;
`;
