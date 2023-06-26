import {
  Button,
  Flex,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  useDisclosure,
} from '@totejs/uikit';
import styled from '@emotion/styled';
import { ConnectKitButton } from 'connectkit';
import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useAccount, useDisconnect, useSwitchNetwork, useNetwork } from 'wagmi';
import { Copy } from '../Copy';
import { trimLongStr } from '../../utils';
import ProfileImage from '../svgIcon/ProfileImage';
import { HeaderProfileBg } from '../svgIcon/HeaderProfileBg';
import {
  // BookmarkIcon,
  WithdrawIcon,
  WalletIcon,
  PaperLibraryIcon,
  MenuCloseIcon,
} from '@totejs/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRevoke } from '../../hooks/useRevoke';
import { useHasRole } from '../../hooks/useHasRole';
import LogoGroup from '../../images/logo-group.png';
import { BSCLogo } from '../svgIcon/BSCLogo';
import { BSC_CHAIN_ID, GF_CHAIN_ID } from '../../env';
import { useGlobal } from '../../hooks/useGlobal';
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
  const { address, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const onMouseEnter = useCallback(() => {
    setDropDownOpen(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setDropDownOpen(false);
  }, []);

  const { revoke } = useRevoke();
  const { hasRole, setHasRole } = useHasRole();

  const navigate = useNavigate();
  const { onClose, onToggle } = useDisclosure();
  const { switchNetwork } = useSwitchNetwork();

  const { chain } = useNetwork();

  const state = useGlobal();

  const location = useLocation();

  const showSearch = useMemo(() => {
    return state.globalState.showSearch || location.pathname != '/';
  }, [state.globalState.showSearch, location]);

  return (
    <HeaderFlex
      justifyContent={'space-between'}
      alignItems={'center'}
      padding={'0px 24px 0'}
      height={64}
    >
      <ImageContainer
        onClick={() => {
          navigate('/');
        }}
        gap={4}
        alignItems={'center'}
      >
        <img src={LogoGroup} alt="logo" width={188} height={38} />
        devnet
      </ImageContainer>
      {showSearch && <Search width="360px" height="44px"></Search>}
      <NetWorkCon alignItems={'center'} justifyContent={'center'} gap={40}>
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
        <ButtonWrapper onMouseOver={onMouseEnter} onMouseLeave={onMouseLeave}>
          <ConnectKitButton.Custom>
            {({ isConnected, show, address, ensName }) => {
              return (
                <>
                  <StyledButton
                    onClick={() => {
                      if (show && !isConnected) show();
                    }}
                    className={isConnected ? 'connected' : ''}
                  >
                    {isConnected
                      ? ensName ?? (
                          <>
                            <ProfileWrapper gap={10}>
                              <Profile>
                                <ProfileImage width={32} height={32} />
                              </Profile>
                              <div>
                                {address ? trimLongStr(address, 10, 6, 4) : ''}
                              </div>
                            </ProfileWrapper>
                          </>
                        )
                      : 'Connect Wallet'}
                  </StyledButton>
                  {dropDownOpen && isConnected && !isConnecting && (
                    <DropDown>
                      <HeaderProfileBg
                        width={300}
                        height={96}
                      ></HeaderProfileBg>

                      <ImageWrapper>
                        <ProfileImage width={64} height={64} />
                      </ImageWrapper>

                      <AddressWrapper>
                        <Address gap={10} mb={24} height={24}>
                          <div>
                            {address ? trimLongStr(address, 10, 6, 4) : ''}
                          </div>
                          <Copy value={address} />
                        </Address>
                        <MenuElement
                          onClick={async (e: any) => {
                            e.preventDefault();
                            navigate('/profile?tab=collections');
                          }}
                        >
                          <PaperLibraryIcon mr={8} width={24} height={24} /> My
                          Profile
                        </MenuElement>
                        {/* <MenuElement
                      onClick={async (e: any) => {
                        e.preventDefault();
                        navigate('/profile?tab=purchase');
                      }}
                    >
                      <WalletIcon mr={8} width={24} height={24} /> My Purchase
                    </MenuElement> */}
                        {hasRole && (
                          <MenuElement
                            onClick={() => {
                              revoke().then(() => {
                                setHasRole(true);
                              });
                            }}
                          >
                            <WalletIcon mr={8} width={24} height={24} /> Revoke
                          </MenuElement>
                        )}
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
                </>
              );
            }}
          </ConnectKitButton.Custom>
        </ButtonWrapper>
      </NetWorkCon>
    </HeaderFlex>
  );
};

export default Header;

const HeaderFlex = styled(Flex)`
  position: fixed;
  width: 100%;
  z-index: 10;
  background-color: #000000;
  border-bottom: 1px #2f3034 solid;
`;
const ImageContainer = styled(Flex)`
  position: relative;
  cursor: pointer;
  img {
    width: 378px;
    height: 42px;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  max-width: 158px;
  height: 44px;
  font-family: Poppins;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  border-radius: 200px;
  &.connected {
    font-family: 'Poppins';
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
  padding-bottom: 8px;
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
  font-family: Poppins;
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
  font-family: Poppins;
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
  font-family: Poppins;
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

const NetWorkCon = styled(Flex)``;
