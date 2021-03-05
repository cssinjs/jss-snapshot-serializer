import { sheets, StyleSheet, Rule } from 'jss';

const KEY = '__jss-snapshot-serializer-marker__';
const jssClassNameRegexp = /([a-zA-Z0-9]*)-([a-zA-Z0-9]*)-([0-9]*)-([0-9]*)/;

type SnapshotSerializerPlugin = Parameters<
  typeof expect.addSnapshotSerializer
>[0];

type MarkedElement = Element & {
  [KEY]?: boolean;
};

const getNodes = (node: Element, nodes: Element[] = []) => {
  if (typeof node === 'object') {
    nodes.push(node);
  }

  if (node.children) {
    Array.from(node.children).forEach((child) => getNodes(child, nodes));
  }

  return nodes;
};

const markNodes = (nodes: MarkedElement[]) =>
  nodes.forEach((node) => (node[KEY] = true));

const getClassNamesFromDOM = (node: Element) => Array.from(node.classList);

const getClassNames = (nodes: Element[]) =>
  nodes.reduce((classNames, node) => {
    let newClassNames = getClassNamesFromDOM(node);

    newClassNames.forEach((className) => classNames.add(className));

    return classNames;
  }, new Set<string>());

const getStylesByClassNames = (classNames: string[]) =>
  sheets.registry
    .reduce((rules, stylesheet) => {
      const newRules = classNames
        .map((className) => stylesheet.getRule('.' + className))
        .filter(Boolean);

      return [...rules, ...newRules];
    }, [] as Rule[])
    .map((stylesheet) => stylesheet.toString())
    .join('\n');

const plugin: SnapshotSerializerPlugin = {
  test(val: any) {
    return (
      val &&
      !val[KEY] &&
      (val.$$typeof === Symbol.for('react.test.json') ||
        (global.Element && val instanceof global.Element))
    );
  },

  serialize(value: Element, config, indentation, depth, refs, printer) {
    const nodes = getNodes(value);
    markNodes(nodes);

    const classNames = getClassNames(nodes);

    const style = getStylesByClassNames(Array.from(classNames))
      .split('\n')
      .join(`\n${indentation}`);
    // console.log({ classNames, style });
    const code = printer(value, config, indentation, depth, refs);

    let result = `${style}${style ? '\n\n' + indentation : ''}${code}`;

    return result;
  },
};

export default plugin;
