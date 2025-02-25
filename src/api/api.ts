import {
  BaseException,
  responseIsBaseException,
} from './response/BaseException';

const notifyErrorResponse = async <R>(p: Promise<R | BaseException>) => {
  const ret = await p;
  if (responseIsBaseException(ret)) {
    alert(`Error: ${ret.code}`);
  }
  return ret;
};

const _get = async <R>(endpoint: string) => {
  try {
    const r = await fetch(endpoint, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const resp = await r.json();
    return resp as R | BaseException;
  } catch {
    return {
      failed: true,
      code: 'FrontNetworkError',
    } as BaseException;
  }
};

export const get = async <R>(
  endpoint: string,
  notify: boolean = false
): Promise<R> => {
  const resp = await (notify
    ? notifyErrorResponse(_get<R>(endpoint))
    : _get<R>(endpoint));
  return new Promise((resolve, reject) => {
    if (responseIsBaseException(resp)) {
      reject(resp);
    }
    resolve(resp as R);
  });
};
