import { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';

interface INavBarProps {
  active?: any;
  items: { name: string; key: any }[];
  onChange?: (index: number) => void;
  inlineStyle?: boolean;
  style?: object;
}

interface INavProps {
  readonly isActive: boolean;
}

export const NavBar = (props: INavBarProps) => {
  const { active, items, onChange, style, inlineStyle } = props;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const index = items.findIndex((item) => item.key === active);
    if (index >= 0) {
      setActiveIndex(index);
    }
  }, [active, items]);

  const handleChange = useCallback(
    (index: any, key: any) => {
      setActiveIndex(index);
      onChange?.(key);
    },
    [onChange],
  );

  return inlineStyle ? (
    <InlineContainer style={style}>
      {items.map((item, index) => (
        <InlineNav
          isActive={activeIndex === index}
          key={index}
          onClick={() => handleChange(index, item.key)}
        >
          {item.name}
        </InlineNav>
      ))}
    </InlineContainer>
  ) : (
    <NavContainer style={style}>
      {items.map((item, index) => (
        <Nav
          isActive={activeIndex === index}
          key={index}
          onClick={() => handleChange(index, item.key)}
        >
          {item.name}
        </Nav>
      ))}
    </NavContainer>
  );
};

const NavContainer = styled.div`
  display: flex;
  font-size: 16px;
  color: ${(props: any) => props.theme.colors.readable?.normal};
  font-weight: 600;
  height: 52px;
  line-height: 52px;
  white-space: nowrap;
  width: 100%;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Nav = styled.nav<INavProps>`
  font-weight: 700;
  font-size: 24px;

  margin-right: 24px;
  position: relative;
  cursor: pointer;
  white-space: nowrap;
  color: #ffffff;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${(props: any) =>
      props.isActive
        ? props.theme.colors.scene.primary.normal
        : props.theme.readable?.border};
    border-radius: 10px;
  }
`;

const InlineContainer = styled.div`
  display: flex;
  font-weight: 600;
  font-size: 16px;
  white-space: nowrap;
  width: 100%;
  border-bottom: 1px solid ${(props: any) => props.theme.colors.readable.border};
  width: 100%;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const InlineNav = styled.nav<INavProps>`
  font-weight: 700;
  font-size: 24px;

  margin-right: 24px;
  position: relative;
  cursor: pointer;
  padding: 16px 0;
  color: #ffffff;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${(props: any) =>
      props.isActive ? props.theme.colors.scene.primary.normal : 'none'};
  }
`;
