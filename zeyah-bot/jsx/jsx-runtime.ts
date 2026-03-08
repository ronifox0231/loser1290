import Zeyah, {
  type AnyFC,
  type AnyZeyahElement,
  ZeyahElement,
  ZeyahJSX,
  type PropsWithInfo,
  createElement,
  type FC,
} from "./index.js";

export function jsx(
  type: string | AnyFC,
  props: PropsWithInfo<unknown>,
  _key: string,
) {
  return jsxs(type, props, _key);
}

/**
 * jsx stuff
 */
export function jsxs(
  type: string | AnyFC,
  props: PropsWithInfo<unknown>,
  _key: string,
): AnyZeyahElement {
  return createElement(type as any, props, _key);
}

export function jsxDEV(
  type: string | AnyFC,
  props: PropsWithInfo<unknown>,
  _key: string,
): AnyZeyahElement {
  return jsxs(type, props, _key);
}
export { ZeyahJSX as JSX };
export const Fragment: FC<PropsWithInfo> = ({ childrenString }) => {
  return childrenString;
};

Fragment.displayName = "Fragment";
