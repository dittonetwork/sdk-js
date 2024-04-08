import { InstantTrigger } from '../instant-trigger';

export const isInstantTrigger = (input: unknown): input is InstantTrigger => {
  return input instanceof InstantTrigger;
};
