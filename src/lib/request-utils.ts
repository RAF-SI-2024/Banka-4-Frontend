/**
 * Returns a new object that includes only the properties from the given object
 * whose values are neither empty strings, null, nor undefined.
 *
 * This utility function is useful for cleaning objects (e.g., filters or query parameters)
 * before sending them to APIs or using them in contexts that do not accept empty values.
 * It works with any interface type provided as T.
 *
 * @typeParam T - The type of the object to be cleaned.
 * @param obj - The object to be cleaned. It can be of any interface type.
 * @returns A new object of type Partial<T> that contains only the properties with valid values.
 *
 * @example
 * interface Filter {
 *   name: string;
 *   age?: number;
 *   country?: string;
 * }
 *
 * const filter: Filter = {
 *   name: "Alice",
 *   age: undefined,
 *   country: ""
 * };
 *
 * const cleanedFilter = cleanObject(filter);
 * // cleanedFilter is { name: "Alice" }
 */
export function cleanObject<T extends object>(obj: T): Partial<T> {
  const cleaned = {} as Partial<T>;

  (Object.keys(obj) as Array<keyof T>).forEach((key) => {
    const value = obj[key];
    if (value !== '' && value !== null && value !== undefined) {
      cleaned[key] = value;
    }
  });

  return cleaned;
}
