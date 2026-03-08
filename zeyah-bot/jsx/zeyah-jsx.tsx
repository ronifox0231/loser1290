import { Bold, Break, Line } from "./components.js";
import {
  type AnyZeyahElement,
  type FC,
  type AnyFC,
  type PropsWithInfo,
  ZeyahElement,
  ZeyahFragment,
  type FCPropsLibraryManaged,
  type FCPropsOf,
} from "./zeyah.js";

export namespace ZeyahIntrinsics {
  export const br = Break;
  export const fragment: FC<PropsWithInfo> = ({ childrenString }) => {
    return childrenString;
  };
  export const line = Line;
  export const bold = Bold;
}

type ZeyahIntrinsics_2 = typeof ZeyahIntrinsics;

export interface ZeyahIntrinsics extends ZeyahIntrinsics_2 {}

export namespace ZeyahJSX {
  export const a = "JSX";
  export type IntrinsicElements = {
    [K in keyof ZeyahIntrinsics]: LibraryManagedAttributes<
      ZeyahIntrinsics[K],
      Parameters<ZeyahIntrinsics[K]>[0]
    >;
  };

  let b: IntrinsicElements["br"];

  export type Element = AnyZeyahElement;

  export type PropsOf<C> = C extends FC<infer P> ? P : never;
  export type LibraryManagedAttributes<C, P> =
    C extends FC<any>
      ? Omit<PropsOf<C>, "key" | keyof FCPropsLibraryManaged>
      : P;

  export type ElementType = AnyFC | string;
}

export type UserProps<P> = Omit<PropsWithInfo<P>, keyof FCPropsLibraryManaged>;
export type IntrinsicNames = keyof ZeyahJSX.IntrinsicElements | "";

export function createElement<TFC extends AnyFC | IntrinsicNames>(
  type: TFC,
  props: UserProps<
    TFC extends AnyFC
      ? FCPropsOf<TFC>
      : TFC extends keyof ZeyahJSX.IntrinsicElements
        ? ZeyahJSX.IntrinsicElements[TFC]
        : never
  >,
  _key: string,
): AnyZeyahElement {
  if (type === "" || type === undefined) {
    type = ZeyahFragment as TFC;
  }
  if (typeof type === "string") {
    const intrin =
      type in ZeyahIntrinsics
        ? ZeyahIntrinsics[type as keyof ZeyahIntrinsics]
        : ZeyahIntrinsics.fragment;
    type = intrin as TFC;
  }

  props ??= {} as typeof props;
  if (props?.children) {
    if (
      Array.isArray(props.children) &&
      props.children.some((c: any) => Array.isArray(c))
    ) {
      props.children = props.children.flat();
    } else if (!Array.isArray(props.children)) {
      props.children = [props.children];
    }
  }
  const finalProps: typeof props = {
    ...props,
    platform: props.platform ?? "unspecified",
    children: props.children,
  };
  return new ZeyahElement(type as any, finalProps, finalProps.children ?? []);
}
