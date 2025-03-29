'use client';

import Image from 'next/image';
import styled from 'styled-components';
import ImageBackground from '@/assets/images/background.png';

const Root = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  z-index: -1;
  opacity: 0.6;
`;

export default function Background() {
  return (
    <Root>
      <Image alt="" width="9999" src={ImageBackground} />
    </Root>
  );
}
