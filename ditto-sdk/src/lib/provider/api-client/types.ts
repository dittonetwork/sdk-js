export type AuthNonce = string;

export type JSONBody = string | number | boolean | JSONObject;

export interface JSONObject {
  [x: string]: JSONBody;
}
