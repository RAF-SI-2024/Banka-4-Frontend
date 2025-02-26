import {
  BaseException,
  responseIsBaseException,
} from './response/BaseException';
import { toast } from 'sonner';
import { apiErrorMessages, ErrorType } from './errors';

const notifyErrorResponse = async <R>(p: Promise<R | BaseException>) => {
  const ret = await p;
  if (responseIsBaseException(ret)) {
    const code = ret.code.split('.').at(-1) as ErrorType;
    const message = apiErrorMessages[code];
    toast.error(`Error: ${message}`);
  }
  return ret;
};

const _fetch = async <R>(endpoint: string, init: RequestInit = {}) => {
  try {
    const r = await fetch(endpoint, {
      credentials: 'include',
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
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

const unwrapToken = async (getToken?: () => Promise<string | null>) => {
  const token = getToken ? await getToken() : null;
  const init: RequestInit = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
  return init;
};

const resolveResponse = <R>(response: R | BaseException): Promise<R> =>
  new Promise((resolve, reject) => {
    if (responseIsBaseException(response)) {
      reject(response);
    }
    resolve(response as R);
  });

export const get = async <R>(
  endpoint: string,
  getToken?: () => Promise<string | null>,
  notify: boolean = false
): Promise<R> => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}${endpoint}`;
  const init = await unwrapToken(getToken);
  const resp = await (notify
    ? notifyErrorResponse(_fetch<R>(url, init))
    : _fetch<R>(url, init));
  return resolveResponse(resp);
};

export const post = async <Dto extends object, Resp = unknown>(
  endpoint: string,
  dto: Dto,
  getToken?: () => Promise<string | null>,
  notify: boolean = false
) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}${endpoint}`;
  const init = await unwrapToken(getToken);
  init.method = 'POST';
  init.body = JSON.stringify(dto);
  const resp = await (notify
    ? notifyErrorResponse(_fetch<Resp>(url, init))
    : _fetch<Resp>(url, init));
  return resolveResponse(resp);
};

export const put = async <Dto extends object, Resp = unknown>(
  endpoint: string,
  id: string,
  dto: Partial<Dto>,
  getToken?: () => Promise<string | null>,
  notify: boolean = false
) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}${endpoint}/${id}`;
  const init = await unwrapToken(getToken);
  init.method = 'PUT';
  init.body = JSON.stringify(dto);
  const resp = await (notify
    ? notifyErrorResponse(_fetch<Resp>(url, init))
    : _fetch<Resp>(url, init));
  return resolveResponse(resp);
};
