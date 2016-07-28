import {
  flow, map, fromPairs, over, get, camelCase, reduce, trim, mapKeys,
} from 'lodash/fp';
import parseCSS from 'css-parse';
import cxs from 'cxs';

const declarationsToStyleObject = flow(
  get('declarations'),
  map(over(['property', 'value'])),
  fromPairs,
  mapKeys(camelCase)
);

const isRootRule = (rule) =>
  rule.selectors.length && rule.selectors[0] === '&';

const cssRulesToStyleObject = (rules) => reduce((styleObject, rule) => {
  if (rule.type === 'rule') {
    const { selectors } = rule;

    if (isRootRule(rule)) {
      return Object.assign(styleObject, declarationsToStyleObject(rule));
    } else {
      const nestedStyles = declarationsToStyleObject(rule);

      selectors
        .map(selector => trim(selector.replace('&', ' ')))
        .forEach(selector => { styleObject[selector] = nestedStyles; });

      return styleObject;
    }
  } else if (rule.type === 'media') {
    const mediaStyleObject = cssRulesToStyleObject(rule.rules);
    styleObject[`@media ${rule.media}`] = mediaStyleObject;
    return styleObject;
  }

  throw new Error(`Rule type ${rule.type} is not supported yet.`);
}, {}, rules);

// Template string tag
const cssish = (strings) => {
  const ast = parseCSS(strings.join(''));
  const styleObject = cssRulesToStyleObject(ast.stylesheet.rules);
  return cxs(styleObject);
};

export { cxs };
export default cssish;
