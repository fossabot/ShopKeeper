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

import {ShopifyTypes} from './base';

export enum Method {
  List = 'list',
  Count = 'count',
  Fetch = 'fetch',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

export type ItemRouteMethods = {
  list: string|null,
  count: string|null,
  fetch: string|null,
  create: string|null,
  update: string|null,
  delete: string|null,
  [method: string]: string|null,
};

export const STANDARD_ITEM_ROUTE_METHODS: ItemRouteMethods = {
  list: '{prefix}.json',
  create: '{prefix}.json',
  count: '{prefix}/count.json',
  fetch: '{prefix}/{id}.json',
  update: '{prefix}/{id}.json',
  delete: '{prefix}/{id}.json',
};

export const STANDARD_ITEM_ROUTES: ItemRoutes = {
  paginated: false,
  publicPath: null,
  methods: STANDARD_ITEM_ROUTE_METHODS,
  prefix: '',
};

export type ItemRoutes = {
  /**
   * The prefix is the type as documented by Shopify's Admin
   * API. For example the PriceRule type's prefix would become
   * 'price_rule'. This is used for automatic URL resolution.
   */
  prefix: string,

  // This is a string with supported variables that will
  // automatically be replaced by ShopKeeper's engine.
  publicPath: string|null,

  // Describes which methods are available and provides
  // additional context to support Shopify's complex routing
  methods: ItemRouteMethods,

  // Describes if retrieval of all objects requires
  // pagination via the REST API.
  paginated: boolean,
};

export const GLOBAL_SHOPKEEPER_ROUTES: {[name: string]: ItemRoutes} = {
  [ShopifyTypes.Country]: {
    ...STANDARD_ITEM_ROUTES,
    prefix: 'countries',
  },

  [ShopifyTypes.Province]: {
    ...STANDARD_ITEM_ROUTES,
    prefix: 'provinces',
    methods: {
      update: 'countries/{country_id}/provinces/{id}.json',
      fetch: 'countries/{country_id}/provinces/{id}.json',
      list: 'countries/{country_id}/provinces.json',
      count: 'countries/{country_id}/provinces/count.json',
      create: null,
      delete: null,
    }
  },

  [ShopifyTypes.Product]: {
    ...STANDARD_ITEM_ROUTES,
    publicPath: '{prefix}/{handle}',
    prefix: 'products',
    paginated: true,
  },

  [ShopifyTypes.Variant]: {
    ...STANDARD_ITEM_ROUTES,
    publicPath: 'products/{handle}?variant={id}',
    prefix: 'variants',
    paginated: false,
    methods: {
      ...STANDARD_ITEM_ROUTE_METHODS,
      list: 'products/{pid}/{prefix}.json',
      count: 'products/{pid}/{prefix}/count.json',
      delete: 'products/{pid}/{prefix}/delete.json',
    },
  },

  [ShopifyTypes.Redirect]: {
    ...STANDARD_ITEM_ROUTES,
    prefix: 'redirects',
    publicPath: '{origin}',
    paginated: true,
  },

  [ShopifyTypes.Shop]: {
    ...STANDARD_ITEM_ROUTES,
    prefix: 'shop',
    methods: {
      ...STANDARD_ITEM_ROUTE_METHODS,
      fetch: '{prefix}.json',
      count: null,
      create: null,
      update: null,
      delete: null,
      list: null,
    },
  },

  [ShopifyTypes.Page]: {
    ...STANDARD_ITEM_ROUTES,
    prefix: 'pages',
    methods: STANDARD_ITEM_ROUTE_METHODS,
  },
};