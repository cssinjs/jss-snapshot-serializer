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
  blueBox: {
    width: 100,
    height: 100,
    backgroundColor: 'blue',
  },
});

const RedBox = () => {
  const classes = useStyles();
  return <div className={classes.redBox} />;
};

const BlueAndRed = () => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.redBox} />
      <div className={classes.blueBox} />
    </div>
  );
};

const BlueAndRedFragment = () => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.redBox} />
      <div className={classes.blueBox} />
    </>
  );
};

const BlueAndRedNesting = () => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.redBox} />
      <div>
        <>
          <div className={classes.redBox} />
          <div className={classes.blueBox} />
        </>
        <div className={classes.blueBox} />
      </div>
    </div>
  );
};

describe('react-jss', () => {
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
