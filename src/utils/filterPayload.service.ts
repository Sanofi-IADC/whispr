import { Query } from 'mingo';

export const filterPayload = (
  filter: Record<string, unknown> | string,
  payload: any,
): boolean => {
  if (filter === undefined || payload === undefined) {
    return false;
  }
  let filterObject;
  if (typeof filter === 'string') {
    filterObject = JSON.parse(filter);
  } else if (typeof filter === 'object') {
    filterObject = filter;
  }
  const query = new Query(filterObject);
  return query.test(payload);
};
