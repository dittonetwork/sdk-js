export const createDeferredPromise = <T>() => {
  let resolve: (input: T) => void;
  let reject: (reason?: Error) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return { promise, resolve, reject } as {
    promise: Promise<unknown>;
    resolve: (input: T) => void;
    reject: (reason?: Error) => void;
  };
};
