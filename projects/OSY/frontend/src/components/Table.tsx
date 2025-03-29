'use client';

import styled from 'styled-components';

export type Props = React.ComponentPropsWithoutRef<'table'>;

const Root = styled.table`
  width: calc(100% + 48px);
  margin: -24px;
  overflow: hidden;

  & > thead > tr > th {
    border-bottom: 1px solid #ffffff29;
  }

  & > tbody > tr {
    & > th {
      text-align: left;
    }

    & > td {
      text-align: center;
    }
  }

  & > thead > tr > th,
  & > tbody > tr > th,
  & > tbody > tr > td {
    padding: 12px 8px;
  }

  & > thead > tr > th:first-of-type,
  & > tbody > tr > th:first-of-type,
  & > tbody > tr > td:first-of-type {
    padding-left: 16px;
  }

  & th {
    font-weight: medium;
  }
`;

export default function Table({ ...props }: Props) {
  return <Root {...props} />;
}
