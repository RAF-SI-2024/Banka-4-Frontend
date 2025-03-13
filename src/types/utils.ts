export type SomePartial<T, Members extends keyof T> = Partial<
  Pick<T, Members>
> &
  Omit<T, Members>;

export type SomePartials<T, Members extends readonly (keyof T)[]> = Omit<
  T,
  Members[number]
> &
  Partial<Pick<T, Members[number]>>;

/** Check that `value` is a `never` type.  Useful for exhaustiveness and
 * dead-code checking.
 * @param value Value that should never be present.
 * @returns Never returns.  Should never be called.
 */
export function assertNever(value: never): never {
  throw new Error(`Reached unreachable with value ${value}`);
}
