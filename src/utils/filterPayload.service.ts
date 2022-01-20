import { Condition, guard, interpret } from '@ucast/mongo2js';
import { isEqual } from 'lodash';

export const matches = (
  filterValue: unknown,
  elementValue: unknown,
): boolean => {
  if (Array.isArray(filterValue)) {
    return filterValue.some((value) => matches(value, elementValue));
  }

  return isEqual(filterValue, elementValue);
};

export const payloadMatchesNestedValue = (
  keyArray: string[],
  nestedValue: unknown,
  payload: unknown,
): boolean => {
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

export const filterPayload = (
  filter: Record<string, unknown>,
  payload: unknown,
): boolean => {
  if (filter === undefined || payload === undefined) {
    return false;
  }
  let result = false;
  if (filter.operator) {
    result = interpret(filter as unknown as Condition, payload);
  } else {
    const test = guard(filter);
    result = test(payload as any);
  }
  return result;
};
