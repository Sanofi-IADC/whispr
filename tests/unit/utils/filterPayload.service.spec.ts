import {
  filterPayload,
} from '../../../src/utils/filterPayload.service';

describe('WhispFilter', () => {
  describe('filter', () => {
    it('should return false if there is no value attach to the filter key', () => {
      expect(filterPayload({ aKey: undefined }, { aKey: 'aValue' })).toEqual(
        false,
      );
    });
    it('should return false if there is no payload', () => {
      expect(filterPayload({ aKey: 'a value' }, undefined)).toEqual(false);
    });
    it('should return false if there is no corresponding key in the payload', () => {
      expect(
        filterPayload({ aKey: 'aValue' }, { notTheSameKey: 'aValue' }),
      ).toEqual(false);
    });
    it('should return true if all conditions are true', () => {
      expect(
        filterPayload(
          { aKey: 'aValue', anotherKey: 'anotherValue' },
          { aKey: 'aValue', anotherKey: 'anotherValue' },
        ),
      ).toEqual(true);
    });
    it('should return false if all conditions are not true', () => {
      expect(
        filterPayload(
          { aKey: 'aValue', anotherKey: 'anotherValue' },
          { aKey: 'aValue', anotherKey: 'notTheExpectedValue' },
        ),
      ).toEqual(false);
    });
    it('should go recursive and return true if all conditions are true', () => {
      expect(
        filterPayload(
          { aKey: { anotherKey: 'aValue' } },
          { aKey: { anotherKey: 'aValue' } },
        ),
      ).toEqual(true);
    });
    it('should go recursive and return false if a condition is not met', () => {
      expect(
        filterPayload(
          { aKey: { anotherKey: 'aValue' } },
          { aKey: { anotherKey: 'anotherValue' } },
        ),
      ).toEqual(false);
    });
    it('should return true if at least one condition of the array is met', () => {
      expect(
        filterPayload(
          { aKey: { $in: ['valueA', 'valueB', 'valueC'] } },
          { aKey: 'valueB' },
        ),
      ).toEqual(true);
    });
    it('should return false if not a condition of the array is met', () => {
      expect(
        filterPayload(
          { aKey: ['valueA', 'valueB', 'valueC'] },
          { aKey: 'valueD' },
        ),
      ).toEqual(false);
    });
    it('should return true if an array is matched', () => {
      expect(
        filterPayload(
          { aKey: ['valueA', 'valueB', 'valueC'] },
          { aKey: ['valueA', 'valueB', 'valueC'] },
        ),
      ).toEqual(true);
    });
    it('should go recursive and return true if at least a condition of the array is met', () => {
      expect(
        filterPayload(
          {
            aKey: { $in: [{ anotherKey: 'aValue' }, { anotherKey: 'bValue' }] },
          },
          { aKey: { anotherKey: 'aValue' } },
        ),
      ).toEqual(true);
    });
    it('should go recursive and return false if at least a condition of the array is met', () => {
      expect(
        filterPayload(
          {
            aKey: [
              { anotherKey: 'anotherValue' },
              { yetAnotherKey: 'yetAnotherValue' },
              'valueC',
            ],
          },
          { aKey: { yetAnotherKey: 'notTheExpectedValue' } },
        ),
      ).toEqual(false);
    });
    it('should return true if nested value matches', () => {
      expect(
        filterPayload(
          { 'aKey.anotherKey': 'valueA' },
          { aKey: { anotherKey: 'valueA' } },
        ),
      ).toEqual(true);
    });
    it('should return true if several nested values match', () => {
      expect(
        filterPayload(
          { 'key1.key2': 'valueA', 'key1.key3': 'valueB' },
          { key1: { key2: 'valueA', key3: 'valueB' } },
        ),
      ).toEqual(true);
    });
    it('should not return an object if it does not match fully', () => {
      expect(
        filterPayload(
          { key1: { key2: 'ValueA' } },
          { key1: { key2: 'ValueA', key3: 'ValueB' } },
        ),
      ).toEqual(false);
    });

    it('should return true if a mongo eq query succeeds', () => {
      expect(
        filterPayload(
          { 'key1.key2': { $eq: 'ValueA' } },
          { key1: { key2: 'ValueA' } },
        ),
      ).toEqual(true);
    });
    it('should return true if a mongo gte query succeeds', () => {
      expect(filterPayload({ key1: { $gte: 5 } }, { key1: 6 })).toEqual(true);
    });
    it('should return true if a complex mongo query succeeds', () => {
      expect(
        filterPayload(
          {
            key1: { $eq: 'valueA' },
            key2: { $gte: 5 },
            key3: { $in: ['value1', 'value2'] },
            'key4.key5': { $lt: 5 },
          },
          {
            key1: 'valueA',
            key2: 7,
            key3: 'value2',
            key4: { key5: 4 },
          },
        ),
      ).toEqual(true);
    });
    it('should return false if a mongo query fails', () => {
      expect(
        filterPayload(
          { 'key1.key2': { $eq: 'ValueA' } },
          { key1: { key2: 'ValueB' } },
        ),
      ).toEqual(false);
    });
    it('should handle a stringified filter', () => {
      const filter = JSON.stringify({
        key1: { $eq: 'valueA' },
        key2: { $gte: 5 },
        key3: { $in: ['value1', 'value2'] },
        'key4.key5': { $lt: 5 },
      });
      expect(
        filterPayload(
          filter,
          {
            key1: 'valueA',
            key2: 7,
            key3: 'value2',
            key4: { key5: 4 },
          },
        ),
      ).toEqual(true);
    });
  });
});
