export const getRandomBytes = (length: number): Uint8Array => {
  if (typeof window !== 'undefined') {
    const randomBytes = new Uint8Array(length);
    window.crypto.getRandomValues(randomBytes);
    return randomBytes;
  } else {
    const { randomBytes } = require('crypto');
    return new Uint8Array(randomBytes(length));
  }
};
