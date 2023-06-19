import { ColoredSuccessIcon, CopyIcon } from '@totejs/icons';
import { useClipboard, Box, Tooltip, BoxProps, Flex } from '@totejs/uikit';
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface CopyProps extends BoxProps {
  value?: string;
  children?: React.ReactNode;
  copyToolTips?: string;
}

export const Copy = ({
  value = '',
  copyToolTips,
  children,
  ...restProps
}: CopyProps) => {
  const { hasCopied, setValue, onCopy } = useClipboard(value ?? '');
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    setValue(value);
  }, [setValue, value]);

  const handleCopy = useCallback(() => {
    if (value) {
      onCopy();
    }
  }, [onCopy, value]);

  const ToolTipConteng = useMemo(() => {
    return hasCopied ? (
      <Flex alignItems="center" gap={6}>
        <ColoredSuccessIcon w={16} h={16} />
        Copied
      </Flex>
    ) : (
      copyToolTips || 'Copy'
    );
  }, [hasCopied]);

  return (
    <Tooltip
      bg="bg.middle"
      color="readable.white"
      padding={8}
      borderColor="readable.border"
      borderRadius={4}
      fontWeight={500}
      fontSize={'14px'}
      placement="top"
      content={ToolTipConteng}
      isOpen={hasCopied || isHover}
    >
      <Box
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={handleCopy}
        cursor="pointer"
        display="inline-block"
        {...restProps}
      >
        {children || (
          <CopyIcon
            color="readable.secondary"
            _hover={{ color: 'scene.primary.active' }}
            h={20}
            w={20}
          />
        )}
      </Box>
    </Tooltip>
  );
};
