import { WhispResolver } from '../../../src/whisp/whisp.resolver';

describe('WhispResolver', () => {
  describe('filter', () => {
    it('should return true if no filter was provided', () => {
      expect(WhispResolver.filter(undefined, {})).toEqual(true);
    });
    it('should return false if there is no value attach to the filter key', () => {
      expect(WhispResolver.filter(
        { aKey: undefined },
        { aKey: 'aValue' },
      )).toEqual(false);
    });
    it('should return false if there is no payload', () => {
      expect(WhispResolver.filter(
        { aKey: 'a value' },
        undefined,
      )).toEqual(false);
    });
    it('should return false if there is no corresponding key in the payload', () => {
      expect(WhispResolver.filter(
        { aKey: 'aValue' },
        { notTheSameKey: 'aValue' },
      )).toEqual(false);
    });
    it('should return true if all conditions are true', () => {
      expect(WhispResolver.filter(
        { aKey: 'aValue', anotherKey: 'anotherValue' },
        { aKey: 'aValue', anotherKey: 'anotherValue' },
      )).toEqual(true);
    });
    it('should return false if all conditions are not true', () => {
      expect(WhispResolver.filter(
        { aKey: 'aValue', anotherKey: 'anotherValue' },
        { aKey: 'aValue', anotherKey: 'notTheExpectedValue' },
      )).toEqual(false);
    });
    it('should go recursive and return true if all conditions are true', () => {
      expect(WhispResolver.filter(
        { aKey: { anotherKey: 'aValue' } },
        { aKey: { anotherKey: 'aValue' } },
      )).toEqual(true);
    });
    it('should go recursive and return false if a condition is not met', () => {
      expect(WhispResolver.filter(
        { aKey: { anotherKey: 'aValue' } },
        { aKey: { anotherKey: 'anotherValue' } },
      )).toEqual(false);
    });
    it('should return true if at least one condition of the array is met', () => {
      expect(WhispResolver.filter(
        { aKey: ['valueA', 'valueB', 'valueC'] },
        { aKey: 'valueB' },
      )).toEqual(true);
    });
    it('should return false if not a condition of the array is met', () => {
      expect(WhispResolver.filter(
        { aKey: ['valueA', 'valueB', 'valueC'] },
        { aKey: 'valueD' },
      )).toEqual(false);
    });
    it('should go recursive and return true if at least a condition of the array is met', () => {
      expect(WhispResolver.filter(
        { aKey: [{ anotherKey: 'anotherValue' }, { yetAnotherKey: 'yetAnotherValue' }, 'valueC'] },
        { aKey: { yetAnotherKey: 'yetAnotherValue' } },
      )).toEqual(true);
    });
    it('should go recursive and return false if at least a condition of the array is met', () => {
      expect(WhispResolver.filter(
        { aKey: [{ anotherKey: 'anotherValue' }, { yetAnotherKey: 'yetAnotherValue' }, 'valueC'] },
        { aKey: { yetAnotherKey: 'notTheExpectedValue' } },
      )).toEqual(false);
    });
    it('should return true if nested value matches', () => {
      expect(WhispResolver.filter(
        { 'aKey.anotherKey': 'valueA' },
        { aKey: { anotherKey: 'valueA' } },
      )).toEqual(true);
    });
    it('should return true if several nested values match', () => {
      expect(WhispResolver.filter(
        { 'key1.key2': 'valueA', 'key1.key3': 'valueB' },
        { key1: { key2: 'valueA', key3: 'valueB' } },
      )).toEqual(true);
    });
    it('should not return an object if it doesn\'t match fully', () => {
      expect(WhispResolver.filter(
        { key1: { key2: 'ValueA' } },
        { key1: { key2: 'ValueA', key3: 'ValueB' } },
      )).toEqual(false);
    });
  });

  describe('payloadMatchesNestedValue', () => {
    it('should match', () => {
      expect(WhispResolver.payloadMatchesNestedValue(
        ['att1', 'att2', 'att3'],
        'ValueA',
        { att1: { att2: { att3: 'ValueA' } } },
      )).toEqual(true);
    });
    it('should not match if value differs', () => {
      expect(WhispResolver.payloadMatchesNestedValue(
        ['att1', 'att2', 'att3'],
        'ValueA',
        { att1: { att2: { att3: 'ValueB' } } },
      )).toEqual(false);
    });
    it('should not match if property is not there', () => {
      expect(WhispResolver.payloadMatchesNestedValue(
        ['att1', 'att2', 'att3'],
        'ValueA',
        { att1: { att2: 'ValueA' } },
      )).toEqual(false);
    });
    it('should match if there are other properties', () => {
      expect(WhispResolver.payloadMatchesNestedValue(
        ['att1', 'att2', 'att3'],
        'ValueA',
        { att1: { att2: { att3: 'ValueA' } }, att4: 'ValueB' },
      )).toEqual(true);
    });
  });
});
