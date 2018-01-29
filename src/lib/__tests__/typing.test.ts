import {dateOrUndefined, dateToShopify, getOrFail, getOrNull, getOrUndefined} from '../typing';


describe('ShopKeeper TypeScript Utilities', () => {
  describe('Dates', () => {
    const dateStr = '2000-01-13T00:00:00.000-07:00';
    const dateISOStr = '2000-01-13T07:00:00.000Z';
    const dateStrWrong = '1/20/17*10';
    const date = new Date(dateStr);

    it('dateOrUndefined()', () => {
      expect(dateOrUndefined(null)).toBeUndefined();
      expect(dateOrUndefined(dateStrWrong)).toBeUndefined();
      expect(dateOrUndefined(dateStr)).toBeInstanceOf(Date);
    });

    it('dateToShopify()', () => {
      expect(dateToShopify(date)).toEqual(dateISOStr);
    });
  });

  describe('Generic', () => {
    it('getOrUndefined()', () => {
      expect(getOrUndefined('a')).toEqual('a');
      expect(getOrUndefined('')).toEqual('');
      expect(getOrUndefined(0)).toEqual(0);
      expect(getOrUndefined(-1)).toEqual(-1);
      expect(getOrUndefined(false)).toEqual(false);
      expect(getOrUndefined(undefined)).toBeUndefined();
      expect(getOrUndefined(null)).toBeUndefined();
    });

    it('getOrNull()', () => {
      expect(getOrNull('a')).toEqual('a');
      expect(getOrNull('')).toEqual('');
      expect(getOrNull(0)).toEqual(0);
      expect(getOrNull(-1)).toEqual(-1);
      expect(getOrNull(false)).toEqual(false);
      expect(getOrNull(null)).toBeNull();
    });

    it('getOrFail()', () => {
      expect(getOrFail('a')).toEqual('a');
      expect(getOrFail('')).toEqual('');
      expect(getOrFail(0)).toEqual(0);
      expect(getOrFail(-1)).toEqual(-1);
      expect(getOrFail(false)).toEqual(false);
      expect(() => {
        getOrFail(null);
      }).toThrowError('Failed to fetch expected item');
      expect(() => {
        getOrFail(undefined);
      }).toThrowError('Failed to fetch expected item');
    });
  });
});