export type AuthNonce = string;

export type JSONBody = string | number | boolean | bigint | JSONObject;

export interface JSONObject {
  [x: string]: JSONBody;
}
