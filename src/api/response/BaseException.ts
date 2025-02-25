// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const responseIsBaseException = (r: any): r is BaseException =>
  r?.failed === true;

export interface BaseException {
  failed: true;
  code: string;
  extra: unknown; // TODO:
}
