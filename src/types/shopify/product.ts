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

import {Option, Variant} from '../../lib/client';
import {dateOrUndefined, dateToShopify, getOrFail, getOrNull, getOrUndefined} from '../../lib/typing';
import * as CoreTypes from '../base';
import {Store} from '../store';

import {ProductImageItem} from './image';
import {OptionData$Raw, OptionItem} from './option';
import {Variant$Raw, VariantItem} from './variant';


export type ProductData$User<H extends CoreTypes.Handle> =
    CoreTypes.Handleable<H>&CoreTypes.Content$HTML&{
  title: string;
  price?: number|null;
  comparePrice?: number|null;

  createdAt?: Date, updatedAt?: Date, publishedAt?: Date,

      image?: ProductImageItem|null, images?: ProductImageItem[]|never[],

      vendor?: string;
  productType?: string;
  templateSuffix?: string;
  publishedScope?: string;
  tags?: string[];
  variants: Array<VariantItem<H>>;
  options: Array<OptionItem<H>>;
};

export type ProductData$LocalOnly<H extends CoreTypes.Handle> =
    ProductData$User<H>&{
  unresolvedVariants: Array<Variant<H>>;
  unresolvedOptions: Array<Option<H>>;
};

export type ProductData$Raw<H extends CoreTypes.Handle> =
    CoreTypes.Indexable&CoreTypes.Titled&CoreTypes.Purchasable$Raw&
    CoreTypes.Image$Single$Raw&CoreTypes.Image$Multiple$Raw&
    CoreTypes.Date$CreatedAt$Raw&CoreTypes.Date$UpdatedAt$Raw&
    CoreTypes.Date$PublishedAt$Raw&CoreTypes.Content$HTML$Raw&{
  handle: H;

  variants: Array<Variant$Raw<H>>;
  options: OptionData$Raw[];

  tags: string|null;
  vendor: string|null;
  product_type: string|null;
  template_suffix: string|null;
  published_scope: string;
};

export class ProductItem<H extends CoreTypes.Handle> extends
    CoreTypes.ShopifyItem<ProductData$Raw<H>, ProductData$User<H>> {
  itemType = CoreTypes.ShopifyTypes.Product;

  constructor(store: Store, data: ProductData$Raw<H>, remote = false) {
    super(store, data, remote);

    const {
      id,
      title,
      handle,
      product_type,
      vendor,
      options: rawOptions,
      variants: rawVariants,
      body_html,
      image_id,
      images,
      price,
      compare_at_price: comparePrice,
      created_at,
      updated_at,
      published_at,
      published_scope: publishedScope,
      tags,
      template_suffix: templateSuffix
    } = data;

    const options = rawOptions.map((option) => {
      return new OptionItem<H>(store, option);
    });

    const variants = rawVariants.map((variant) => {
      return new VariantItem<H>(store, variant, this);
    });

    this.data = {
      id,
      title,
      handle,
      productType: getOrUndefined(product_type),
      vendor: getOrUndefined(vendor),

      // TODO
      options,
      variants,

      template: null,
      html: body_html,

      // TODO: Proper image loading
      image: null,
      images: [],

      tags: (tags === undefined || !tags) ? undefined :
                                            tags.split(',').map(t => t.trim()),

      price: getOrUndefined<number>(price),
      comparePrice: getOrUndefined<number>(comparePrice),

      createdAt: dateOrUndefined(created_at),
      updatedAt: dateOrUndefined(updated_at),
      publishedAt: dateOrUndefined(published_at),

      publishedScope,
      templateSuffix: getOrUndefined(templateSuffix),
    };

    store.registerToCache(this);
  }

  mergeToRaw(): ProductData$Raw<H> {
    const {
      id,
      title,
      handle,
      productType,
      vendor,
      price,
      comparePrice,
      template,
      html,
      createdAt,
      updatedAt,
      publishedAt,
      publishedScope,
      variants,
      options,
      tags,
      templateSuffix,
    } = this.data;

    const renderedContent = (!!template) ? template : html || '';

    const rawResult: ProductData$Raw<H> = {
      id,
      title,
      handle,

      tags: (tags || ['']).join(','),
      body_html: renderedContent,

      vendor: getOrNull(vendor),
      price: getOrNull(price),
      compare_at_price: getOrNull(comparePrice),
      product_type: getOrNull(productType),

      created_at: dateToShopify(getOrFail(createdAt)),
      updated_at: dateToShopify(getOrFail(updatedAt)),
      published_at: (!publishedAt) ? null : dateToShopify(publishedAt),

      variants: [],
      options: [],

      // TODO: Use global defaults here
      published_scope: getOrNull(publishedScope) || 'global',
      template_suffix: getOrNull(templateSuffix),
    };

    return rawResult;
  }
}
