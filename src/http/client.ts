// Copyright (C) 2018 Sleep E-Z USA, Inc. / Evan Darwin
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
// 
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import {RequestCache, RequestMode} from 'node-fetch';

import {getOrFail} from '../lib/typing';
import {shopify_printf} from '../routing';
import {colorType} from '../theme';
import * as CoreTypes from '../types/base';
import {GLOBAL_SHOPKEEPER_ROUTES, ItemRoutes, Method} from '../types/routes';
import {Country$Raw, CountryItem} from '../types/shopify/country';
import {PageData$Raw, PageItem} from '../types/shopify/page';
import {ProductData$Raw, ProductItem} from '../types/shopify/product';
import {ShopData$Raw, ShopItem} from '../types/shopify/shop';
import {Store} from '../types/store';

export type GenericApiResponse = {
  [type: string]: {}|Array<{}>
};

export type RequestParams = {};
export type FetchRequestMethod = 'GET'|'POST'|'PUT'|'DELETE';
export type FetchOptions = {
  method: FetchRequestMethod,
  mode?: RequestMode,
  cache?: RequestCache
  headers?: {[handle: string]: string},
};

  export const DEFAULT_FETCH_OPTS: FetchOptions = {
    method: 'GET',
    mode: 'cors',
    cache: 'default'
  };


  export type GenericShopifyType =
      CoreTypes.ShopifyItem<CoreTypes.RawShopifyData, CoreTypes.UserData>;
  export class ShopifyClient {
    /**
     * Note: This creates a new Object as to not use a reference,
     *       we modify this value during testing.
     */
    routes: {[name: string]: ItemRoutes} =
        Object.assign({}, GLOBAL_SHOPKEEPER_ROUTES);
    options: FetchOptions;
    store: Store;

    constructor(store: Store, options?: Partial<FetchOptions>) {
      this.store = store;

      const userOptions = options;
      const headers = Object.assign({}, DEFAULT_FETCH_OPTS.headers,
        (userOptions ? userOptions.headers : {}),
        {'Authorization': `Basic ${this._basic_auth_hash()}`});

      this.options = {
        ...DEFAULT_FETCH_OPTS,
        ...userOptions,
        headers,
      };
    }

    _request<R extends GenericShopifyType>(
        method: Method, type: CoreTypes.ShopifyTypes): Promise<R[]> {
      const methodVerb = {
        [Method.List]: 'GET',
        [Method.Fetch]: 'GET',
        [Method.Count]: 'GET',
        [Method.Create]: 'POST',
        [Method.Update]: 'PUT',
        [Method.Delete]: 'DELETE',
      }[method];

      const routes = this.routes[type];
      if (!routes) {
        throw new Error(
            `Refusing to fulfill ${methodVerb} request: ` +
            `No routes available for type '${colorType(type)}'`);
      }

      const requestOpts = {
        ...this.options,
        method: methodVerb,
      };

      const methodUrl = routes.methods[method];
      if (!methodUrl) {
        throw new Error(
            `Refusing to fulfill ${methodVerb} request: ` +
            `Method not allowed for type ${type}`);
      }

      const url = [
        `https://${this.store.data.url}/admin`,
        shopify_printf(methodUrl, {prefix: routes.prefix}),
      ].join('/');

      return fetch(url, requestOpts as RequestInit)
          .then((res) => {
            if (!res.ok) {
              return Promise.reject(new Error(
                  `Request Failed: ${res.status} (${res.statusText})`));
            }

            return res.json();
          })
          .then(
              (data: GenericApiResponse) =>
                  (this.process_results(type, data) as R[]));
    }

    create<T extends GenericShopifyType>(itemType: CoreTypes.ShopifyTypes):
        Promise<T[]|null> {
      return this._request<T>(Method.Create, itemType);
    }

    update<T extends GenericShopifyType>(itemType: CoreTypes.ShopifyTypes):
        Promise<T[]|null> {
      return this._request<T>(Method.Update, itemType);
    }

    delete<T extends GenericShopifyType>(itemType: CoreTypes.ShopifyTypes):
        Promise<T[]|null> {
      return this._request(Method.Delete, itemType);
    }

    fetch<T extends GenericShopifyType>(itemType: CoreTypes.ShopifyTypes):
        Promise<T[]|null> {
      return this._request(Method.Fetch, itemType);
    }

    count<T extends GenericShopifyType>(itemType: CoreTypes.ShopifyTypes):
        Promise<T[]|null> {
      return this._request(Method.Count, itemType);
    }

    list<T extends GenericShopifyType>(itemType: CoreTypes.ShopifyTypes):
        Promise<T[]|null> {
      return this._request(Method.List, itemType);
    }

    process_result(
        type: CoreTypes.ShopifyTypes,
        data: CoreTypes.RawShopifyData): GenericShopifyType {
      if (type === CoreTypes.ShopifyTypes.Country) {
        return new CountryItem(this.store, data as Country$Raw<string>);
      }

      if (type === CoreTypes.ShopifyTypes.Product) {
        return new ProductItem(
            this.store, data as ProductData$Raw<CoreTypes.Handle>);
      }

      if (type === CoreTypes.ShopifyTypes.Shop) {
        return new ShopItem(this.store, data as ShopData$Raw);
      }

      if (type === CoreTypes.ShopifyTypes.Page) {
        return new PageItem(this.store, data as PageData$Raw<CoreTypes.Handle>);
      }

      throw new Error(
          `Failed to process: Unknown or unprocessable response given`);
    }
    process_results<R extends GenericShopifyType>(
        type: CoreTypes.ShopifyTypes, data: GenericApiResponse): R[] {
      if (!data) {
        throw new Error(`Failed to process Shopify results for type ${type}`);
      }

      const resultItems: CoreTypes.RawShopifyData|CoreTypes.RawShopifyData[] =
          getOrFail(data[type]);

      return (Array.isArray(resultItems) ? resultItems : [resultItems])
          .map((item) => this.process_result(type, item) as R);
    }

    _basic_auth_hash(): string {
      const secrets = this.store.data.secrets;
      const hashStr = `${secrets._key}:${secrets._password}`;

      return (new Buffer(hashStr)).toString('base64');
    }
  }