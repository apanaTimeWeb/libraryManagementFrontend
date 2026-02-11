import { FilterFn } from '@tanstack/react-table';

export const includesStringFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  const rawValue = row.getValue(columnId);
  if (rawValue === null || rawValue === undefined) return false;

  const value = String(rawValue).toLowerCase();
  return value.includes(String(filterValue ?? '').toLowerCase());
};

export const globalTextFilter: FilterFn<unknown> = (row, _columnId, filterValue) => {
  const query = String(filterValue ?? '').trim().toLowerCase();
  if (!query) return true;

  const searchable = Object.values(row.original as Record<string, unknown>)
    .filter((value) => value !== null && value !== undefined)
    .map((value) => String(value).toLowerCase())
    .join(' ');

  return searchable.includes(query);
};
