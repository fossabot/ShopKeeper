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

import {ParsedArgs} from 'minimist';

import {Handle} from '../types/base';
import {Config, Config$User} from '../types/config';
import {OptionData$Raw} from '../types/shopify/option';
import {ProductData$LocalOnly, ProductData$Raw, ProductItem} from '../types/shopify/product';
import {Variant$Raw, VariantItem} from '../types/shopify/variant';
import {Store, StoreData} from '../types/store';

const path = require('path');

export class UndefinedStackError extends Error {
  constructor(msg: string) {
    super(msg);
    this.stack = undefined;
  }
}

export function testCreateParsedArgs(data: Partial<ParsedArgs> = {}):
    ParsedArgs {
  const defaults: ParsedArgs = {
    '_': [],
    'e': null,
    'env': null,
  };

  return Object.assign({}, defaults, data);
}

export function testCreateConfig(data: Partial<Config> = {}): Config {
  const defaults: Config = {
    data: path.resolve('.'),
    stores: {
      testing: testCreateStore(),
    },
    templates: {
      engines: [],
      path: path.resolve('.'),
    }
  };

  return Object.assign({}, defaults, data);
}

export function testCreateStore(data: Partial<StoreData> = {}): Store {
  const defaultTestStoreData = {
    url: 'localhost',
    secrets: {
      _key: '',
      _password: '',
    },
    production: false,
  };

  return new Store({
    ...defaultTestStoreData,
    ...data,
  });
}

export function testCreateVariantRaw(data: Partial<Variant$Raw<Handle>> = {}):
    Variant$Raw<Handle> {
  const defaultVariantDate = '2010-05-04T00:00:00.000Z';

  return {
    id: 125,
    barcode: null,
    compare_at_price: null,
    created_at: defaultVariantDate,
    fulfillment_service: 'default',
    grams: null,
    inventory_management: 'shopify',
    inventory_policy: 'deny',
    inventory_quantity: 0,
    options: [],
    position: 0,
    price: 0,
    product_id: 175,
    requires_shipping: true,
    sku: null,
    taxable: true,
    title: 'Variant',
    updated_at: defaultVariantDate,
    weight: 0,
    weight_unit: 'lb',
    ...data,
  };
}

export function testCreateOption(data: Partial<OptionData$Raw>):
    OptionData$Raw {
  return {
    id: 1000,
    name: 'Default',
    position: 0,
    product_id: -1,
    values: ['Default Title'],

    ...data,
  };
}

export function testCreateProductRaw(data: Partial<ProductData$Raw<Handle>>):
    ProductData$Raw<Handle> {
  const date = '2000-01-01T00:00:00.000Z';
  const variants: Array<Variant$Raw<Handle>> = [testCreateVariantRaw()];
  const options: OptionData$Raw[] = [{
    id: 12049102,
    name: 'Default',
    values: ['A', 'B'],
    position: 1,
    product_id: 50,
  }];

  return {
    id: 50,
    handle: 'example-handle',
    title: 'Example Title',

    body_html: '',

    price: 0,
    compare_at_price: 0,

    image_id: undefined,
    images: [],
    product_type: null,

    created_at: date,
    updated_at: date,
    published_at: date,

    tags: '',
    published_scope: 'global',
    template_suffix: null,
    vendor: null,

    options: [],

    variants,
    ...data,
  };
}

export function testCreateProduct(
    store: Store, data: Partial<ProductData$Raw<Handle>>): ProductItem<Handle> {
  const productData = testCreateProductRaw(data);
  return new ProductItem(store, productData, true);
}