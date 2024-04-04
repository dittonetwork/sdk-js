// @todo do the same for Node.js env
export const getRandomBytes = (length: number): Uint8Array => {
  // Create a Uint8Array of the desired length
  const randomBytes = new Uint8Array(length);

  // Fill the array with cryptographically secure random bytes
  window.crypto.getRandomValues(randomBytes);

  return randomBytes;
};
