import styled from '@emotion/styled';
import { BackIcon, GoIcon } from '@totejs/icons';
import { Box, Flex } from '@totejs/uikit';

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { NoData } from './NoData';
import { Loader } from './Loader';
import { mobileMedia, useResponsive } from '../hooks/useResponsive';

export interface ISearchData {
  title: string;
  list: any[];
  link: (data: any) => string;
  render: (data: any, isActive: boolean) => any;
}

const SingleRow = forwardRef((props: any, ref: any) => {
  const { isActive, onClick, cell, d, isMobile, showSelectIcon } = props;
  const [isHover, setIsHover] = useState(false);

  const active = isActive || isHover;

  return (
    <Row
      ref={ref}
      active={active}
      onClick={onClick}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Box
        flex={1}
        fontSize={14}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {cell.render(d, active)}
      </Box>
      {active && !isMobile && showSelectIcon && (
        <Flex>
          <SelectTxt>Select</SelectTxt>
          <EnterIcon>
            {/* <img
              alt="enter"
              width={11}
              height={8}
              src="../../../images/enter.svg"
            ></img> */}
          </EnterIcon>
        </Flex>
      )}
    </Row>
  );
});

export default function ScrollSelect({
  data = [],
  searchValue,
  onClose,
  showSelectIcon = true,
  loading,
}: {
  data: ISearchData[];
  searchValue?: string;
  onClose?: () => void;
  loading?: boolean;
  showSelectIcon?: boolean;
}) {
  const [focusIndex, setFocusIndex] = useState(0);
  const { isMobile } = useResponsive();

  const [computedLength, setComputedLength] = useState<number[]>([]);

  const [displayCell, setDisplayCell] = useState<any>(undefined);

  const [displayFocusIndex, setDisplayFocusIndex] = useState(0);

  useEffect(() => {
    setComputedLength(
      data
        .filter((d) => d.list.length > 0)
        .map((d) => (d.list.length > 5 ? 5 : d.list.length)),
    );
  }, [data]);

  const displayData = data.filter((d) => d.list.length > 0);

  useEffect(() => {
    setFocusIndex(0);
  }, [searchValue]);

  const navigate = useNavigate();

  const hasResult = displayData.length > 0;

  const elementRefs = useRef<any>({});

  const displayElementRefs = useRef<any>({});

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const keyDownHandle = useCallback(
    (e: KeyboardEvent) => {
      if (displayCell) {
        setDisplayFocusIndex((_index) => {
          let newIndex = _index;
          if (e.key === 'ArrowDown') {
            const total = displayCell.list.length;
            newIndex = _index + 1 > total ? total : _index + 1;
          } else if (e.key === 'ArrowUp') {
            newIndex = _index - 1 < 0 ? 0 : _index - 1;
          } else if (e.key === 'Enter') {
            e.preventDefault();

            const targetData = displayCell.list?.[_index];
            if (targetData) {
              const targetHref = displayCell.link(targetData);
              navigate(targetHref);
              handleClose();
            }
          }
          const currentEl = displayElementRefs.current[newIndex];
          currentEl?.scrollIntoViewIfNeeded?.();
          currentEl?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          });
          return newIndex;
        });
      } else {
        setFocusIndex((_index) => {
          let newIndex = _index;
          if (e.key === 'ArrowDown') {
            const total = computedLength.reduce((acc, cur) => acc + cur, 0) - 1;
            newIndex = _index + 1 > total ? total : _index + 1;
          } else if (e.key === 'ArrowUp') {
            newIndex = _index - 1 < 0 ? 0 : _index - 1;
          } else if (e.key === 'Enter') {
            e.preventDefault();
            let acc = 0;
            let target = 0;
            computedLength.some((total, idx) => {
              if (acc <= _index && acc + total > _index) {
                target = idx;
                return true;
              } else {
                acc += total;
                return false;
              }
            });

            const targetData = displayData[target]?.list?.[_index - acc];
            if (targetData) {
              const targetHref = displayData[target]?.link(targetData);
              navigate(targetHref);
              handleClose();
            }
          }
          const currentEl = elementRefs.current[newIndex];
          currentEl?.scrollIntoViewIfNeeded?.();
          currentEl?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          });
          return newIndex;
        });
      }
    },
    [computedLength, displayCell, displayData, handleClose, navigate],
  );

  useEffect(() => {
    window.addEventListener('keydown', keyDownHandle);
    return () => {
      window.removeEventListener('keydown', keyDownHandle);
    };
  }, [handleClose, keyDownHandle]);

  if (!hasResult && !loading) {
    return (
      <NoDataCon direction="column" alignItems="center" maxHeight="inherit">
        <Box height={105}></Box>
        <NoData />
        <Box height={22}> </Box>
        <EmptyTxt>No Result for</EmptyTxt>
        <Box h={4}></Box>
        <Flex direction="column" alignItems="center" maxWidth={330}>
          <EmptyTxt>{`'${searchValue}'`}</EmptyTxt>
          <Box h={8} />
          <Box color="readable.secondary" fontWeight={500} textAlign="center">
            We couldn't find anything matching your search.
          </Box>
        </Flex>
        <Box height={116}></Box>
      </NoDataCon>
    );
  }

  return (
    <Panel
      onClick={(e: any) => {
        e.stopPropagation();
      }}
    >
      {loading ? (
        <Loader />
      ) : displayCell ? (
        <Box
          flex={1}
          maxHeight={['100%', 'inherit', 'inherit']}
          overflowY="scroll"
          paddingBottom={[160, 0, 0]}
        >
          <Box top={0} position="sticky" zIndex={2}>
            <Flex
              fontWeight={600}
              fontSize={16}
              alignItems="center"
              padding={'9px 20px'}
              cursor="pointer"
              _hover={{
                color: 'scene.primary.active',
              }}
              onClick={() => setDisplayCell(undefined)}
              background="bg.middle"
            >
              <BackIcon w={20} h={20} />
              <Box>Back</Box>
            </Flex>
            <Title>{displayCell?.title}</Title>
          </Box>
          {displayCell?.list.map((d: any, i: number) => {
            const isActive = displayFocusIndex === i;
            return (
              <Link key={i} to={displayCell?.link(d)}>
                <SingleRow
                  ref={(ref) => {
                    displayElementRefs.current = {
                      ...displayElementRefs.current,
                      [i]: ref,
                    };
                  }}
                  active={isActive}
                  onClick={handleClose}
                  cell={displayCell}
                  d={d}
                  isActive={isActive}
                  isMobile={isMobile}
                  showSelectIcon={showSelectIcon}
                />
                {/* <Row
                  ref={(ref) => {
                    displayElementRefs.current = {
                      ...displayElementRefs.current,
                      [i]: ref,
                    };
                  }}
                  active={isActive}
                  onClick={handleClose}
                >
                  <Box flex={1} fontSize={14}>
                    {displayCell?.render(d, isActive)}
                  </Box>
                  {isActive && !isMobile && showSelectIcon && <SelectIcon />}
                </Row> */}
              </Link>
            );
          })}
        </Box>
      ) : (
        <Box paddingBottom={[160, 0, 0]}>
          {displayData.map((cell, index) => {
            return (
              <>
                <Title>{cell.title}</Title>
                {cell.list.map((d, i) => {
                  const realIndex =
                    computedLength.reduce((acc, cur, idx) => {
                      return acc + (idx < index ? cur : 0);
                    }, 0) + i;
                  const isActive = focusIndex === realIndex;
                  return i < 5 ? (
                    <Link key={`${index}+${i}`} to={cell.link(d)}>
                      <SingleRow
                        ref={(ref) => {
                          elementRefs.current = {
                            ...elementRefs.current,
                            [realIndex]: ref,
                          };
                        }}
                        active={isActive}
                        onClick={handleClose}
                        cell={cell}
                        d={d}
                        isActive={isActive}
                        isMobile={isMobile}
                        showSelectIcon={showSelectIcon}
                      />
                    </Link>
                  ) : (
                    <></>
                  );
                })}
                {cell.list.length > 5 ? (
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    gap={4}
                    color="readable.secondary"
                    paddingTop={2}
                    paddingBottom={14}
                    cursor="pointer"
                    fontSize={12}
                    _hover={{
                      color: 'scene.primary.active',
                    }}
                    onClick={() => {
                      setDisplayCell(cell);
                    }}
                  >
                    <Box>Show More</Box>
                    <GoIcon w={20} h={20} />
                  </Flex>
                ) : (
                  <></>
                )}
              </>
            );
          })}
        </Box>
      )}
    </Panel>
  );
}

const NoDataCon = styled(Flex)`
  background: ${(props: any) => props.theme.colors.bg.bottom};
`;

const Panel = styled.div`
  height: 100%;
  width: 100%;
  max-height: inherit;
  background: ${(props: any) => props.theme.colors.bg.bottom};
  overflow-x: hidden;
  ${mobileMedia} {
    border-radius: 0;
    height: calc(100vh - 50px);
  }
`;

const Title = styled.div`
  padding: 8px 24px;
  font-weight: 600;
  font-size: 12px;
  color: ${(props: any) => props.theme.colors.scene.primary.normal};
  background: ${(props: any) => props.theme.colors.bg.bottom};
  position: sticky;

  top: 0;
  height: 34px;
  ${mobileMedia} {
    padding: 8px 16px;
  }
`;

const Row = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;

  text-decoration: none;
  padding: 12px 24px;
  gap: 4px;
  background: ${(props: any) =>
    props.active ? props.theme.colors.bg.top.active : 'inherit'};
  overflow: hidden;
  &:hover {
    background: ${(props: any) => props.theme.colors.bg.top.active};
  }
`;

const SelectTxt = styled.span`
  color: ${(props: any) => props.theme.colors.readable?.secondary};
  font-size: 12px;
  margin-right: 4px;
  font-weight: 500;
`;

const EmptyTxt = styled.div`
  font-weight: 600;
  font-size: 16px;
  word-break: break-all;
  text-align: center;
`;

const EnterIcon = styled.div`
  background: ${(props: any) => props.theme.colors.readable.secondary};
  width: 24px;
  height: 16px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
