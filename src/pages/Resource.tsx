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
import List from '../components/resource/list';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
import { PenIcon, SendIcon } from '@totejs/icons';
import { useGlobal } from '../hooks/useGlobal';
import { useBNBPrice } from '../hooks/useBNBPrice';

enum Type {
  Description = 'description',
  DataList = 'dataList',
}

const Resource = () => {
  const navigator = useNavigate();
  const [p] = useSearchParams();
  const tab = p.getAll('tab')[0];
  const groupId = p.getAll('gid')[0];
  const bucketId = p.getAll('bid')[0];
  const objectId = p.getAll('oid')[0];
  const ownerAddress = p.getAll('address')[0];
  const gName = p.getAll('gn')[0];
  const from = p.getAll('from')[0];

  const currentTab = tab ? tab : Type.Description;
  const [open, setOpen] = useState(false);

  const handleTabChange = useCallback((tab: any) => {
    navigator(
      `/resource?${p.toString().replace(/tab=([^&]*)/g, `tab=${tab}`)}`,
    );
  }, []);

  const { address } = useAccount();

  const [update, setUpdate] = useState(false);

  const { loading, baseInfo } = useResourceInfo({
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
  } = baseInfo;

  const { num } = useCollectionItems(name);

  const { salesVolume } = useSalesVolume(groupId);

  const { status } = useStatus(gName, ownerAddress, address as string);

  const [showEdit, setShowEdit] = useState(false);

  const [breadItems, setBreadItems] = useState<any>([]);

  const showBuy = useMemo(() => {
    return status == 1 || status == -1;
  }, [status, address]);

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

  const state = useGlobal();

  const { price: bnbPrice } = useBNBPrice();

  useEffect(() => {
    const list = state.globalState.breadList;
    if (list.length) {
      setBreadItems(
        list.concat([
          {
            name: title,
            query: '',
            path: '',
          },
        ]),
      );
    }
  }, [state.globalState.breadList, title]);

  const navItems = useMemo(() => {
    const _navItems = [
      {
        name: 'Description',
        key: Type.Description,
      },
    ];
    if ((address === ownerAddress || status == 2) && resourceType === '1') {
      _navItems.push({
        name: 'Data List',
        key: Type.DataList,
      });
    }
    return _navItems;
  }, [address, ownerAddress, status, resourceType]);

  const CreateTime = useMemo(() => {
    let obj;
    if (resourceType === '0') {
      obj = objectInfo;
    } else {
      obj = bucketInfo;
    }
    return obj?.createAt?.low;
  }, [bucketInfo, objectInfo]);

  const fileSize = useMemo(() => {
    return objectInfo?.payloadSize?.low;
  }, [objectInfo]);

  const isOwn = useMemo(() => {
    return address === ownerAddress;
  }, [address, ownerAddress]);

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

      <ResourceInfo gap={20}>
        <ImgCon
          onMouseMove={() => {
            if (isOwn && listed) {
              setShowEdit(true);
            }
          }}
          onMouseLeave={() => {
            if (isOwn && listed) {
              setShowEdit(false);
            }
          }}
          onClick={() => {
            if (isOwn && listed) {
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
                  `${process.env.REACT_APP_EXPLORER_URL}${
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
                {Number(divide10Exp(new BN(price, 10), 18).toString()) *
                  bnbPrice}
              </Price>
              <BoughtNum>{salesVolume} Bought</BoughtNum>
            </MarketInfo>
          ) : null}
          <ActionGroup gap={10} alignItems={'center'}>
            {address === ownerAddress && !listed && (
              <Button
                size={'sm'}
                onClick={async () => {
                  modalData.modalDispatch({
                    type: 'OPEN_LIST',
                    listData: baseInfo,
                  });
                }}
              >
                List
              </Button>
            )}

            <ConnectKitButton.Custom>
              {({ isConnected, show, address, ensName }) => {
                return (
                  showBuy && (
                    <Button
                      size={'sm'}
                      onClick={() => {
                        if (!isConnected) {
                          show?.();
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
                  )
                );
              }}
            </ConnectKitButton.Custom>
            {showDcellarBut && (
              <Button
                size={'sm'}
                onClick={() => {
                  window.open(
                    `https://dcellar-qa.fe.nodereal.cc/buckets/${bucketName}`,
                  );
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
          showEndpoints={isOwn}
        ></Overview>
      ) : (
        <List name={name} listed={listed} bucketName={bucketName}></List>
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
  font-family: 'Poppins';
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
  font-family: 'Poppins';
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
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;

  color: #ffffff;
`;

const OwnCon = styled(Flex)`
  font-family: 'Space Grotesk';
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
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;

  color: #979797;
`;

const FileSize = styled.div`
  margin-right: 6px;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 18px;

  color: #ffffff;
`;
