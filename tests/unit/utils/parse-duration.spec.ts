import parse from 'parse-duration';

describe('parse-duration', () => {
  it('simple parse', () => {
    expect(parse('1m', 's')).toBe(60);
    expect(parse('1h', 's')).toBe(3600);
    expect(parse('1h10sec', 's')).toBe(3610);
  });

  it('crazy parsing feature', () => {
    expect(parse("i'm not sure but 128 min -8min would be great", 'm')).toBe(120);
    expect(parse('120min  40min  -1hour', 'm')).toBe(100);
  });

  it('parse a number to secondes', () => {
    expect(Number('12.12') * 1000).toBe(12120);
    expect(parse('10000', 's')).toBe(10);
  });

  it('error parse', () => {
    expect(Number('not a number')).toBe(NaN);
    expect(parse('not a duration', 's')).toBe(null);
  });
});
