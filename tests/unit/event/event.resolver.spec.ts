import { EventResolver } from '../../../src/event/event.resolver';

describe('EventResolver', () => {
  describe('filter', () => {
    it('should return true if no filter was provided', () => {
      expect(EventResolver.filter(undefined, {})).toEqual(true);
    });
    it('should return false if there is no value attach to the filter key', () => {
      expect(EventResolver.filter(
        { aKey: undefined },
        { aKey: 'aValue' },
      )).toEqual(false);
    });
    it('should return false if there is no payload', () => {
      expect(EventResolver.filter(
        { aKey: 'a value' },
        undefined,
      )).toEqual(false);
    });
    it('should return false if there is no corresponding key in the payload', () => {
      expect(EventResolver.filter(
        { aKey: 'aValue' },
        { notTheSameKey: 'aValue' },
      )).toEqual(false);
    });
    it('should return true if all conditions are true', () => {
      expect(EventResolver.filter(
        { aKey: 'aValue', anotherKey: 'anotherValue' },
        { aKey: 'aValue', anotherKey: 'anotherValue' },
      )).toEqual(true);
    });
    it('should return false if all conditions are true', () => {
      expect(EventResolver.filter(
        { aKey: 'aValue', anotherKey: 'anotherValue' },
        { aKey: 'aValue', anotherKey: 'notTheExpectedValue' },
      )).toEqual(false);
    });
    it('should go recursive and return true if all conditions are true', () => {
      expect(EventResolver.filter(
        { aKey: { anotherKey: 'aValue' } },
        { aKey: { anotherKey: 'aValue' } },
      )).toEqual(true);
    });
    it('should go recursive and return false if a condition is not met', () => {
      expect(EventResolver.filter(
        { aKey: { anotherKey: 'aValue' } },
        { aKey: { anotherKey: 'anotherValue' } },
      )).toEqual(false);
    });
    it('should return true if at least one condition of the array is met', () => {
      expect(EventResolver.filter(
        { aKey: ['valueA', 'valueB', 'valueC'] },
        { aKey: 'valueB' },
      )).toEqual(true);
    });
    it('should return false if not a condition of the array is met', () => {
      expect(EventResolver.filter(
        { aKey: ['valueA', 'valueB', 'valueC'] },
        { aKey: 'valueD' },
      )).toEqual(false);
    });
    it('should go recursive and return true if at least a condition of the array is met', () => {
      expect(EventResolver.filter(
        { aKey: [{ anotherKey: 'anotherValue' }, { yetAnotherKey: 'yetAnotherValue' }, 'valueC'] },
        { aKey: { yetAnotherKey: 'yetAnotherValue' } },
      )).toEqual(true);
    });
    it('should go recursive and return false if at least a condition of the array is met', () => {
      expect(EventResolver.filter(
        { aKey: [{ anotherKey: 'anotherValue' }, { yetAnotherKey: 'yetAnotherValue' }, 'valueC'] },
        { aKey: { yetAnotherKey: 'notTheExpectedValue' } },
      )).toEqual(false);
    });
  });
});
