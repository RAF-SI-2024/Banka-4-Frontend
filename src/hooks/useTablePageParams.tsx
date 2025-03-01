'use client';
import { parseAsInteger, useQueryState } from 'nuqs';

export interface ParamsDefaultValue {
  page: number | null;
  pageSize: number | null;
  //  sort: SortProperty[] | null;
  //   filters: FilterProperty[] | null;
}

const useTablePageParams = (
  name: string,
  defaultValue?: ParamsDefaultValue
) => {
  const [page, setPage] = useQueryState(
    `${name}:page`,
    parseAsInteger
      .withOptions({
        throttleMs: 300,
        shallow: true,
      })
      .withDefault(defaultValue?.page ?? 0)
  );

  const [pageSize, setPageSize] = useQueryState<number>(
    `${name}:pageSize`,
    parseAsInteger
      .withOptions({
        throttleMs: 300,
        shallow: true,
      })
      .withDefault(defaultValue?.pageSize ?? 20)
  );

  /*
    const [sort, setSort] = useQueryState<SortProperty[]>(`${name}:sort`, ({
        parse: (query: string) => {
            return parseSorts(query);
        },
        serialize: (value: SortProperty[]) => {
            return stringifySorts(value);
        },
        scroll: false,
        defaultValue: defaultValue?.sort ?? [],
        shallow: true,
        throttleMs: 300
    }));*/

  return {
    page: page,
    setPage: setPage,
    pageSize: pageSize,
    setPageSize: setPageSize,
    //sort: -=,
    // setSort: setSort,

    // filters: filters,
    //  setFilters: setFilters,
  };
};

export default useTablePageParams;
