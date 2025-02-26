export type SomePartial<T, Members extends keyof T> = Partial<
  Pick<T, Members>
> &
  Omit<T, Members>;

/** Check that `value` is a `never` type.  Useful for exhaustiveness and
 * dead-code checking.
 * @param value Value that should never be present.
 * @returns Never returns.  Should never be called.
 */
export function assertNever(value: never): never {
  throw new Error(`Reached unreachable with value ${value}`);
}
