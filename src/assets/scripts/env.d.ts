/** Build-time constants */

declare global {
  const DEV: boolean;
}

/** View Transitions API */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Document extends ViewTransitionsAPI {}
}

declare interface ViewTransitionsAPI {
  startViewTransition(updateCallback?: () => void | Promise<void>): ViewTransition;
}

interface ViewTransition {
  readonly updateCallbackDone: Promise<void>;
  readonly ready: Promise<void>;
  readonly finished: Promise<void>;
  skipTransition(): void;
}

export {};
