import React from 'react';
import { createUseStyles } from 'react-jss';
import { render } from '@testing-library/react';
import serializer from '../src/jss-snapshot-serializer';

expect.addSnapshotSerializer(serializer);

const useStyles = createUseStyles({
  redBox: {
    width: 100,
    height: 100,
    backgroundColor: 'red',
  },
});

const RedBox = () => {
  const classes = useStyles();
  return <div className={classes.redBox} />;
};

describe('react-jss', () => {
  it('removes non-deterministic class names', () => {
    const redBox = render(<RedBox />).asFragment();
    expect(redBox).toMatchSnapshot();
  });
});
