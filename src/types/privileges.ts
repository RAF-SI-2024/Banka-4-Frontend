/* Please keep in sync with:
 * user-service/src/main/java/rs/banka4/user_service/models/Privilege.java
 */
const ALL_PRIVILEGES_ = [
  'ADMIN',
  'FILTER',
  'SEARCH',
  'TRADE_STOCKS',
  'VIEW_STOCKS',
  'CONTRACTS',
  'NEW_INSURANCES',
] as const;

export type Privilege = (typeof ALL_PRIVILEGES_)[number];
export const ALL_PRIVILEGES: Privilege[] = [...ALL_PRIVILEGES_];

/** Checks whether the argument names a real privilege.
 * @param potentialPrivilege String to check for validity
 * @returns Whether `potentialPrivilege` is a valid privilege.
 */
export function isValidPrivilege(
  potentialPrivilege: string
): potentialPrivilege is Privilege {
  return (ALL_PRIVILEGES as string[]).includes(potentialPrivilege);
}
