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

/**
 * This value describes the inventory management service
 * set as the store default, or set on a per-product basis.
 * The default manager is Shopify itself, but you can build
 * a custom InventoryService using the Shopify API.
 *
 * Shopify's thoroughly detailed documentation is available here:
 *  https://help.shopify.com/api/reference/fulfillmentservice
 *
 * @default `"shopify"`
 */
export type InventoryManager = 'shopify'|string;

/**
 * This value describes the fulfillment service that Shopify
 * uses for fulfilling orders. By default, purchase notifications
 * will stay within the Shopify platform (`manual`), but
 * alternative fulfillment methods can be set up.
 *
 * Shopify documentation on Fulfillment Methods:
 *  https://help.shopify.com/api/reference/fulfillmentservice
 *
 * @default `"manual"`
 */
export type InventoryFulfillment = 'manual'|string;

/**
 * This property describes the behavior of how Shopify
 * will handle purchases after a `Product`'s inventory
 * has run out of stock.
 *
 * **`continue`** - Allow the user to continue checking
 * out and let the [[InventoryData.quantity]] underflow into the negatives.
 *
 * **`deny`** - Refuse to let customers purchase this item
 * until the stock is replenished.
 *
 * @default `"continue"`
 */
export type InventoryPolicy = 'continue'|'deny';

/**
 * This option describes the unit that `Product` weights
 * are defined in.
 *
 * @default `"lb"`
 */
export type ShippingWeightUnit = 'k'|'kg'|'oz'|'lb';

/**
 * This is the user-facing representation of Shopify's
 * inventory configuration options. This type should be
 * defined in user created objects where inventory options
 * are applicable ([[ProductItem]], [[VariantItem]]).
 */
export type InventoryData = {
  fulfillment: InventoryFulfillment,
  manager: InventoryManager,
  policy: InventoryPolicy,
  quantity?: number,
};

export type Shippable$Raw = {
  grams: number|null,
  weight: number|null,
  weight_unit: ShippingWeightUnit,
  requires_shipping: boolean,
  inventory_management: InventoryManager,
  fulfillment_service: InventoryFulfillment,
  inventory_policy: InventoryPolicy,
  inventory_quantity: number,
};

export type Shippable = {
  grams: number,
  weight: number,
  weightUnit: ShippingWeightUnit,
  requiresShipping: boolean,
  inventory: InventoryData,
};

export const DEFAULT_INVENTORY: InventoryData = {
  fulfillment: 'manual',
  manager: 'shopify',
  policy: 'deny',
};