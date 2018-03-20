# jss-snapshot-serializer
Jest snapshot serializer for JSS

At the moment, the functionality of this serializer is limited to 
stripping out the "dynamic" part of the JSS-generated class names to avoid false positive
changes to the snapshot every time the snapshot is re-generated. 

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

# TODO
- add tests
- add styles to snapshots
