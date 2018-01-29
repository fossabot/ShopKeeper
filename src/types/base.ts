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

import {Required} from '../lib/typing';
import {ProductImageItem} from './shopify/image';
import {Metafield} from './shopify/metafield';
import {Store} from './store';

/**
 * These types define special strings used for reading Shopify
 * responses, as well as various other uses throughout the
 * system. Each [[ShopifyType]] class must provide an `itemType`
 * containing one of these enum values.
 */
export enum ShopifyTypes {
  Page = 'pages',
  Option = 'product_option',
  Variant = 'variants',
  ProductImage = 'product_image',

  Product = 'products',
  Country = 'countries',
  Metafield = 'metafield',
  Province = 'province',
  Redirect = 'redirect',
  Shop = 'shop',
}

/**
 * The ShopifyType is one of the foundational types for ShopKeeper.
 * All entities that can be managed with the ShopKeeper framework
 * must extend this class to maintain simplicity and interoperability.
 *
 * @typeparam R   This generic describes the shape of the incoming data
 *                as returned from Shopify's Admin API.
 *
 * @typeparam U   This generic describes the shape of the incoming data
 *                as provided locally by the user (it may not exist remotely)
 */
export abstract class ShopifyItem<R extends RawShopifyData,
                                            U extends UserData> {
  abstract itemType: ShopifyTypes;
  includesRemote: boolean;
  store: Store;
  data: Indexable&Partial<{handle: Handle}>&Required<U>;
  protected rawData: R;
  protected userData: U|null;

  constructor(store: Store, data: R, remote = false) {
    this.store = store;
    this.includesRemote = remote;
    this.rawData = data;
  }

  id(): number {
    return this.rawData.id || this.data.id || -1;
  }

  isResolved(): boolean {
    return (this.id() > -1);
  }

  addUserData(data: U) {
    this.userData = data;
  }

  toShopifyJSON(): R {
    return this.mergeToRaw();
  }

  abstract mergeToRaw(): R;
}

export abstract class LocalShopifyItem<D extends UserData> {
  abstract itemType: ShopifyTypes;
  abstract data: D;

  constructor(data: D) {
    this.data = data;
  }
}

/**
 * This is data given by the user to re-create the user's
 * intended Shopify item. This means that this type will
 * likely have optional fields as the user should be allowed
 * to define properties as they please (except required fields).
 *
 * **NOTE**: If the `id` field is provided in the user's config,
 * it will simply be ignored and replaced by the remote value.
 * Concurrently, the user should *never* define the `id` value
 * as it will differ between environments.
 */
export type UserData = {};

/**
 * This type is used to represent the raw JSON response as received
 * from Shopify. Since it is returned from Shopify, this **`id`**
 * value will be the preferred reference method.
 */
export type RawShopifyData = Indexable&{};
export type ShopifyData = Indexable&UserData;

export interface ShopifyType<D, I> { new(store: Store, data: D): I; }

/**
 * We specify a type to allow uniqueness among
 * types carrying a `handle` property.
 */
export type Handle = string;

/**
 * All Shopify types available in the scope of
 * ShopKeeper are referenced based on their ID
 * available from Shopify.
 */
export type Indexable = {
  id: number,
};

/**
 * The following Shopify types carry the 'handle'
 * element: Article, Blog, CustomCollection,
 *          SmartCollection, Page, Product, Blog
 */
export type Handleable<H extends Handle> = {
  handle: H,
};

export type Purchasable = {
  price?: number,
  comparePrice?: number
};

export type Purchasable$Raw = {
  price: number|null,
  compare_at_price: number|null
};

/**
 * The Shopify type provides a `title` field for
 * the name of the element. If available, the field
 * is always required.
 */
export type Titled = {
  title: string
};

export type Metafields = {
  metafields: Array<Metafield<string>>
};
export type Metafields$Raw = Metafields;

/**
 * The type is positional and thus can be given a
 * specified position during submission. No actions
 * are required in the user's projects to position
 * these besides re-ordering their array elements.
 */
export type Positional = Partial<Positional$Raw>;
export type Positional$Raw = {
  position: number
};

/**
 * The element carries a timestamp of when the
 * element was created.
 */
export type Date$CreatedAt = {
  createdAt: Date
};
export type Date$CreatedAt$Raw = {
  created_at: string
};

/**
 * The element carries a timestamp of when the
 * element was last updated. This value can
 * sometimes be modified after the fact.
 */
export type Date$UpdatedAt = {
  updatedAt: Date
};
export type Date$UpdatedAt$Raw = {
  updated_at: string
};

/**
 * The element carries a timestamp of when the
 * element was last published. This value can be
 * edited after the fact.
 */
export type Date$PublishedAt = {
  publishedAt?: Date|null
};
export type Date$PublishedAt$Raw = {
  published_at: string|null
};

/**
 * The element accepts simple HTML content in
 * the form of a string.
 */
export type Content$HTML = {
  html?: string|'',
  template?: string|null,
};

export type Content$HTML$Raw = {
  body_html: string
};

/**
 * The element accepts binary or other formatted data
 * and can be submitted to Shopify's servers
 */
export type Content$Binary = {
  path?: string,
  filename?: string
};
export type Content$Binary$Raw = {
  attachment?: string,
  filename?: string
};

/**
 * If the element allows for HTML we can specify a
 * template to render and replace the `body_html`
 * content. If the `template` parameter is specified
 * then the `body_html` will be overridden.
 */
export type Content$Template = {
  template?: string
};
export type Content$Template$Raw = {
  body_html: string
};

export type Image$Single = {
  image?: ProductImageItem|null
};
export type Image$Single$Raw = {
  image_id?: number
};

export type Image$Multiple = {
  images?: ProductImageItem[]
};
export type Image$Multiple$Raw = {
  images?: number[]
};