/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/ban-types */
declare module "expo-router" {
  import type { LinkProps as OriginalLinkProps } from 'expo-router/build/link/Link';
  import type { Router as OriginalRouter } from 'expo-router/build/types';
  export * from 'expo-router/build';

  // prettier-ignore
  type StaticRoutes = `/` | `/(main)/context/MainContext` | `/context/MainContext` | `/(main)/context/MainReducer` | `/context/MainReducer` | `/(main)/home/account-screen` | `/home/account-screen` | `/(main)/home/components/account-list` | `/home/components/account-list` | `/(main)/home/components/all-transactions-table` | `/home/components/all-transactions-table` | `/(main)/home/components/exchange-dialog` | `/home/components/exchange-dialog` | `/(main)/home/components/loyalty-info-modal` | `/home/components/loyalty-info-modal` | `/(main)/home/components/manage-accounts` | `/home/components/manage-accounts` | `/(main)/home/components/points-table` | `/home/components/points-table` | `/(main)/home/components/redeemed-table` | `/home/components/redeemed-table` | `/(main)/home/components/refresh-trigger` | `/home/components/refresh-trigger` | `/(main)/home/components/reward-card` | `/home/components/reward-card` | `/(main)/home/components/reward-modal` | `/home/components/reward-modal` | `/(main)/home/components/reward-trigger` | `/home/components/reward-trigger` | `/(main)/home/components/rewards-list` | `/home/components/rewards-list` | `/(main)/home/exchange-modal` | `/home/exchange-modal` | `/(main)/home/home-screen` | `/home/home-screen` | `/(main)/home/` | `/home/` | `/(main)/home` | `/(main)/home/my-rewards` | `/home/my-rewards` | `/(main)/` | `/(main)` | `/(main)/loading-screen` | `/loading-screen` | `/(start)/context/StartContext` | `/context/StartContext` | `/(start)/forgot-password/` | `/forgot-password/` | `/(start)/forgot-password` | `/(start)/login/` | `/login/` | `/(start)/login` | `/(start)/onboarding/` | `/onboarding/` | `/(start)/onboarding` | `/(start)/signup/` | `/signup/` | `/(start)/signup` | `/context/GlobalContext` | `/lib/basiq` | `/lib/supabase` | `/types/basiq` | `/types/helpers` | `/types/supabase` | `/utils/crud` | `/utils/fetching` | `/utils/formatting` | `/utils/functions` | `/utils/transactions` | `/(main)/home/components/personal-details` | `/home/components/personal-details`;
  // prettier-ignore
  type DynamicRoutes<T extends string> = `/(main)/store/${SingleRoutePart<T>}/components/reward-progress` | `/store/${SingleRoutePart<T>}/components/reward-progress` | `/(main)/store/${SingleRoutePart<T>}/components/store` | `/store/${SingleRoutePart<T>}/components/store` | `/(main)/store/${SingleRoutePart<T>}/components/transactions-table` | `/store/${SingleRoutePart<T>}/components/transactions-table` | `/(main)/store/${SingleRoutePart<T>}/` | `/store/${SingleRoutePart<T>}/` | `/(main)/store/${SingleRoutePart<T>}`;
  // prettier-ignore
  type DynamicRouteTemplate = `/(main)/store/[storeID]/components/reward-progress` | `/(main)/store/[storeID]/components/store` | `/(main)/store/[storeID]/components/transactions-table` | `/(main)/store/[storeID]/`;

  type RelativePathString = `./${string}` | `../${string}` | '..';
  type AbsoluteRoute = DynamicRouteTemplate | StaticRoutes;
  type ExternalPathString = `${string}:${string}`;

  type ExpoRouterRoutes = DynamicRouteTemplate | StaticRoutes | RelativePathString;
  export type AllRoutes = ExpoRouterRoutes | ExternalPathString;

  /****************
   * Route Utils  *
   ****************/

  type SearchOrHash = `?${string}` | `#${string}`;
  type UnknownInputParams = Record<string, string | number | (string | number)[]>;
  type UnknownOutputParams = Record<string, string | string[]>;

  /**
   * Return only the RoutePart of a string. If the string has multiple parts return never
   *
   * string   | type
   * ---------|------
   * 123      | 123
   * /123/abc | never
   * 123?abc  | never
   * ./123    | never
   * /123     | never
   * 123/../  | never
   */
  type SingleRoutePart<S extends string> = S extends `${string}/${string}`
    ? never
    : S extends `${string}${SearchOrHash}`
    ? never
    : S extends ''
    ? never
    : S extends `(${string})`
    ? never
    : S extends `[${string}]`
    ? never
    : S;

  /**
   * Return only the CatchAll router part. If the string has search parameters or a hash return never
   */
  type CatchAllRoutePart<S extends string> = S extends `${string}${SearchOrHash}`
    ? never
    : S extends ''
    ? never
    : S extends `${string}(${string})${string}`
    ? never
    : S extends `${string}[${string}]${string}`
    ? never
    : S;

  // type OptionalCatchAllRoutePart<S extends string> = S extends `${string}${SearchOrHash}` ? never : S

  /**
   * Return the name of a route parameter
   * '[test]'    -> 'test'
   * 'test'      -> never
   * '[...test]' -> '...test'
   */
  type IsParameter<Part> = Part extends `[${infer ParamName}]` ? ParamName : never;

  /**
   * Return a union of all parameter names. If there are no names return never
   *
   * /[test]         -> 'test'
   * /[abc]/[...def] -> 'abc'|'...def'
   */
  type ParameterNames<Path> = Path extends `${infer PartA}/${infer PartB}`
    ? IsParameter<PartA> | ParameterNames<PartB>
    : IsParameter<Path>;

  /**
   * Returns all segements of a route.
   *
   * /(group)/123/abc/[id]/[...rest] -> ['(group)', '123', 'abc', '[id]', '[...rest]'
   */
  type RouteSegments<Path> = Path extends `${infer PartA}/${infer PartB}`
    ? PartA extends '' | '.'
      ? [...RouteSegments<PartB>]
      : [PartA, ...RouteSegments<PartB>]
    : Path extends ''
    ? []
    : [Path];

  /**
   * Returns a Record of the routes parameters as strings and CatchAll parameters
   *
   * There are two versions, input and output, as you can input 'string | number' but
   *  the output will always be 'string'
   *
   * /[id]/[...rest] -> { id: string, rest: string[] }
   * /no-params      -> {}
   */
  type InputRouteParams<Path> = {
    [Key in ParameterNames<Path> as Key extends `...${infer Name}`
      ? Name
      : Key]: Key extends `...${string}` ? (string | number)[] : string | number;
  } & UnknownInputParams;

  type OutputRouteParams<Path> = {
    [Key in ParameterNames<Path> as Key extends `...${infer Name}`
      ? Name
      : Key]: Key extends `...${string}` ? string[] : string;
  } & UnknownOutputParams;

  /**
   * Returns the search parameters for a route.
   */
  export type SearchParams<T extends AllRoutes> = T extends DynamicRouteTemplate
    ? OutputRouteParams<T>
    : T extends StaticRoutes
    ? never
    : UnknownOutputParams;

  /**
   * Route is mostly used as part of Href to ensure that a valid route is provided
   *
   * Given a dynamic route, this will return never. This is helpful for conditional logic
   *
   * /test         -> /test, /test2, etc
   * /test/[abc]   -> never
   * /test/resolve -> /test, /test2, etc
   *
   * Note that if we provide a value for [abc] then the route is allowed
   *
   * This is named Route to prevent confusion, as users they will often see it in tooltips
   */
  export type Route<T> = T extends string
    ? T extends DynamicRouteTemplate
      ? never
      :
          | StaticRoutes
          | RelativePathString
          | ExternalPathString
          | (T extends `${infer P}${SearchOrHash}`
              ? P extends DynamicRoutes<infer _>
                ? T
                : never
              : T extends DynamicRoutes<infer _>
              ? T
              : never)
    : never;

  /*********
   * Href  *
   *********/

  export type Href<T> = T extends Record<'pathname', string> ? HrefObject<T> : Route<T>;

  export type HrefObject<
    R extends Record<'pathname', string>,
    P = R['pathname'],
  > = P extends DynamicRouteTemplate
    ? { pathname: P; params: InputRouteParams<P> }
    : P extends Route<P>
    ? { pathname: Route<P> | DynamicRouteTemplate; params?: never | InputRouteParams<never> }
    : never;

  /***********************
   * Expo Router Exports *
   ***********************/

  export type Router = Omit<OriginalRouter, 'push' | 'replace' | 'setParams'> & {
    /** Navigate to the provided href. */
    push: <T>(href: Href<T>) => void;
    /** Navigate to route without appending to the history. */
    replace: <T>(href: Href<T>) => void;
    /** Update the current route query params. */
    setParams: <T = ''>(params?: T extends '' ? Record<string, string> : InputRouteParams<T>) => void;
  };

  /** The imperative router. */
  export const router: Router;

  /************
   * <Link /> *
   ************/
  export interface LinkProps<T> extends OriginalLinkProps {
    href: Href<T>;
  }

  export interface LinkComponent {
    <T>(props: React.PropsWithChildren<LinkProps<T>>): JSX.Element;
    /** Helper method to resolve an Href object into a string. */
    resolveHref: <T>(href: Href<T>) => string;
  }

  /**
   * Component to render link to another route using a path.
   * Uses an anchor tag on the web.
   *
   * @param props.href Absolute path to route (e.g. `/feeds/hot`).
   * @param props.replace Should replace the current route without adding to the history.
   * @param props.asChild Forward props to child component. Useful for custom buttons.
   * @param props.children Child elements to render the content.
   * @param props.className On web, this sets the HTML `class` directly. On native, this can be used with CSS interop tools like Nativewind.
   */
  export const Link: LinkComponent;

  /** Redirects to the href as soon as the component is mounted. */
  export const Redirect: <T>(
    props: React.PropsWithChildren<{ href: Href<T> }>
  ) => JSX.Element;

  /************
   * Hooks *
   ************/
  export function useRouter(): Router;

  export function useLocalSearchParams<
    T extends AllRoutes | UnknownOutputParams = UnknownOutputParams,
  >(): T extends AllRoutes ? SearchParams<T> : T;

  /** @deprecated renamed to `useGlobalSearchParams` */
  export function useSearchParams<
    T extends AllRoutes | UnknownOutputParams = UnknownOutputParams,
  >(): T extends AllRoutes ? SearchParams<T> : T;

  export function useGlobalSearchParams<
    T extends AllRoutes | UnknownOutputParams = UnknownOutputParams,
  >(): T extends AllRoutes ? SearchParams<T> : T;

  export function useSegments<
    T extends AbsoluteRoute | RouteSegments<AbsoluteRoute> | RelativePathString,
  >(): T extends AbsoluteRoute ? RouteSegments<T> : T extends string ? string[] : T;
}
