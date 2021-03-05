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

const BlueBox = styled('div')({
  width: 100,
  height: 100,
  backgroundColor: 'blue',
});

const BlueAndRed = () => (
  <div>
    <RedBox />
    <BlueBox />
  </div>
);

const BlueAndRedFragment = () => (
  <>
    <RedBox />
    <BlueBox />
  </>
);

const BlueAndRedNesting = () => (
  <div>
    <RedBox />
    <div>
      <>
        <RedBox />
        <BlueBox />
      </>
      <BlueBox />
    </div>
  </div>
);

describe('styled-jss', () => {
  it('removes non-deterministic class names', () => {
    const redBox = render(<RedBox />).asFragment();
    expect(redBox).toMatchSnapshot();
  });

  it('can handle components with several styles', () => {
    const blueRed = render(<BlueAndRed />).asFragment();
    expect(blueRed).toMatchSnapshot();
  });

  it('can handle fragments', () => {
    const blueRed = render(<BlueAndRedFragment />).asFragment();
    expect(blueRed).toMatchSnapshot();
  });

  it('can handle components with nesting', () => {
    const blueRed = render(<BlueAndRedNesting />).asFragment();
    expect(blueRed).toMatchSnapshot();
  });
});
