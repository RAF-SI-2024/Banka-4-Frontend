/* Please keep in sync with:
 * user-service/src/main/java/rs/banka4/user_service/models/Privilege.java
 */
export const EMPLOYEE_PRIVILEGES_ = ['ADMIN', 'SUPERVISOR', 'AGENT'] as const;

export const CLIENT_PRIVILEGES_ = ['TRADE'] as const;

export const ALL_PRIVILEGES_ = [
  ...EMPLOYEE_PRIVILEGES_,
  ...CLIENT_PRIVILEGES_,
] as const;

export type Privilege = (typeof ALL_PRIVILEGES_)[number];
export type ClientPrivilege = (typeof CLIENT_PRIVILEGES_)[number];
export type EmployeePrivilege = (typeof EMPLOYEE_PRIVILEGES_)[number];

export const ALL_PRIVILEGES: Privilege[] = [...ALL_PRIVILEGES_];
export const EMPLOYEE_PRIVILEGES: EmployeePrivilege[] = [
  ...EMPLOYEE_PRIVILEGES_,
];
export const CLIENT_PRIVILEGES: ClientPrivilege[] = [...CLIENT_PRIVILEGES_];

/** Checks whether the argument names a real privilege.
 * @param potentialPrivilege String to check for validity
 * @returns Whether `potentialPrivilege` is a valid privilege.
 */
export function isValidPrivilege(
  potentialPrivilege: string
): potentialPrivilege is Privilege {
  return (ALL_PRIVILEGES as string[]).includes(potentialPrivilege);
}
