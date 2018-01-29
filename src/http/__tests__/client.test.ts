import {Array} from 'core-js/library/web/timers';

import {testCreateProduct, testCreateProductRaw, testCreateStore} from '../../testing/data';
import {Handle, ShopifyType, ShopifyTypes} from '../../types/base';
import {Method} from '../../types/routes';
import {ProductItem} from '../../types/shopify/product';
import {ShopItem} from '../../types/shopify/shop';
import {Store} from '../../types/store';
import {DEFAULT_FETCH_OPTS, ShopifyClient} from '../client';

const fetchMock = require('fetch-mock');
const expectedFetchOpts = {
  method: 'GET',
  mode: 'cors',
  cache: 'default',
  headers: {Authorization: 'Basic Og=='},
};

describe('Shopify HTTP Client', () => {
  it('DEFAULT_FETCH_OPTS has not changed', () => {
    expect(DEFAULT_FETCH_OPTS).toMatchSnapshot();
  });

  describe('Basic Authentication', () => {
    it('generates properly', () => {
      const store = testCreateStore({
        secrets: {
          _key: 'something-with',
          _password: '182948-decent-entropy',
        }
      });

      const client = new ShopifyClient(store);
      expect(client._basic_auth_hash())
          .toEqual('c29tZXRoaW5nLXdpdGg6MTgyOTQ4LWRlY2VudC1lbnRyb3B5');
    });
  });

  describe('ShopifyClient', () => {
    const store = testCreateStore();

    it('should instantiate', () => {
      const client = new ShopifyClient(store);

      expect(client).toBeTruthy();
      expect(client).toBeInstanceOf(ShopifyClient);
    });

    it('should merge user options properly', () => {
      const client = new ShopifyClient(store, {
        cache: 'no-cache',
        headers: {
          Important: 'Auth-Header',
          Authorization: 'INVALID!'  // it will *always* overwrite this header
        },
        mode: 'no-cors',
      });

      expect(client.options).toEqual({
        cache: 'no-cache',
        method: 'GET',
        headers: {
          Authorization: 'Basic Og==',
          Important: 'Auth-Header',
        },
        mode: 'no-cors',
      });
    });

    it('refuses to fulfill when given an unknown type', () => {
      const client = new ShopifyClient(store);

      expect(() => {
        client._request(Method.Fetch, 'ADASDASD' as ShopifyTypes);
      }).toThrowErrorMatchingSnapshot();
    });

    it('refuses to fulfill when routes cannot be determined', () => {
      const client = new ShopifyClient(store);
      delete client.routes[ShopifyTypes.Product];

      expect(() => {
        client.fetch(ShopifyTypes.Product);
      }).toThrowErrorMatchingSnapshot();
    });

    it('_request() works properly', (done) => {
      const client = new ShopifyClient(testCreateStore());
      fetchMock.get('https://localhost/admin/shop.json', {shop: {id: 1}});

      client._request<ShopItem>(Method.Fetch, ShopifyTypes.Shop)
          .then((result: ShopItem[]|null) => {
            const lastCall = fetchMock.lastCall();

            expect(lastCall[0]).toEqual('https://localhost/admin/shop.json');
            expect(lastCall[1]).toEqual({
              method: 'GET',
              mode: 'cors',
              cache: 'default',
              headers: {Authorization: 'Basic Og=='},
            });

            expect(result).toHaveLength(1);
            expect((result as ShopItem[])[0]).toBeInstanceOf(ShopItem);

            done();
          });
    });

    it('list() works properly', (done) => {
      const store = testCreateStore();
      const client = new ShopifyClient(store);

      fetchMock.reset();
      fetchMock.get('https://localhost/admin/products.json', {
        products: [
          testCreateProductRaw({id: 1, handle: 'example1'}),
          testCreateProductRaw({id: 2, handle: 'example2'}),
        ]
      });

      client.list<ProductItem<Handle>>(ShopifyTypes.Product)
          .then((result: Array<ProductItem<Handle>>|null) => {
            const lastCall = fetchMock.lastCall();

            expect(result).toHaveLength(2);
            expect((result as Array<ProductItem<Handle>>)[0])
                .toBeInstanceOf(ProductItem);
            expect((result as Array<ProductItem<Handle>>)[1])
                .toBeInstanceOf(ProductItem);
            expect(lastCall[0])
                .toEqual('https://localhost/admin/products.json');
            expect(lastCall[1]).toEqual(expectedFetchOpts);

            done();
          });
    });
  });
});