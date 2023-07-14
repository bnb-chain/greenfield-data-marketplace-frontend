import {
  Button,
  Flex,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  useDisclosure,
  useOutsideClick,
} from '@totejs/uikit';
import styled from '@emotion/styled';
import { useWalletModal } from '../../hooks/useWalletModal';

import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useCallback,
  useState,
  useRef,
} from 'react';
import { useAccount, useDisconnect, useSwitchNetwork, useNetwork } from 'wagmi';
import { Copy } from '../Copy';
import { trimLongStr } from '../../utils';
import ProfileImage from '../svgIcon/ProfileImage';
import { HeaderProfileBg } from '../svgIcon/HeaderProfileBg';
import {
  // BookmarkIcon,
  WithdrawIcon,
  SaverIcon,
  MenuCloseIcon,
  DepositIcon,
} from '@totejs/icons';
import { useNavigate } from 'react-router-dom';
// import { useRevoke } from '../../hooks/useRevoke';
// import { useHasRole } from '../../hooks/useHasRole';
import LogoGroup from '../../images/logo-group.png';
import { BSCLogo } from '../svgIcon/BSCLogo';
import { BSC_CHAIN_ID, GF_CHAIN_ID } from '../../env';
import Search from '../../components/Search';

const CustomMenuButton = forwardRef(
  (props: { children: ReactNode }, ref: ForwardedRef<HTMLButtonElement>) => {
    const { children, ...restProps } = props;

    return (
      <Button
        ref={ref}
        w={206}
        h={34}
        background={'rgba(255, 255, 255, 0.22);'}
        variant="ghost"
        justifyContent="space-between"
        px={12}
        fontWeight={600}
        fontSize={14}
        lineHeight={'17px'}
        border={'none'}
        mr={1}
        borderRadius={8}
        _hover={{
          background: 'bg.top.normal',
        }}
        _expanded={{
          '.close-icon': {
            transform: 'rotate(-180deg)',
          },
        }}
        {...restProps}
      >
        <BSCLogo></BSCLogo>
        <Flex align={'center'}>{children}</Flex>
        <MenuCloseIcon className="close-icon" transitionDuration="normal" />
      </Button>
    );
  },
);

const Header = () => {
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const { address, isConnecting, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { handleModalOpen } = useWalletModal();
  const handleShowDropDown = useCallback(() => {
    setDropDownOpen((preState) => !preState);
  }, []);
  const ref = useRef(null);

  useOutsideClick({
    ref,
    handler: () => {
      if (dropDownOpen) {
        setTimeout(() => {
          setDropDownOpen(false);
        }, 50);
      }
    },
  });

  // const { revoke } = useRevoke();
  // const { hasRole, setHasRole } = useHasRole();

  const navigate = useNavigate();
  const { onClose, onToggle } = useDisclosure();
  const { switchNetwork } = useSwitchNetwork();

  const { chain } = useNetwork();

  return (
    <HeaderFlex
      justifyContent={'space-between'}
      alignItems={'center'}
      padding={'0px 24px 0'}
      height={80}
    >
      <LeftCon gap={42} alignItems={'center'}>
        <img
          onClick={() => {
            navigate('/');
          }}
          src={LogoGroup}
          alt="logo"
        />
        <Search width="380px" height="40px"></Search>
      </LeftCon>

      <RightFunCon alignItems={'center'} justifyContent={'center'} gap={18}>
        <>
          <Button
            onClick={() => {
              if (!isConnecting && !isConnected) handleModalOpen();
              navigate('/profile?tab=collections');
            }}
            variant="text"
          >
            List My Data
          </Button>
        </>
        {address && (
          <Menu placement="bottom-end">
            <MenuButton
              onClick={() => {
                onToggle();
              }}
              as={CustomMenuButton}
            >
              {chain && chain.id === BSC_CHAIN_ID
                ? 'BNB Smart Chain'
                : 'BNB Greenfield'}
            </MenuButton>
            <MenuList w={206}>
              <MenuItem
                icon={<BSCLogo />}
                onClick={() => {
                  switchNetwork?.(BSC_CHAIN_ID);
                  onClose();
                }}
              >
                BNB Smart Chain
              </MenuItem>
              <MenuItem
                icon={<BSCLogo />}
                onClick={() => {
                  switchNetwork?.(GF_CHAIN_ID);
                  onClose();
                }}
              >
                BNB Greenfield
              </MenuItem>
            </MenuList>
          </Menu>
        )}
        <ButtonWrapper>
          {!isConnected && !isConnecting ? (
            <StyledButton
              onClick={() => {
                handleModalOpen();
              }}
            >
              Connect Wallet
            </StyledButton>
          ) : (
            <ConnectProfile
              onClick={() => {
                try {
                  if (isConnected && !dropDownOpen) handleShowDropDown();
                } catch (e) {
                  //eslint-disable-next-line no-console
                  console.log(e);
                }
              }}
            >
              <ProfileWrapper
                ml={3}
                gap={10}
                justifyContent={'flex-start'}
                w={158}
              >
                <Profile>
                  <ProfileImage width={32} height={32} />
                </Profile>
                <div>{address ? trimLongStr(address, 10, 6, 4) : ''}</div>
              </ProfileWrapper>
            </ConnectProfile>
          )}
          {dropDownOpen && isConnected && !isConnecting && (
            <DropDown>
              <HeaderProfileBg width={300} height={96}></HeaderProfileBg>

              <ImageWrapper>
                <ProfileImage width={64} height={64} />
              </ImageWrapper>

              <AddressWrapper>
                <Address gap={10} mb={24} height={24}>
                  <div>{address ? trimLongStr(address, 10, 6, 4) : ''}</div>
                  <Copy value={address} />
                </Address>
                <MenuElement
                  onClick={async (e: React.MouseEvent<HTMLElement>) => {
                    e.preventDefault();
                    navigate('/profile?tab=collections');
                  }}
                >
                  <SaverIcon mr={8} width={24} height={24} />
                  My Data Collections
                </MenuElement>
                <MenuElement
                  onClick={async (e: React.MouseEvent<HTMLElement>) => {
                    e.preventDefault();
                    navigate('/profile?tab=purchase');
                  }}
                >
                  <DepositIcon mr={8} width={24} height={24} />
                  My Purchases
                </MenuElement>
                {/* {hasRole && (
                          <MenuElement
                            onClick={() => {
                              revoke().then(() => {
                                setHasRole(true);
                              });
                            }}
                          >
                            <WalletIcon mr={8} width={24} height={24} /> Revoke
                          </MenuElement>
                        )} */}
                <Disconnect
                  onClick={async () => {
                    await disconnect();
                  }}
                >
                  <WithdrawIcon
                    mr={8}
                    width={24}
                    height={24}
                    style={{ transform: 'rotate(-90deg)' }}
                  />{' '}
                  Disconnect
                </Disconnect>
              </AddressWrapper>
            </DropDown>
          )}
        </ButtonWrapper>
      </RightFunCon>
    </HeaderFlex>
  );
};

export default Header;

const HeaderFlex = styled(Flex)`
  position: fixed;
  width: 100%;
  z-index: 10;
  background-color: #1e2026;
  border-bottom: 1px #2f3034 solid;
`;
const LeftCon = styled(Flex)`
  img {
    width: 268px;
    height: 56px;
    cursor: pointer;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  max-width: 158px;
  height: 44px;

  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  border-radius: 200px;
  &.connected {
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    background: ${(props: any) => props.theme.colors.bg?.middle};
    color: ${(props: any) => props.theme.colors.readable.normal};
    border: 1px solid ${(props: any) => props.theme.colors.readable.border};
    &:hover {
      background: ${(props: any) => props.theme.colors.bg?.bottom};
    }
  }
`;

const ButtonWrapper = styled.div`
  position: relative;
`;

const DropDown = styled.div`
  position: absolute;
  top: calc(100% - 4px);
  right: 0;
  margin-top: 4px;
  border-radius: 12px;
  width: 300px;
  height: 330px;
  background: ${(props: any) => props.theme.colors.bg?.middle};
  box-shadow: ${(props: any) => props.theme.shadows.normal};
  z-index: 11;
`;

const AddressWrapper = styled.div`
  padding: 12px;
  margin-top: 46px;
`;

const Address = styled(Flex)`
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const Disconnect = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  padding: 8px 12px;
  border-radius: 8px;
  &:hover {
    cursor: pointer;
    background: ${(props: any) => props.theme.colors.bg.bottom};
  }
`;

const ProfileWrapper = styled(Flex)`
  align-items: center;
  gap: 10px;
`;

const Profile = styled(Flex)`
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  border: 1px solid ${(props: any) => props.theme.colors.readable.border};
`;

const ImageWrapper = styled(Flex)`
  position: absolute;
  justify-content: center;
  align-items: center;
  top: 62px;
  right: 50%;
  transform: translateX(50%);
  background: ${(props: any) => props.theme.colors.bg.middle};
  width: 68px;
  height: 68px;
  border-radius: 50%;
`;

const MenuElement = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  padding: 8px 12px;
  border-radius: 8px;
  &:hover {
    cursor: pointer;
    background: ${(props: any) => props.theme.colors.bg.bottom};
  }
`;

const RightFunCon = styled(Flex)``;

const ConnectProfile = styled(Flex)`
  align-items: center;
  cursor: pointer;
  width: 100%;
  max-width: 158px;
  height: 44px;
  font-family: Space Grotesk;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  border-radius: 200px;
  border: 1px solid ${(props: any) => props.theme.colors.readable.border};
  &:hover {
    background: ${(props: any) => props.theme.colors.read?.normal};
  }
`;
