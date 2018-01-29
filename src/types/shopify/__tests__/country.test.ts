import {testCreateStore} from '../../../testing/data';
import {ShopifyTypes} from '../../base';
import {CountryItem} from '../country';


describe('Country Shopify Type', () => {
  const store = testCreateStore();
  const countryData = {
    id: 1,
    code: 'US',
    name: 'United States',
    provinces: [],
    tax: 0.05,
    tax_name: 'Sales Tax',
  };

  it('defines itemType properly', () => {
    const country = new CountryItem(store, countryData);
    expect(country.itemType).toEqual(ShopifyTypes.Country);
  });

  it('is instantiable', () => {
    const country = new CountryItem(store, countryData);

    expect(country).toBeDefined();
    expect(country).toBeInstanceOf(CountryItem);
  });

  it('stores rawData as data properly', () => {
    const country = new CountryItem(store, countryData);

    expect(country.data).toEqual(countryData);
    expect(country.toShopifyJSON()).toEqual(countryData);
  });
});