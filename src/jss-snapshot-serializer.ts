import { sheets, StyleSheet, Rule } from 'jss';

let sheet: StyleSheet | undefined;
try {
  const styled = require('styled-jss').default;
  sheet = styled.mountSheet();
} catch {}

const KEY = '__jss-snapshot-serializer-marker__';
const jssClassNameRegexp = /([a-zA-Z0-9]*)-([a-zA-Z0-9]*)-([0-9]*)-([0-9]*)/;

type SnapshotSerializerPlugin = Parameters<
  typeof expect.addSnapshotSerializer
>[0];

type MarkedElement = Element & {
  [KEY]?: boolean;
};

const indent = (str: string, indentation: string) =>
  str
    .split('\n')
    .join(`\n${indentation}`)
    .replace(/\n\s+\n/g, '\n\n');

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
  Array.from(
    nodes.reduce((classNames, node) => {
      let newClassNames = getClassNamesFromDOM(node);

      newClassNames.forEach((className) => classNames.add(className));

      return classNames;
    }, new Set<string>())
  );

const getStylesByClassNames = (classNames: string[]) =>
  (sheet ? [...sheets.registry, sheet] : sheets.registry)
    .reduce((rules, stylesheet) => {
      const newRules = classNames
        .map((className) => stylesheet.getRule('.' + className))
        .filter(Boolean);

      return [...rules, ...newRules];
    }, [] as Rule[])
    .map((stylesheet) => stylesheet.toString())
    .join('\n\n');

const filterClassNames = (classNames: string[]) =>
  classNames.filter((className) =>
    (sheet ? [...sheets.registry, sheet] : sheets.registry).some((sheet) =>
      Object.values(sheet.classes).includes(className)
    )
  );

const generateClassNameMapping = (classNames: string[]) => {
  let mapping: Record<string, string> = {};
  let index = 0;
  for (const className of classNames) {
    mapping[className] = `j${index}`;
    index += 1;
  }

  return mapping;
};

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

    const style = indent(getStylesByClassNames(classNames), indentation);

    const code = printer(value, config, indentation, depth, refs);

    let result = `${style}${style ? '\n\n' + indentation : ''}${code}`;

    const filteredClassNames = filterClassNames(classNames);
    const classNameMapping = generateClassNameMapping(filteredClassNames);

    for (const [oldClassName, newClassName] of Object.entries(
      classNameMapping
    )) {
      result = result.replace(new RegExp(oldClassName, 'g'), newClassName);
    }

    return result;
  },
};

export default plugin;
