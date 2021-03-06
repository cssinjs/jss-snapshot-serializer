# jss-snapshot-serializer
Jest snapshot serializer for JSS

This adds the styles generated by JSS to your snapshots, so you can detect unwanted style changes using snapshots.

# Install

```bash
npm install --save-dev jss-snapshot-serializer
```

# Usage

To use the serializer globally for all your tests
put the following option to your [Jest config](https://facebook.github.io/jest/docs/en/configuration.html):
```js
{
  snapshotSerializers: ['jss-snapshot-serializer']
}
```

Alternatively, you can add the serializer to a specific test file like this:

```js
import jssSerializer from 'jss-snapshot-serializer';
expect.addSnapshotSerializer(jssSerializer);
```
