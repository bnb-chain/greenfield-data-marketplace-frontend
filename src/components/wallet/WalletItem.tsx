import { Center, Flex, FlexProps } from '@totejs/uikit';

import { Loading } from './Loading';

export interface WalletItemProps extends FlexProps {
  icon: React.ReactNode;
  name: React.ReactNode;
  isDisabled: boolean;
  isActive: boolean;
}

export function WalletItem(props: WalletItemProps) {
  const { icon, name, isDisabled, isActive, onClick, ...restProps } = props;

  const onBeforeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDisabled) {
      return;
    }
    onClick?.(e);
  };

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      h={68}
      borderRadius={8}
      border={'none'}
      color={'bg.middle'}
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      _hover={{
        background: 'scene.primary.semiOpacity',
      }}
      background={'bg.walletTab'}
      position="relative"
      fontSize={18}
      lineHeight="22px"
      fontWeight={600}
      transitionDuration="normal"
      transitionProperty="colors"
      onClick={onBeforeClick}
      _notLast={{
        mb: 16,
      }}
      {...restProps}
    >
      <Center position="absolute" left={16}>
        {icon}
      </Center>
      {name}
      {isActive && (
        <Loading
          style={{ position: 'absolute', width: '24px', right: '24px' }}
          minHeight={24}
        />
      )}
    </Flex>
  );
}
