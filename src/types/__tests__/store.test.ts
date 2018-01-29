import {testCreateStore} from '../../testing/data';
import {ShopifyTypes} from '../base';
import {OptionItem} from '../shopify/option';
import {Store} from '../store';


describe('Store', () => {
  it('is instantiable', () => {
    const store = testCreateStore();

    expect(store).toBeDefined();
    expect(store).toBeInstanceOf(Store);
  });

  it('proxies registering items to the cache', () => {
    const store = testCreateStore();
    const testOption = new OptionItem(store, {
      id: 1,
      product_id: 2,
      position: 1,
      name: 'test',
      values: ['test'],
    });

    store.registerToCache(testOption);

    expect(store.cache.data.indexes[ShopifyTypes.Option].ids).toEqual({'1': 0});
    expect(store.cache.data.indexes[ShopifyTypes.Option].handles).toEqual({});
    expect(store.cache.data.cache.length).toEqual(1);
    expect(store.cache.data.cache[0]).toEqual(testOption);
  });
});
