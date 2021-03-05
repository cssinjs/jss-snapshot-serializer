import React from 'react';
// @ts-ignore
import styled from 'styled-jss';
import { render } from '@testing-library/react';
import serializer from '../src/jss-snapshot-serializer';

expect.addSnapshotSerializer(serializer);

const RedBox = styled('div')({
  width: 100,
  height: 100,
  backgroundColor: 'red',
});

describe('styled-jss', () => {
  it('removes non-deterministic class names', () => {
    const redBox = render(<RedBox />).asFragment();
    expect(redBox).toMatchSnapshot();
  });
});
