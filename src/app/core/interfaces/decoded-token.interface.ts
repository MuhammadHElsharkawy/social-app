export interface IDecodedToken {
  user: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}
