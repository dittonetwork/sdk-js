import { Maybe } from '../types';

export const isJwtValid = (jwt: Maybe<string>): boolean => {
  if (!jwt) {
    return false;
  }

  try {
    let decoded: Record<string, string | number> = {};
    if (typeof window === 'undefined') {
      const base64Url = jwt.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const buff = new Buffer(base64, 'base64');
      const payloadInit = buff.toString('ascii');
      decoded = JSON.parse(payloadInit);
      console.log({ decoded });
    } else {
      decoded = JSON.parse(atob(jwt.split('.')[1]));
    }

    if (!decoded['exp']) {
      return false;
    }

    return Math.floor(new Date().getTime() / 1000) < parseInt('' + decoded['exp']);
  } catch (_e) {
    return false;
  }
};
