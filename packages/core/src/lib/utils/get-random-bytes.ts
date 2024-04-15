export const getRandomBytes = (length: number): Uint8Array => {
  if (typeof window !== 'undefined') {
    const randomBytes = new Uint8Array(length);
    window.crypto.getRandomValues(randomBytes);
    return randomBytes;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { randomBytes } = require('crypto');
    return new Uint8Array(randomBytes(length));
  }
};
