import { Button, Flex } from '@totejs/uikit';
import styled from '@emotion/styled';
import { ConnectKitButton } from 'connectkit';
import { useCallback, useState } from 'react';
import { disconnect } from '@wagmi/core';
import { useAccount } from 'wagmi';
import { Copy } from '../Copy';
import { trimLongStr } from '../../utils';
import ProfileImage from '../svgIcon/ProfileImage';
import { HeaderProfileBg } from '../svgIcon/HeaderProfileBg';
import { BookmarkIcon, WithdrawIcon, WalletIcon } from '@totejs/icons';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const { address, isConnected, isConnecting } = useAccount();

  const onMouseEnter = useCallback(() => {
    setDropDownOpen(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setDropDownOpen(false);
  }, []);

  const navigate = useNavigate();
  return (
    <HeaderFlex
      justifyContent={'space-between'}
      padding={'8px 24px'}
      height={62}
    >
      <ImageContainer>
        <img src="/images/logo.png" alt="logo" width={188} height={38} />
      </ImageContainer>
      <ButtonWrapper onMouseOver={onMouseEnter} onMouseLeave={onMouseLeave}>
        <ConnectKitButton.Custom>
          {({ isConnected, show, address, ensName }) => {
            return (
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
            );
          }}
        </ConnectKitButton.Custom>
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
                onClick={async (e: any) => {
                  e.preventDefault();
                  navigate('/profile?tab=collection');
                }}
              >
                <BookmarkIcon mr={8} width={24} height={24} /> My Data
              </MenuElement>
              <MenuElement
                onClick={async (e: any) => {
                  e.preventDefault();
                  navigate('/profile?tab=purchase');
                }}
              >
                <WalletIcon mr={8} width={24} height={24} /> My Purchase
              </MenuElement>
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
    </HeaderFlex>
  );
};

export default Header;

const HeaderFlex = styled(Flex)`
  background-color: #000000;
  border-bottom: 1px #2f3034 solid;
`;
const ImageContainer = styled.div`
  position: relative;

  img {
    width: 100px;
    height: 20px;
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
`;

const DropDown = styled.div`
  position: absolute;
  top: calc(100% - 4px);
  right: 0;
  border-radius: 12px;
  width: 300px;
  height: 340px;
  background: ${(props: any) => props.theme.colors.bg?.middle};
  box-shadow: ${(props: any) => props.theme.shadows.normal};
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
