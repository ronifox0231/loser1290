import { createElement } from "./zeyah-jsx.js";

export type ZeyahNode =
  | AnyZeyahElement
  | AnyZeyahElement[]
  | string
  | number
  | bigint
  | Iterable<ZeyahNode>
  | boolean
  | null
  | undefined;

export type FCPropsLibraryManaged = {
  platform: PlatformType;
  /**
   * @deprecated
   */
  get childrenString(): string;
  getChildrenString(): string;
  childrenData: ZeyahChildrenData;
  selfData: ZeyahChildren;
  rootFiber: ZeyahFiber<any>;
};
export type FCPropsDefaults = FCPropsLibraryManaged & {
  children?: ZeyahNode;
};

export interface ZeyahChildren {
  /**
   * @deprecated
   */
  get rendered(): string;
  readonly getRendered: () => string;
  readonly fiber: ZeyahFiber | "string";
}

export interface ZeyahChildrenData extends ReadonlyArray<ZeyahChildren> {}

export type PropsWithInfo<T = {}> = FCPropsDefaults & T;

export type PlatformType = "facebook" | "discord" | "unspecified";

export interface FC<Props = {}> {
  displayName?: string;
  (props: Props): ZeyahNode;
}

export type FCPropsOf<TFC extends AnyFC> =
  TFC extends FC<infer Props> ? Props : never;

export interface AnyFC extends FC<any> {}

export namespace Comment {
  /**
   * I had to learn the hard way that you should not use instanceof checks if you use bundle system, because different memory. But Symbol.hasInstance fixes this problem.
   */
  export type _1 = 1;
}
export class ZeyahElement<Props> {
  props: Props;
  type: FC<Props>;
  children: ZeyahNode;
  refKey: string;

  constructor(
    type: FC<Props>,
    props: Props = {} as Props,
    children: ZeyahNode,
  ) {
    this.type = type;
    this.props = props;
    this.children = children;
    // @ts-ignore
    delete this.props.children;
    this.refKey = ZeyahElement.refKey;
  }

  static refKey = "ZeyahElement_7";

  static [Symbol.hasInstance](obj: any) {
    return (
      obj &&
      typeof obj === "object" &&
      "type" in obj &&
      "props" in obj &&
      "children" in obj &&
      obj.refKey === ZeyahElement.refKey
    );
  }

  renderDiscord() {
    return this.toString("discord");
  }
  renderFacebook() {
    return this.toString("facebook");
  }

  toString(platform: PlatformType = "facebook") {
    return renderZeyahTree(this, platform);
  }

  [Symbol.toPrimitive](hint: string) {
    if (hint === "number") {
      return NaN;
    }
    return this.toString();
  }

  specialResolveCase?(...args: any[]): unknown;
}

export interface AnyZeyahElement extends ZeyahElement<any> {}

export class ZeyahFiber<Props = any> {
  children: (ZeyahFiber | string)[] = [];
  output: string[] = [];
  jsxElem: ZeyahElement<Props>;
  states: Map<string, unknown>;
  root: ZeyahFiber<any>;

  constructor(
    element: ZeyahElement<Props>,
    root: ZeyahFiber<any> | "self-root",
  ) {
    this.jsxElem = element;
    this.states = new Map();
    this.detectedParent = null;
    this.root = root === "self-root" ? this : (root ?? null);
    if (!this.root) {
      throw new Error("missing root!!");
    }

    this.collectChildren();
  }

  get type(): FC<Props> {
    return this.jsxElem.type ?? (ZeyahFragment as FC<Props>);
  }

  get props(): PropsWithInfo<Props> {
    return this.jsxElem.props as PropsWithInfo<Props>;
  }

  static collectChildren(
    initChildren: ZeyahNode,
    root: ZeyahFiber<any>,
  ): ZeyahFiber<any>["children"] {
    if (initChildren == null) return [];

    const source = Array.isArray(initChildren) ? initChildren : [initChildren];

    const result: (ZeyahFiber | string)[] = [];

    for (const child of source) {
      if (child == null) continue;

      if (child instanceof ZeyahElement) {
        result.push(new ZeyahFiber(child, root));
        continue;
      }

      if (typeof child === "string") {
        result.push(child);
        continue;
      }

      if (typeof child === "number" || typeof child === "bigint") {
        result.push(String(child));
        continue;
      }

      if (typeof child === "boolean") {
        if (child) result.push("true");
        else result.push("false");
        continue;
      }

      if (typeof child === "object" && Symbol.iterator in child) {
        result.push(
          ...ZeyahFiber.collectChildren(
            [...(child as Iterable<ZeyahNode>)],
            root,
          ),
        );
      }
    }

    return result;
  }

  static typeName(elem: AnyZeyahElement) {
    return elem.type?.displayName ?? elem.type?.name ?? "??";
  }

  collectChildren() {
    const res = ZeyahFiber.collectChildren(this.jsxElem.children, this.root);
    this.children = res;
  }

  detectedParent?: ZeyahFiber<any>;

  get rootState() {
    return this.root.states;
  }

  render(platform: PlatformType): string[] {
    this.children.filter(NullishFilter).forEach((i) => {
      if (i instanceof ZeyahFiber) {
        i.detectedParent = this;
      }
    });
    const childrenData: ZeyahChildrenData = this.children
      .filter(NullishFilter)
      .flatMap((c) => {
        const isString = typeof c === "string";
        let cache: string = null;
        const getRendered = () => {
          if (cache !== null) {
            return cache;
          }
          const res = isString ? c : c.render(platform).join("");
          cache = res;
          return res;
        };
        return {
          get rendered() {
            return getRendered();
          },
          getRendered,
          fiber: isString ? "string" : c,
        } satisfies ZeyahChildren;
      });

    let childrenString: string = null;
    const getChildrenString = () => {
      if (childrenString !== null) {
        return childrenString;
      }
      const res = childrenData.map((i) => i.getRendered()).join("");
      childrenString = res;
      return res;
    };
    const selfData: ZeyahChildren = (() => {
      const c = this;

      return {
        getRendered() {
          return "??";
        },
        rendered: "??",
        fiber: c,
      };
    })();

    const propsWithChildren: PropsWithInfo<Props> = {
      ...this.props,
      get childrenString() {
        return getChildrenString();
      },
      getChildrenString,
      platform,
      childrenData,
      selfData,
      rootFiber: this.root,
    };

    const result =
      typeof this.type === "function" ? this.type(propsWithChildren) : null;

    const normalized = ZeyahFiber.collectChildren(result, this.root);

    const finalOutput = normalized.flatMap((item) =>
      typeof item === "string" ? item : item.render(platform),
    );

    this.output = finalOutput;
    return finalOutput;
  }

  buildString(): string {
    return `<${this.type.displayName || this.type.name || "Unknown"}>${this.output.join("")}</${this.type.displayName || this.type.name || "Unknown"}>`;
  }
}

export const ZeyahFragment: FC<PropsWithInfo> = ({ childrenString }) => {
  return childrenString;
};

ZeyahFragment.displayName = "Fragment";

export const Platform: FC<PropsWithInfo<{ type: PlatformType }>> = ({
  type,
  platform,
  getChildrenString,
}) => {
  if (type !== platform) return "";
  return getChildrenString();
};

Platform.displayName = "Platform";

export function ensureArrayChildren(children: string | string[]): string[] {
  return Array.isArray(children) ? children : [children];
}

/**
 * Create a ZeyahFiber from an AnyZeyahElement
 */
export function createZeyahTree(node: ZeyahNode): ZeyahFiber {
  const frag =
    typeof node === "object" && "type" in node && node.type === ZeyahFragment
      ? node
      : (createElement(
          ZeyahFragment,
          { children: node },
          null,
        ) as AnyZeyahElement);
  const fiber = new ZeyahFiber(frag, "self-root");
  return fiber;
}

/**
 * Render a fiber or AnyZeyahElement for a given platform
 */
export function renderZeyahTree(
  nodeOrFiber: ZeyahFiber | ZeyahNode,
  platform: PlatformType,
): string {
  const fiber =
    nodeOrFiber instanceof ZeyahFiber
      ? nodeOrFiber
      : createZeyahTree(nodeOrFiber);
  return fiber.render(platform).join("");
}

export function NullishFilter(i: any) {
  return i !== null && i !== undefined;
}
