/* user-service/src/main/java/rs/banka4/user_service/exceptions/ file listing,
 * with the exception of BaseException and ErrorResponseHandler.
 */
import axios from 'axios';
import { toast } from 'sonner';
import { z } from 'zod';

const KNOWN_BACKEND_ERRORS = [
  'AccountNotFound',
  'ClientNotFound',
  'CompanyNotFound',
  'ContactNotFound',
  'DuplicateCompanyName',
  'DuplicateCrn',
  'DuplicateTin',
  'EmployeeNotFound',
  'InsufficientFunds',
  'InvalidCurrency',
  'NonexistantSortByField',
  'NotAccountOwner',
  'NullPageRequest',
  'RouteNotFound',
  'TransactionNotFound',
  'UserNotFound',
  'DuplicateEmail',
  'DuplicateUsername',
  'IncorrectCredentials',
  'InvalidData',
  'NotActivated',
  'NotAuthenticated',
  'NotFound',
  'PrivilegeDoesNotExist',
  'RateLimitExceeded',
  'VerificationCodeExpiredOrInvalid',
] as const;

export type KnownBackendErrors = (typeof KNOWN_BACKEND_ERRORS)[number];

type KeyMustExtendKBE<T> = keyof T extends KnownBackendErrors ? T : never;
type APIErrorData = KeyMustExtendKBE<{
  DuplicateEmail: {
    email: string;
  };
  DuplicateUsername: {
    username: string;
  };
}>;

type MkErrorExtraData<T> = T extends keyof APIErrorData
  ? {
      failed: true;
      code: T;
      extra: APIErrorData[T];
    }
  : {
      failed: true;
      code: T;
    };
type APIErrorAlmost = {
  [Error in KnownBackendErrors]: MkErrorExtraData<Error>;
};
export type KnownAPIError = APIErrorAlmost[KnownBackendErrors];
export type GeneralAPIError =
  | {
      failed: true;
      code: string;
    }
  | {
      failed: true;
      code: string;
      extra: unknown;
    };

export const apiErrorMessages: Readonly<Record<KnownBackendErrors, string>> = {
  AccountNotFound: "The account you're looking for doesn't exist.",
  ClientNotFound: 'Client information could not be found.',
  CompanyNotFound: 'The specified company was not found.',
  ContactNotFound: 'No contact details were found.',
  DuplicateCompanyName: 'A company with this name already exists.',
  DuplicateCrn: 'This company registration number is already in use.',
  DuplicateTin: 'This tax identification number is already registered.',
  EmployeeNotFound: 'The requested employee could not be found.',
  InsufficientFunds:
    'Your account has insufficient funds to complete this transaction.',
  InvalidCurrency: 'The selected currency is not supported.',
  NonexistantSortByField: "The field you're trying to sort by does not exist.",
  NotAccountOwner: "You don't have permission to access this account.",
  NullPageRequest:
    'Invalid page request. Please provide valid pagination details.',
  RouteNotFound: 'The requested route could not be found.',
  TransactionNotFound: 'The specified transaction does not exist.',
  UserNotFound: 'The user could not be found.',
  DuplicateEmail: 'The email you provided is already taken',
  DuplicateUsername: 'The username you provided is already taken',
  IncorrectCredentials: 'Incorrect credentials',
  InvalidData: 'Invalid data',
  NotActivated: 'Account not active',
  NotAuthenticated: 'Not logged in',
  NotFound: 'Not found',
  PrivilegeDoesNotExist: 'Invalid privilege',
  RateLimitExceeded: 'Rate limit exceeded!',
  VerificationCodeExpiredOrInvalid: 'Your verification code expired',
};
export const UNKNOWN_ERROR_MESSAGE = 'An unknown error occurred';

export function isAPIError(apiError: unknown): apiError is GeneralAPIError {
  const pres: z.SafeParseReturnType<unknown, GeneralAPIError> = z
    .strictObject({
      code: z.string(),
      failed: z.literal(true),
      extra: z.any().optional(),
    })
    .safeParse(apiError);
  return pres.success;
}

/** @returns Whether `apiError` is a known API error.  */
export function isKnownAPIError(
  apiError: GeneralAPIError
): apiError is KnownAPIError {
  return ([...KNOWN_BACKEND_ERRORS] as string[]).includes(apiError.code);
}

/** Returns the correct error message for a given API error.
 * For a variant that always produces a value, see {@link getErrorMessage}.
 *
 * @param apiError API error to produce an error message for.
 * @returns The error message, if one exists.
 */
export function getErrorMessageRaw(
  apiError: GeneralAPIError
): string | undefined {
  if (!isKnownAPIError(apiError)) return undefined;
  return apiErrorMessages[apiError.code];
}

/** Returns an error message for a given API error.
 * For a variant that indicates when it receives an unknown error, see
 * {@link getErrorMessageRaw}.
 *
 * @param apiError API error to produce an error message for.
 * @returns An error message.
 */
export function getErrorMessage(apiError: GeneralAPIError): string {
  if (!isKnownAPIError(apiError)) return UNKNOWN_ERROR_MESSAGE;
  return apiErrorMessages[apiError.code];
}

/** Options passable to {@link toastRequestError}.  */
interface ToastGeneratorOptions {
  /** Line of text to display as the title of a toast.  Should be something
   *  akin to "Login failed!"
   */
  headerLine?: string;
}

/** Given an error thrown by {@link axios} or a similar API (really, anything)
 *  and produces an appropriate toast message.
 *
 *  Usage example:
 *  @example
 *  try {
 *    return axios.get<SomeDto>('/foo');
 *  } catch (err) {
 *    toastRequestError(err);
 *    return;
 *  }
 *
 * @param requestError Error that occured while processing a request.
 * @param options Additional configuration.
 */
export function toastRequestError(
  requestError: unknown,
  options: ToastGeneratorOptions = {}
) {
  const { headerLine = 'Error!' } = options;
  const commonToastData: Parameters<typeof toast>[1] = {
    closeButton: true,
  };

  console.log(
    `An error happened.  Error header line: ${headerLine}`,
    requestError
  );
  if (!axios.isAxiosError(requestError)) {
    if (requestError instanceof Error) {
      toast.error(headerLine, {
        ...commonToastData,
        description: `An unknown error happened. Error message: ${requestError.message}`,
      });
    } else {
      toast.error(headerLine, {
        ...commonToastData,
        description: `An unknown error happened.`,
      });
    }
    return;
  }

  if (requestError.response) {
    /* Server-sent error.  */
    if (!isAPIError(requestError.response.data)) {
      toast.error(headerLine, {
        ...commonToastData,
        description: `An unknown server error occurred. Please contact us!`,
      });
    } else {
      toast.error(headerLine, {
        ...commonToastData,
        description: getErrorMessage(requestError.response.data),
      });
    }
    return;
  } else if (requestError.request) {
    /* Server never sent an error, but it never sent a request.  It's likely a
     * network error of some sort.
     */
    toast.error(headerLine, {
      ...commonToastData,
      description: `An unknown server error occurred. Please contact us!`,
    });
    return;
  } else {
    toast.error(headerLine, {
      ...commonToastData,
      description: `An unknown error happened.`,
    });
  }
}
