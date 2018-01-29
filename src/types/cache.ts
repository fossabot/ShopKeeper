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

import {GenericShopifyType} from '../http/client';
import {getOrNull} from '../lib/typing';
import {colorType, colorWarning} from '../theme';

import {ShopifyTypes} from './base';


export type StoreCacheDataElement = {
  ids: {[id: number]: number}; handles: {[handle: string]: number};
};

export type StoreCacheData = {
  indexes: {[name: string]: StoreCacheDataElement}; cache: GenericShopifyType[];
};

export const EMPTY_SHOPIFY_CACHE_DATA_ELEMENT: StoreCacheDataElement = {
  ids: {},
  handles: {}
};
export const EMPTY_SHOPIFY_CACHE: StoreCacheData = {
  indexes: {
    [ShopifyTypes.Shop]: EMPTY_SHOPIFY_CACHE_DATA_ELEMENT,
    [ShopifyTypes.Product]: EMPTY_SHOPIFY_CACHE_DATA_ELEMENT,
    [ShopifyTypes.Page]: EMPTY_SHOPIFY_CACHE_DATA_ELEMENT,
    [ShopifyTypes.ProductImage]: EMPTY_SHOPIFY_CACHE_DATA_ELEMENT,
    [ShopifyTypes.Option]: EMPTY_SHOPIFY_CACHE_DATA_ELEMENT,
    [ShopifyTypes.Variant]: EMPTY_SHOPIFY_CACHE_DATA_ELEMENT,
    [ShopifyTypes.Province]: EMPTY_SHOPIFY_CACHE_DATA_ELEMENT,
    [ShopifyTypes.Country]: EMPTY_SHOPIFY_CACHE_DATA_ELEMENT,
  },
  cache: [],
};

export class StoreCache {
  data: StoreCacheData = Object.assign({}, EMPTY_SHOPIFY_CACHE);

  _validateType(type: ShopifyTypes) {
    if (type in this.data.indexes) return;

    throw new Error(
        `Refusing to write cache for unknown ` +
        `type '${type}'. Please report this issue.`);
  }

  findById<T extends GenericShopifyType>(type: ShopifyTypes, id: number): T
      |undefined {
    this._validateType(type);

    if (id in this.data.indexes[type].ids) {
      const pos = this.data.indexes[type].ids[id];
      return this.data.cache[pos] as T;
    }

    return undefined;
  }

  findByHandle<T extends GenericShopifyType>(
      type: ShopifyTypes, handle: string): T|undefined {
    this._validateType(type);

    if (handle in this.data.indexes[type].handles) {
      const pos = this.data.indexes[type].handles[handle];
      return this.data.cache[pos] as T;
    }

    return undefined;
  }

  register<T extends GenericShopifyType>(elem: T): T {
    const id = elem.id();
    const type = elem.itemType;
    const handle = getOrNull<string>(elem.data['handle']);

    if (id < 0) {
      throw new Error(
          `Fatal: Refusing to cache item with negative ID. ` +
          `This means that an instance's placeholder object was not replaced` +
          ` before reaching the cache. Please submit an issue.`);
    }

    if (!id) {
      throw new Error(
          `Expected item ID to be resolved already: ` +
          `${colorWarning('id')} is ${colorType('null')}`);
    }

    this._validateType(type);

    const foundId = this.findById(type, id);
    const foundHandle = (handle) ? this.findByHandle(type, handle) : null;

    if (foundId || foundHandle) {
      return (foundId || foundHandle) as T;
    }

    const newPos = this.data.cache.length;

    this.data.cache.push(elem);
    this.data.indexes[type].ids[id] = newPos;

    if (handle) {
      this.data.indexes[type].handles[handle] = newPos;
    }

    return this.data.cache[newPos] as T;
  }
}