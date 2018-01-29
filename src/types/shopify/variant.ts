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

import {dateOrUndefined, dateToShopify, getOrFail, getOrNull, getOrUndefined} from '../../lib/typing';
import * as CoreTypes from '../base';
import {InventoryData, Shippable, Shippable$Raw} from '../inventory';
import {Store} from '../store';
import {OptionData$Raw, OptionItem} from './option';
import {ProductItem} from './product';

export type VariantData$User<H extends CoreTypes.Handle> =
    CoreTypes
        .Indexable&  // one-to-many relationship

    Shippable&  // this item carries shipping props
    CoreTypes
        .Purchasable&  // other common properties
    CoreTypes.Titled&CoreTypes.Image$Single&CoreTypes.Date$CreatedAt&
    CoreTypes.Date$UpdatedAt&{
  product?: ProductItem<H>;
  sku?: string, options: Array<OptionItem<H>>, taxable?: boolean,
      barcode?: string|null,
};

export type Variant$Raw<H extends CoreTypes.Handle> =
    CoreTypes.Indexable&Shippable$Raw&CoreTypes.Titled&
    CoreTypes.Purchasable$Raw&CoreTypes.Positional$Raw&
    CoreTypes.Date$CreatedAt$Raw&CoreTypes.Date$UpdatedAt$Raw&{
      product_id: number,
      sku: string | null,
      options: OptionData$Raw[],
      taxable: boolean,
      barcode: string | null,
    };

export class VariantItem<H extends CoreTypes.Handle> extends
    CoreTypes.ShopifyItem<Variant$Raw<H>, VariantData$User<H>> {
  itemType = CoreTypes.ShopifyTypes.Variant;

  constructor(store: Store, data: Variant$Raw<H>, product: ProductItem<H>) {
    super(store, data);

    const {
      id,
      title,
      options,
      barcode,
      sku,
      grams,
      price,
      compare_at_price,
      created_at,
      updated_at,
      taxable,
      inventory_management,
      inventory_policy,
      inventory_quantity,
      requires_shipping,
      fulfillment_service,
      weight,
      weight_unit
    } = data;

    const inventory: InventoryData = {
      fulfillment: fulfillment_service,
      manager: inventory_management,
      policy: inventory_policy,
      quantity: inventory_quantity,
    };

    this.data = {
      id,
      title,
      options: [],
      product,

      price: getOrUndefined(price),
      comparePrice: getOrUndefined(compare_at_price),

      sku: getOrUndefined(sku),
      taxable,
      barcode,
      grams: getOrNull(grams) || 0,
      inventory,
      requiresShipping: requires_shipping,
      createdAt: getOrFail(dateOrUndefined(created_at)),
      updatedAt: getOrFail(dateOrUndefined(updated_at)),

      image: null,

      weight: weight || 0,
      weightUnit: weight_unit,
    };
  }

  mergeToRaw(): Variant$Raw<H> {
    const {
      id,
      title,
      options,
      price,
      comparePrice,
      sku,
      taxable,
      barcode,
      grams,
      inventory,
      image,
      requiresShipping,
      weight,
      weightUnit,
      createdAt,
      updatedAt
    } = this.data;

    const product = getOrFail<ProductItem<H>>(this.data.product);
    const rawResult: Variant$Raw<H> = {
      id,
      title,
      options: [],
      product_id: getOrFail(product.id()),
      price: getOrNull(price),
      compare_at_price: getOrNull(comparePrice),
      position: 0,
      grams,
      sku: getOrNull(sku),
      barcode: getOrNull(barcode),
      taxable: getOrNull(taxable) || true,
      fulfillment_service: inventory.fulfillment,
      inventory_quantity: inventory.quantity || 0,
      inventory_management: inventory.manager,
      inventory_policy: inventory.policy,
      requires_shipping: requiresShipping,
      weight,
      weight_unit: weightUnit,

      created_at: dateToShopify(getOrFail(createdAt)),
      updated_at: dateToShopify(getOrFail(updatedAt)),
    };

    return rawResult;
  }
}
