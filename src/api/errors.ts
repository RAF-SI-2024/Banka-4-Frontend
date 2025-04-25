import axios from 'axios';
import { toast } from 'sonner';
import { z } from 'zod';

/* find . -type f \
        -execdir grep -q 'extends[[:space:]]*'BaseApiException '{}' ';' \
	 -print | xargs basename -s.java | sort
 */

/* Please keep list sorted and use the command provided above to generate it.
 */
const KNOWN_BACKEND_ERRORS = [
  'AccountNotActive',
  'AccountNotFound',
  'ActuaryNotFoundException',
  'AlreadyUpdatedOrderStatus',
  'AssetNotFound',
  'AuthorizedUserNotAllowed',
  'CannotUpdateActuaryException',
  'CantAcceptThisOffer',
  'CardLimitExceededException',
  'ClientCannotPayToOwnAccount',
  'ClientCannotTransferToSameAccount',
  'ClientContactNotFound',
  'ClientNotFound',
  'CompanyNotFound',
  'DuplicateAuthorizationException',
  'DuplicateCompanyName',
  'DuplicateCrn',
  'DuplicateEmail',
  'DuplicateTin',
  'DuplicateUsername',
  'EmployeeNotFound',
  'ExceededDailyLimit',
  'ExceededMonthlyLimit',
  'ExchangeNotFound',
  'ExpiredJwt',
  'IllegalArgumentJwt',
  'IncorrectCredentials',
  'InsufficientFunds',
  'InsufficientVolume',
  'InterbankError',
  'InterestRateAmountNotSupported',
  'InvalidAccountOperation',
  'InvalidData',
  'InvalidOrderStatus',
  'InvalidPhoneNumber',
  'ListingNotFoundException',
  'LoanAlreadyJudged',
  'LoanNotFound',
  'LoanTypeNotFound',
  'NegativeLimitException',
  'NoJwtProvided',
  'NoLoansOnAccount',
  'NonexistantSortByField',
  'NotAccountOwner',
  'NotActivated',
  'NotActiveTotpException',
  'NotAuthenticated',
  'NotEnoughStock',
  'NotFound',
  'NoTotpException',
  'NotValidCardStatus',
  'NotValidTotpException',
  'NullPageRequest',
  'OptionExpired',
  'OptionNotFound',
  'OptionOwnershipNotFound',
  'OrderNotFound',
  'OtcNotFoundException',
  'PrivilegeDoesNotExist',
  'RateLimitExceeded',
  'RefreshTokenRevoked',
  'RequestFailed',
  'RequiredPriceException',
  'RouteNotFound',
  'SettlementDatePassedException',
  'StockOwnershipNotFound',
  'TransactionInvalidOrAlreadyProcessed',
  'TransactionNotFound',
  'Unauthorized',
  'UserNotFound',
  'VerificationCodeExpiredOrInvalid',
  'WrongTurn',
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
  AccountNotActive: 'Your account is not active. Please contact support.',
  AccountNotFound: "We couldn't find your account.",
  ActuaryNotFoundException: 'The actuary could not be found.',
  AlreadyUpdatedOrderStatus: 'This order status has already been updated.',
  AssetNotFound: 'Requested asset could not be found.',
  AuthorizedUserNotAllowed: 'You are not authorized to perform this action.',
  CannotUpdateActuaryException: 'Unable to update the actuary details.',
  CantAcceptThisOffer: 'This offer cannot be accepted.',
  CardLimitExceededException: 'You’ve exceeded your card limit.',
  ClientCannotPayToOwnAccount: 'You cannot send money to your own account.',
  ClientCannotTransferToSameAccount: 'Cannot transfer to the same account.',
  ClientContactNotFound: 'Client contact was not found.',
  ClientNotFound: 'Client not found.',
  CompanyNotFound: 'Company could not be found.',
  DuplicateAuthorizationException: 'This authorization already exists.',
  DuplicateCompanyName: 'A company with this name already exists.',
  DuplicateCrn: 'This CRN is already in use.',
  DuplicateEmail: 'This email is already registered.',
  DuplicateTin: 'This TIN is already in use.',
  DuplicateUsername: 'This username is taken.',
  EmployeeNotFound: 'Employee not found.',
  ExceededDailyLimit: 'You’ve exceeded your daily limit.',
  ExceededMonthlyLimit: 'You’ve exceeded your monthly limit.',
  ExchangeNotFound: 'Exchange not found.',
  ExpiredJwt: 'Your session has expired. Please log in again.',
  IllegalArgumentJwt: 'Invalid token provided.',
  IncorrectCredentials: 'Incorrect username or password.',
  InsufficientFunds: 'You don’t have enough funds.',
  InsufficientVolume: 'Insufficient volume to complete the operation.',
  InterbankError: 'An error occurred with the interbank transfer.',
  InterestRateAmountNotSupported: 'This interest rate amount is not supported.',
  InvalidAccountOperation: 'Invalid operation for this account.',
  InvalidData: 'Some of the provided data is invalid.',
  InvalidOrderStatus: 'This order status is not valid.',
  InvalidPhoneNumber: 'The phone number entered is invalid.',
  ListingNotFoundException: 'The listing could not be found.',
  LoanAlreadyJudged: 'This loan has already been reviewed.',
  LoanNotFound: 'Loan not found.',
  LoanTypeNotFound: 'Loan type could not be found.',
  NegativeLimitException: 'Limit cannot be negative.',
  NoJwtProvided: 'Authentication token not provided.',
  NoLoansOnAccount: 'No loans found for this account.',
  NonexistantSortByField: 'The field you’re trying to sort by does not exist.',
  NotAccountOwner: 'You are not the owner of this account.',
  NotActivated: 'This account is not activated.',
  NotActiveTotpException: 'TOTP is not active.',
  NotAuthenticated: 'You must be logged in to do this.',
  NotEnoughStock: 'Not enough stock available.',
  NotFound: 'Requested resource was not found.',
  NoTotpException: 'TOTP not set up.',
  NotValidCardStatus: 'The card status is invalid for this operation.',
  NotValidTotpException: 'Invalid TOTP code.',
  NullPageRequest: 'The page request is missing.',
  OptionExpired: 'This option has expired.',
  OptionNotFound: 'Option not found.',
  OptionOwnershipNotFound: 'You don’t own this option.',
  OrderNotFound: 'Order not found.',
  OtcNotFoundException: 'OTC entry not found.',
  PrivilegeDoesNotExist: 'The required privilege does not exist.',
  RateLimitExceeded: 'Too many requests. Please try again later.',
  RefreshTokenRevoked: 'Your session has been revoked. Please log in again.',
  RequestFailed: 'Something went wrong. Please try again.',
  RequiredPriceException: 'Price is required for this action.',
  RouteNotFound: 'This route does not exist.',
  SettlementDatePassedException: 'The settlement date has passed.',
  StockOwnershipNotFound: 'Stock ownership not found.',
  TransactionInvalidOrAlreadyProcessed:
    'This transaction is invalid or has already been processed.',
  TransactionNotFound: 'Transaction not found.',
  Unauthorized: 'You are not authorized to access this resource.',
  UserNotFound: 'User not found.',
  VerificationCodeExpiredOrInvalid:
    'The verification code is invalid or has expired.',
  WrongTurn: 'You’ve made a wrong turn. Please check your steps.',
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
