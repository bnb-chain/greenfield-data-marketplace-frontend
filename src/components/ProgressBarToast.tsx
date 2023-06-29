import { Flex, Text } from '@totejs/uikit';
import CircleProgress from './CircleProgress';

import { CloseIcon } from '@totejs/icons';
import { truncateFileName } from '../utils';

const ProgressBarToast = ({
  progress,
  fileName,
  closeToast,
}: {
  progress: number;
  fileName: string;
  closeToast: () => void;
}) => {
  return (
    <Flex alignItems={'center'} justifyContent={'center'}>
      <CircleProgress
        progress={progress}
        size={18}
        strokeWidth={2}
        circleOneStroke="rgba(0,186,52,0.1)"
        circleTwoStroke="#00BA34"
      />
      <Text
        flex={1}
        minW={0}
        whiteSpace="nowrap"
        ml={'10px'}
        fontSize={'14px'}
        lineHeight={'17px'}
        color={'readable.normal'}
        fontWeight={500}
      >
        {`Downloading "${truncateFileName(fileName)}"`}
      </Text>
      <Text
        ml={'20px'}
        fontSize={'14px'}
        lineHeight={'17px'}
        color={'readable.normal'}
        fontWeight={500}
      >
        {`${progress}%`}
      </Text>
      <Flex
        borderRadius={'10px'}
        w={'20px'}
        h={'20px'}
        ml={'16px'}
        cursor={'pointer'}
        _hover={{ bg: 'readable.border' }}
        alignItems={'center'}
        justifyContent={'center'}
        transitionDuration="normal"
      >
        <CloseIcon w={'16px'} h={'16px'} onClick={closeToast} />
      </Flex>
    </Flex>
  );
};

export default ProgressBarToast;
