import {
  filterPayload,
  payloadMatchesNestedValue,
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
          { aKey: ['valueA', 'valueB', 'valueC'] },
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
    it('should go recursive and return true if at least a condition of the array is met', () => {
      expect(
        filterPayload(
          {
            aKey: [
              { anotherKey: 'anotherValue' },
              { yetAnotherKey: 'yetAnotherValue' },
              'valueC',
            ],
          },
          { aKey: { yetAnotherKey: 'yetAnotherValue' } },
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
    it('should not return an object if it doesn\'t match fully', () => {
      expect(
        filterPayload(
          { key1: { key2: 'ValueA' } },
          { key1: { key2: 'ValueA', key3: 'ValueB' } },
        ),
      ).toEqual(false);
    });
  });

  describe('payloadMatchesNestedValue', () => {
    it('should match', () => {
      expect(
        payloadMatchesNestedValue(['att1', 'att2', 'att3'], 'ValueA', {
          att1: { att2: { att3: 'ValueA' } },
        }),
      ).toEqual(true);
    });
    it('should not match if value differs', () => {
      expect(
        payloadMatchesNestedValue(['att1', 'att2', 'att3'], 'ValueA', {
          att1: { att2: { att3: 'ValueB' } },
        }),
      ).toEqual(false);
    });
    it('should not match if property is not there', () => {
      expect(
        payloadMatchesNestedValue(['att1', 'att2', 'att3'], 'ValueA', {
          att1: { att2: 'ValueA' },
        }),
      ).toEqual(false);
    });
    it('should match if there are other properties', () => {
      expect(
        payloadMatchesNestedValue(['att1', 'att2', 'att3'], 'ValueA', {
          att1: { att2: { att3: 'ValueA' } },
          att4: 'ValueB',
        }),
      ).toEqual(true);
    });
  });
});
