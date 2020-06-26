import { isEqual } from 'lodash';

export const matches = (filterValue: unknown, elementValue: unknown): boolean => {
  if (Array.isArray(filterValue)) {
    return filterValue.some((value) => matches(value, elementValue));
  }

  return isEqual(filterValue, elementValue);
};

export const payloadMatchesNestedValue = (
  keyArray: string[],
  nestedValue: unknown,
  payload: Record<string, unknown>,
) => {
  let currentObj: unknown = payload;

  while (keyArray.length > 1) {
    const key = keyArray.shift();

    if (!currentObj[key]) {
      return false;
    }
    currentObj = currentObj[key];
  }

  return matches(nestedValue, currentObj[keyArray.shift()]);
};

// eslint-disable-next-line max-len
export const filterPayload = (filter: Record<string, unknown>, payload: unknown): boolean => Object.keys(filter).every((key) => {
  const filterValue = filter[key];

  if (filterValue === undefined || payload === undefined) {
    return false;
  }

  const keyArray = key.split('.');
  if (keyArray.length !== 1) {
    return this.payloadMatchesNestedValue(keyArray, filterValue, payload);
  }

  return matches(filterValue, payload[key]);
});
