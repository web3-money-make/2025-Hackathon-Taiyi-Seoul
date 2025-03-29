import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  useFloating,
} from '@floating-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { dialogCardVariant, dialogDimVariant } from '@/styles/motion';
import Card from './Card';

export interface Props extends React.PropsWithChildren {
  isShow?: boolean;
  onDimClick?: () => void;
}

const Dim = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  background: #00000099;
  outline: none;
  z-index: 999;
`;
const Container = styled(Card)<{ isShowOverflow?: boolean }>`
  position: relative;
  ${({ isShowOverflow }) => (isShowOverflow ? '' : 'overflow: hidden;')}
`;

export default function Dialog({
  isShow,
  children,
  onDimClick: handleDimClick,
}: Props) {
  // floating
  const { refs, context } = useFloating({
    strategy: 'fixed',
    open: isShow,
    whileElementsMounted: autoUpdate,
  });

  // callback
  const handlePanelClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  return (
    <FloatingPortal>
      <FloatingFocusManager context={context}>
        <AnimatePresence initial={false}>
          {isShow ? (
            <Dim
              initial="incoming"
              animate="active"
              exit="exit"
              as={motion.div}
              variants={dialogDimVariant}
              ref={refs.setFloating}
              onClick={handleDimClick}
            >
              <Container
                initial="incoming"
                animate="active"
                exit="exit"
                as={motion.div}
                variants={dialogCardVariant}
                onClick={handlePanelClick}
              >
                <Card>{children}</Card>
              </Container>
            </Dim>
          ) : (
            ''
          )}
        </AnimatePresence>
      </FloatingFocusManager>
    </FloatingPortal>
  );
}
